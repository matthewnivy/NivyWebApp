import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Mainheader, SideBar, Department } from "../../components/index";
import Modal from "react-modal";
import { ModeScreen } from "../index";
import ApplicationContext from "../../utills/context-api/context";
import "./style.scss";
import { Link, useLocation } from "react-router-dom";
import { fetchVendorsMenu } from "../../utills/rest-apis/ApiHandeling";
import { getData, saveData } from "../../utills/local-storage/index";
import { keys } from "../../utills/local-storage/keys";
import { makeStyles } from "@material-ui/core";
import { allStrings, customStyle } from "../../commons";
import ReactLoading from "react-loading";
import CustomAlert from "../../components/alert/customAlert";
import CustomModal from "../../components/modal/Modal";

export function ProductCatagory() {
  const [bar, setBar] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [append, setAppend] = useState([]);
  const [itemPrice, setItemPrice] = useState();
  const param = useLocation();
  const [quantityItem, setQuantityItem] = useState(1);
  const [vendorUrl, setVendorUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [checked, setChecked] = useState(false);
  const [currentVendor, setCurrentVendor] = useState();
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");

  const {
    setItemOptions,
    object,
    itemName,
    options,
    setEdit,
    catName,
    addNewOrder,
    signleOption,
    carCount,
    setcartCount,
    cartImgUrl,
    setcartImgUrl,
    instruction,
    setdeliveryCharges,
    seInstructions,
    itemTaxRate,
  } = useContext(ApplicationContext);

  useEffect(() => {
    // fetching data from local storage
    // ...we have to set this  0 on all screen Coz of its globalization , Delivery charges gets added in subtotals again .
    setdeliveryCharges(0);
    setItemOptions("");
    setVendorUrl(getData(keys.vendorImgUrl));
    setEdit(false);
    fetchData();
    seInstructions("");
  }, []);

  const toggleModel = () => {
    setOpen(!open);
    if (open) {
      document.body.style.margin = "";
      document.body.style.overflow = "";
      document.body.style.overflow = "auto";
    } else {
      var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.style.overflow = "hidden";
      document.body.style.margin = "0px " + scrollBarWidth + "px 0px 0px";
    }
    Animate();
    // adding values into JSON object for cart screen
    let data = param.state.vendorId;
    let checkItem = true;
    let prductId = data + Math.floor(Math.random() * 100) + 1;
    // if tiems matched with in list
    for (let i = 0; i < object.length; i++) {
      const element = object[i];
      if (prductId == element.prductId) {
        checkItem = false;
      }
    }
    if (checkItem)
      addNewOrder(
        param.state.vendorId,
        itemName,
        signleOption,
        itemPrice,
        itemTaxRate,
        quantityItem,
        param.state.name,
        param.state.isDelivery,
        param.state.deliveryFee,
        param.state.vendorTaxRate,
        cartImgUrl,
        prductId,
        instruction
      );
    seInstructions("");
    setcartCount(parseInt(carCount + parseInt(quantityItem)));
    saveData(keys.cartCount, parseInt(carCount + parseInt(quantityItem)));
    setQuantityItem(1);
    setItemOptions("");
    setcartImgUrl("");
  };

  const toggleModeOpen = () => {
    setOpen(!open);
    if (open) {
      document.body.style.margin = "";
      document.body.style.overflow = "";
      document.body.style.overflow = "auto";
    } else {
      var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.style.overflow = "hidden";
      document.body.style.margin = "0px " + scrollBarWidth + "px 0px 0px";
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
      .getElementsByClassName("sections")[0]
      .classList.add("disable-interactions");
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
      .getElementsByClassName("sections")[0]
      .classList.remove("disable-interactions");
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
  // fething API function
  const fetchData = async () => {
    console.log("fetch vendor menu");
    let response = await fetchVendorsMenu(
      getData(keys.venueId),
      param.state.vendorId
    );
    if (response.success) {
      if (response.content.length != 0)
        setAppend([...append, ...response.content[0].menuItems]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const listInnerRef = useRef();

  const Animate = () => {
    setChecked((prev) => !prev);
    setTimeout(() => {
      setChecked(false);
    }, 10000);
  };

  const handleClose = () => {
    setChecked((prev) => !prev);
  };

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }));
  const classes = useStyles();

  return loading ? (
    <div className={"loaderOne"}>
      <ReactLoading
        type={"spin"}
        color={"#d3d3d3"}
        height={"20%"}
        width={"20%"}
      />
    </div>
  ) : (
    <>
      <div className={classes.wrapper}>
        <CustomAlert
          message={allStrings.success}
          onClose={handleClose}
          type={allStrings.apiResponseType.success}
          checked={checked}
          bottomStyle={customStyle.content.bottom}
          position={customStyle.position.fixed}
        />
      </div>
      <div
        ref={listInnerRef}
        onClick={() => allCheck()}
        className={bar ? "blur" : null}
      >
        <div>
          <Mainheader show={() => check()} mainText={"WebApp"} />
        </div>
        <div className={"side"}>
          <SideBar show={() => check()} hide={bar} openModal={setModal} />
        </div>
        <div className={"names"}>
          <img className={"logo"} src={vendorUrl} width={25} height={25} />
          <ul className={"listOne"}>
            <Link to="/">
              <b>
                <li className={"homeText"}>{allStrings.Home}</li>
              </b>
            </Link>
            <li>/</li>
            <Link
              to={{
                pathname: "/vendor",
                state: {
                  name: param.state.backListName,
                },
              }}
            >
              <b>
                <li> {param.state.backListName}</li>
              </b>
            </Link>
            <li>/</li>
            <li style={{ color: "#aeaeae" }}>{param.state.name}</li>
          </ul>
        </div>
        <div className={"sections"}>
          <>
            {loading
              ? null
              : append.map((item) => {
                  return (
                    <Department
                      arrays={item.items}
                      catName={item.category}
                      toggle={() => toggleModeOpen()}
                      setImageUrl={setImageUrl}
                    />
                  );
                })}
          </>
        </div>
        <Modal
          style={customStyle}
          overlayClassName="overlayStyles"
          isOpen={open}
          onRequestClose={() => toggleModeOpen()}
        >
          <ModeScreen
            cross={() => toggleModeOpen()}
            itemPrice={setItemPrice}
            close={() => toggleModel()}
            selectQuantity={(val) => setQuantityItem(val)}
            imageUrl={imageUrl}
            currentVendor={param.state.vendorId}
          />
        </Modal>

        {modal ? (
          <CustomModal
            openModal={setModal}
            changeModalScreen={setModalScreen}
            modalScreen={modalScreen}
          ></CustomModal>
        ) : null}
      </div>
    </>
  );
}
