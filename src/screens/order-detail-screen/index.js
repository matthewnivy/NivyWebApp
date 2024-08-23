import React, { useState, useContext, useCallback, useEffect } from "react";
import { Mainheader, SideBar } from "../../components/index";
import { allStrings } from "../../commons/index";
import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage/index";
import OrderDetailsContainer from "../../components/order-details-container";
import { useParams } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import "./style.scss";
import { fetchOrderDetailsHistory } from "../../utills/rest-apis/ApiHandeling";
import { JSONToObject } from "../../utills/helpers/AuthHelper";
import { useLocation } from "react-router-dom";

export function OrderDetails() {
  const orderId = useParams();
  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [orderDetails, setOrderDetails] = useState([]);

  const { primaryColor, setPrimaryColor, setVendorOrderId } =
    useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));

  let urlParam = JSONToObject(getData(keys.urlParameters));
  let { vendorOrderId } = useLocation();
  setVendorOrderId(vendorOrderId);

  useEffect(() => {
    const id = orderId.id;
    fetchOrderDetail(id.toString(), vendorOrderId, urlParam.venueId);
  }, []);

  const fetchOrderDetail = async (orderId, vendorOrderId, venueId) => {
    let response = await fetchOrderDetailsHistory(
      orderId,
      vendorOrderId,
      venueId
    );
    if (response) {
      setOrderDetails(response?.content?.vendorsItems);
    }
  };

  var scrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);
  const preventDefaultKeys = useCallback((event) => {
    if (scrollKeys[event.keyCode]) {
      event.preventDefault();
      return false;
    }
  }, []);

  function disableMainBody() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultKeys, false);

    document
      .getElementsByClassName("header")[0]
      .classList.add("disable-interactions");
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);

    document
      .getElementsByClassName("header")[0]
      .classList.remove("disable-interactions");
  }

  const check = () => {
    if (bar == false) {
      setBar(true);
      disableMainBody();
    } else {
      setBar(false);
      enableMainBody();
    }
  };
  const allCheck = () => {
    if (bar == true) {
      setBar(false);
      enableMainBody();
      return;
    } else {
      return;
    }
  };

  const cancelOrder = () => {
    setModal(true);
    setModalScreen("cancelOrder");
  };

  return (
    <>
      <div onClick={() => allCheck()} className={bar ? "blur" : null}>
        <Mainheader show={() => check()} mainText={allStrings.title} />

        <div>
          <div>
            <div className={"side"}>
              <SideBar
                color={primaryColor}
                show={() => check()}
                hide={bar}
                openModal={setModal}
              />
            </div>
          </div>
        </div>
      </div>
      {orderDetails.length !== 0
        ? orderDetails.map((order, index) =>
            order.items.length !== 0
              ? order.items.map((orderDetail) => (
                  <OrderDetailsContainer
                    itemName={orderDetail.itemName}
                    image={orderDetail.images[0]}
                    instructions={orderDetail.instructions}
                    quantity={orderDetail.quantity}
                    totalPrice={orderDetail.totalPrice}
                  />
                ))
              : null
          )
        : null}
      <div className="cancelBtn" onClick={cancelOrder}>
        {allStrings.cancelOrder}
      </div>

      {modal ? (
        <Modal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
        ></Modal>
      ) : null}
    </>
  );
}
