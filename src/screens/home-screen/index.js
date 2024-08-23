import React, { useEffect, useState, useContext, useCallback } from "react";
import { Mainheader, Catagory, SideBar } from "../../components/index";
import { allStrings, colors } from "../../commons/index";
import {
  fetchOrganization,
  isEventActive,
} from "../../utills/rest-apis/ApiHandeling";
import ApplicationContext from "../../utills/context-api/context";
import { saveData, getData } from "../../utills/local-storage/index";
import "./style.scss";
import { keys } from "../../utills/local-storage/keys";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import ReactLoading from "react-loading";
import Modal from "../../components/modal/Modal";
import CheckInButton from "../../components/checkin-button/CheckInButton";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";
import { JSONToObject } from "../../utills/helpers/AuthHelper";
import { name } from "../../commons/routes/routesName";

export function HomeScreen() {
  const [bar, setBar] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [responseFail, setResponseFail] = useState(false);
  const [socialUrl, setSocialUrl] = useState([]);
  const [buttonLocation, setButtonLocation] = useState("");
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [event, setEvent] = useState(false);

  const {
    setSections,
    setUserLocationFields,
    primaryColor,
    setPrimaryColor,
    setdeliveryCharges,
    isVisited,
  } = useContext(ApplicationContext);

  // veriable for local storage
  let location = useLocation();
  const values = queryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  useEffect(() => {
    if (Object.keys(values).length !== 0) {
      saveData(keys.urlParameters, JSON.stringify(values));
    } else {
      let dataParam = getData(keys.urlParameters)
        ? JSON.parse(getData(keys.urlParameters))
        : {};
      if (!isVisited && !JSONToObject(getData(keys.urlParameters))?.venueId)
        window.location.href = name.automaticVenue;

      var str = "      Some text ";
      console.log(str.replace(/\s+/g, ""));
    }

    setdeliveryCharges(0);
    let dataParam = getData(keys.urlParameters)
      ? JSON.parse(getData(keys.urlParameters))
      : {};
    if (dataParam != {}) {
      if (dataParam?.venueId != undefined) {
        saveData(keys.venueId, dataParam.venueId);
      } else {
        saveData(keys.venueId, "2");
      }
    } else {
      saveData(keys.venueId, "2");
    }
    fetchData();
    fetchEvent();
    saveData("OrderID", "");
  }, []);

  const fetchEvent = async () => {
    let apiResponse = await isEventActive(getData(keys.venueId));
    apiResponse.success && setEvent(apiResponse.content);
  };

  const fetchData = async () => {
    let key = getData(keys.venueId);
    let response = await fetchOrganization(key);
    console.log("Fetch Data Url :::: ", response);
    if (response.success) {
      console.log(response.content.socialMediaOptions);

      setButtonLocation(response.content.buttonLocation);
      setSocialUrl(response.content.socialMediaOptions);

      setData(response.content.homePageOptions);
      setSections(response.content.sections);
      setOrgName(response.content.welcomeText);
      setPrimaryColor(response.content.primaryColor ?? colors.red);
      setUserLocationFields(response.content.userLocationFields);
      let vendorSection = keys.vedorSection.slice(1);
      let dataParam = getData(keys.urlParameters)
        ? JSON.parse(getData(keys.urlParameters))
        : {};
      //[Section, Row, Seat] or  [Table,Chair]
      response.content.userLocationFields.includes(
        keys.vedorSection.charAt(0).toUpperCase() + vendorSection //"S" + "ection"
      )
        ? saveData(keys.vedorSection, dataParam["loc1"])
        : saveData(keys.vedorSection, null);

      // local Sotrage
      saveData(keys.home, JSON.stringify(response.content.homePageOptions));
      saveData(keys.userLocationFields, response.content.userLocationFields);
      saveData(keys.primaryColor, response.content.primaryColor);
      saveData(keys.secondaryColor, response.content.secondaryColor);
      setImgUrl(response.content.welcomeUrl);
      setLoading(false);
    } else {
      setResponseFail(true);
      window.location.href = name.automaticVenue;
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
      .getElementById("home-page-options")
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
      .getElementById("home-page-options")
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

  return (
    <>
      {responseFail == false ? (
        <div onClick={() => allCheck()} className={bar ? "blur" : null}>
          <Mainheader show={() => check()} mainText={allStrings.title} />
          {loading ? (
            <div className={"loader"}>
              <ReactLoading
                type={"spin"}
                color={"#d3d3d3"}
                height={"20%"}
                width={"20%"}
              />
            </div>
          ) : (
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

                <div className={"Imgstyle"}>
                  <img
                    src={imgUrl}
                    alt={loading ? null : "Enter query string "}
                    className="MainImage"
                  />
                </div>
              </div>
              <h4
                className={
                  buttonLocation == "Top"
                    ? "welCome_headingIcon"
                    : "welCome_heading"
                }
              >
                {orgName}
              </h4>
              {buttonLocation == "Top" || buttonLocation == "top" ? (
                <div className="iconsLinks">
                  {socialUrl.map((item, index) => (
                    <a
                      style={{ textDecoration: "none" }}
                      rel={"external"}
                      target="_blank"
                      href={`http://${item.url}`}
                    >
                      <img
                        src={item.image}
                        width={35}
                        className="iconPadding"
                      />
                    </a>
                  ))}
                </div>
              ) : null}
              <div id={"home-page-options"}>
                {data
                  ? data.map((item, key) => (
                      <Catagory
                        catagoryName={item.category}
                        color={primaryColor}
                        productName={item.name}
                        url={item.url}
                      />
                    ))
                  : null}
              </div>
            </div>
          )}
          {buttonLocation == "Bottom" || buttonLocation == "bottom" ? (
            <div className="iconsLinks">
              {socialUrl.map((item, index) => (
                <a
                  style={{ textDecoration: "none" }}
                  rel={"external"}
                  target="_blank"
                  href={`http://${item.url}`}
                >
                  {index == 0 && item.url && (
                    <IoLogoInstagram
                      style={{ backgroundColor: `#${primaryColor}` }}
                      id="instaIcon"
                    />
                  )}
                  {index == 1 && item.url && (
                    <FaFacebook
                      style={{ color: `#${primaryColor}` }}
                      id="fbIcon"
                    />
                  )}
                  {index == 2 && item.url && (
                    <AiFillTwitterCircle
                      style={{ color: `#${primaryColor}` }}
                      id="twitterIcon"
                    />
                  )}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {loading ? null : event && <CheckInButton showModal={setModal} />}

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
