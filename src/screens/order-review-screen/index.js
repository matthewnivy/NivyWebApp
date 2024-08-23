import React, { useState, useContext, useCallback } from "react";
import {
  Mainheader,
  DeliveryBox,
  Payment,
  SideBar,
  DeptBpx,
} from "../../components/index";

import { AiFillCheckCircle, AiOutlineHome } from "react-icons/ai";
import "./style.scss";
import { Link } from "react-router-dom";
import { name } from "../../commons/routes/routesName";
import ApplicationContext from "../../utills/context-api/context";
import { useEffect } from "react";
import { fetchOrderDetails } from "../../utills/rest-apis/ApiHandeling";
import { saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { allStrings, colors } from "../../commons";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export const OrderReview = () => {
  const [bar, setBar] = useState(false);
  const { orderReviewId, setRout } = useContext(ApplicationContext);
  const [name, setName] = useState("");
  const [total, setTotal] = useState();
  const [itemList, setItemList] = useState([]);
  const [Row, setRow] = useState();
  const [Seat, setSeat] = useState();
  const [orderId, setOrderId] = useState();

  let location = useLocation();
  const values = queryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  useEffect(() => {
    setRout(false);
    fetchOrderReview(values.orderId);
  }, []);

  const fetchOrderReview = async (orderId) => {
    let response = await fetchOrderDetails(orderId);
    if (response) {
      setRow(response?.content?.rowNo);
      setSeat(response?.content?.seatNo);
      setTotal(response?.content?.grandTotal);
      setName(response?.content?.firstName);
      setItemList(response?.content?.vendorsItems);
      setOrderId(response?.content?.orderId);
      saveData(keys.orderList, "");
      saveData(keys.subtotal, "");
      saveData(keys.grandTax, "");
      saveData(keys.TotalAmount, "");
      saveData(keys.cartCount, "");
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
    // Will add when I find the order review screen
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);
    // Will add when I find the order review screen
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
    <div
      onClick={() => allCheck()}
      className={bar ? "mainBody blur" : "mainBody"}
    >
      <div>
        <Mainheader show={() => check()} mainText={"WebApp"} />
      </div>
      <div className={"side"}>
        <SideBar show={() => check()} hide={bar} />
      </div>
      <div className={"complet"}>
        <AiFillCheckCircle color={"#00b52a"} size={18} />
        <p>{allStrings.COMPLETED}</p>
      </div>
      <div className={"downContainer"}>
        <div className={"info"}>
          <DeliveryBox
            name={name}
            seatNo={Seat}
            rowNo={Row}
            orderId={orderId}
          />
        </div>
        <div className={"paymentsContainer"}>
          <Payment textOne={allStrings.paymentDetails} textTwo={allStrings.stripe} />
        </div>
        <div className={"paymentsContainer"}>
          <Payment textOne={allStrings.totalPrice} textTwo={total ? "$" + total?.toFixed(2) : null} />
        </div>

        <div className={"orderContainer"}>
          <p className={"itemList"}>Items</p>
          <div className={"orderList"}>
            {itemList?.map((item) => (
              <div className={"innerOrders"}>
                <DeptBpx vendorName={item.vendorName} Itemarray={item.items} />
              </div>
            ))}
          </div>
          <div className={"bottomButtonLast"}>
            <Link className={"bottomLink"} to={"/"}>
              <button className={"btn"}>
                <AiOutlineHome
                  className={"HomeIcon"}
                  size={16}
                  color={colors.white}
                />
                {allStrings.Home}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
