import React, { useState, useContext, useCallback, useEffect } from "react";
import OrderContainer from "../../components/order-container/OrderContainer";
import { Mainheader, SideBar } from "../../components/index";
import { allStrings } from "../../commons/index";
import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage/index";

import Modal from "../../components/modal/Modal";
import { fetchOrderList } from "../../utills/rest-apis/ApiHandeling";

export function UserOrders() {
  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { primaryColor, setPrimaryColor, vendorOrderId } =
    useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));

  useEffect(() => {
    setLoading(true);
    fetchOrder();
    setLoading(false);
  }, []);

  const fetchOrder = async () => {
    let response = await fetchOrderList();
    if (response) {
      setOrderList(response.content);
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

      {orderList.length !== 0
        ? orderList
            .slice(0)
            .reverse()
            .map((order, index) => (
              <OrderContainer
                key={index}
                orderId={order.orderId}
                orderStatus={order.orderStatus}
                name={`${order.firstName} ${order.lastName}`}
                orderDateTime={order.orderDateTime}
                vendorOrderId={order.vendorOrderId}
                paymentSessionId={order.paymentSessionId}
              />
            ))
        : null}

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
