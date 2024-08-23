import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Mainheader,
  InputField,
  SideBar,
  PayPaylButton,
} from "../../components/index";
import "./style.scss";
import ApplicationContext from "../../utills/context-api/context";
import { allStrings } from "../../commons";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage";
import Loader from "react-loader-spinner";
import ReactLoading from "react-loading";
import StripeButton from "../../components/stripe-button/StripeButton";
import { makeStyles } from "@material-ui/core";
import CustomAlert from "../../components/alert/customAlert";
import { isUserLoggedIn, JSONToObject } from "../../utills/helpers/AuthHelper";

export const CheckOutScreen = () => {
  const [bar, setBar] = useState(false);
  const [ok, setOk] = useState(false);
  const [isSeatAndRowDisable, setisSeatAndRowDisable] = useState(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [loader, setLoader] = useState(false);

  const [dialogMessage, setDialogMessage] = useState(
    "Please fill all fields to proceed."
  );

  const {
    userName,
    userContact,
    userEmail,
    options,
    setUserName,
    setUserContact,
    setUserEmail,
    OrderList,
    setRowNumber,
    setSeatNumber,
    setOrderList,
    rowNumber,
    seatNumber,
    setdeliveryCharges,
    setTotal,
    setgrandTaxTotal,
    setgrandSubTotal,
    settotalDeliveryCharges,
    userLastName,
    setUserLastName,
    rout,
  } = useContext(ApplicationContext);

  useEffect(() => {
    setdeliveryCharges(0);
    let List = JSON.parse(getData(keys.orderList));
    let total = getData(keys.TotalAmount);
    console.log("Total Amount checkout screen : ", total);
    setOrderList(List);
    setTotal(parseFloat(total));
    setgrandTaxTotal(parseFloat(getData(keys.grandTax)));
    setgrandSubTotal(parseFloat(getData(keys.subtotal)));
    settotalDeliveryCharges(parseFloat(getData(keys.delivery)));
  }, []);

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
    document
      .getElementsByClassName("inputContainer")[0]
      .classList.add("disable-interactions");
    document
      .getElementsByClassName("buttonContainer")[0]
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
    document
      .getElementsByClassName("inputContainer")[0]
      .classList.remove("disable-interactions");
    document
      .getElementsByClassName("buttonContainer")[0]
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
  //for validating Email
  function validateEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  const Validate = () => {
    if (
      userName == "" ||
      userLastName == "" ||
      userContact == "" ||
      userEmail == "" ||
      (isSeatAndRowDisable == false && (rowNumber == "", seatNumber == ""))
    ) {
      setOk(false);
      handleClose();
    } else {
      if (!validateEmail(userEmail)) {
        Animate();
        setDialogMessage("Invalid Email Address!");
        userContact.length < 10 &&
          setDialogMessage(allStrings.phoneLengthVerificationMessage);
        setOk(false);
        handleClose();
      } else {
        setOk(true);
      }
    }
  };

  const handleClose = () => {
    setOpenPopUp(true);
  };

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
    },
  }));
  const classes = useStyles();

  const Animate = () => {
    setOpenPopUp((prev) => !prev);
    setTimeout(() => {
      setOpenPopUp(false);
    }, 3000);
  };

  const handleCloseToast = () => {
    setOpenPopUp(false);
  };

  const handleSameInfo = () => {
    setUserName(JSONToObject(getData(keys.userDetails)).FirstName);
    setUserLastName(JSONToObject(getData(keys.userDetails)).LastName);
    setUserContact(JSONToObject(getData(keys.userDetails)).Phone);
    setUserEmail(JSONToObject(getData(keys.userDetails)).Email);
  };

  return (
    <div
      className={bar ? "checkout-info blur" : "checkout-info"}
      onClick={() => allCheck()}
    >
      <div>
        <Mainheader show={() => check()} mainText={"WebApp"} />
      </div>
      <div className={"side"}>
        <SideBar show={() => check()} hide={bar} />
      </div>
      <div>
        <p className={"checkout"}>Checkout</p>
      </div>
      {
        isUserLoggedIn() ?
        <div className="inputContainer">
          <button className={"btn1"} onClick={handleSameInfo}>
            {allStrings.sameInfo}
          </button>
        </div> : null
      }
      <div className={"inputContainer"}>
        <InputField
          getValue={(val) => setUserName(val)}
          val={userName}
          count={1}
          placeHolder={"First name"}
          textType={"text"}
        />
        <InputField
          getValue={(val) => setUserLastName(val)}
          count={1}
          val={userLastName}
          placeHolder={"Last name"}
          textType={"text"}
        />
        <InputField
          getValue={(val) => setUserContact(val)}
          count={2}
          val={userContact}
          placeHolder={"xxx-xxx-xxxx"}
          textType={"number"}
        />
        <InputField
          getValue={(val) => setUserEmail(val)}
          count={3}
          val={userEmail}
          placeHolder={"exapmle@gmail.com"}
          textType={"email"}
        />
      </div>
      {ok ? (
        <div className="buttonContainer">
          <StripeButton loader={(val) => setLoader(val)}></StripeButton>
        </div>
      ) : (
        <div className="buttonContainer">
          <button className={"btn"} onClick={() => Validate()}>
            {allStrings.ContinuetoPayment}
          </button>
        </div>
      )}
      <div className={classes.wrapper}>
        <CustomAlert
          message={dialogMessage}
          onClose={handleCloseToast}
          type={"error"}
          checked={openPopUp}
        />
      </div>
      {loader ? (
        <div className={"want_end"}>
          <ReactLoading
            type={"spin"}
            color={"#d3d3d3"}
            height={"20%"}
            width={"20%"}
          />

          {/* <Loader type="Puff" color="#d3d3d3" height={100} width={100} /> */}
        </div>
      ) : null}
    </div>
  );
};
