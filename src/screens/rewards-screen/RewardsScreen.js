import { useCallback, useEffect } from "react";
import getSVG from "../../commons/svgs";
import ItemContainer from "../../components/item-container/ItemContainer";
import "./style.scss";
import { allStrings } from "../../commons/index";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import Tabs from "../../components/tabs/Tabs";
import { useContext, useState } from "react";
import Modal from "../../components/modal/Modal";
import {
  getCustomerRewardList,
  getCustomerRewardHistoryList,
  getCustomerScorePoints,
} from "../../utills/rest-apis/ApiHandeling";
import { Mainheader, SideBar } from "../../components";

export function RewardsScreen() {
  const {
    primaryColor,
    setPrimaryColor,
    rewardsData,
    setRewardsData,
    historyRewardsData,
    setHistoryRewardsData,
    profileCoin,
    setProfileCoin,
  } = useContext(ApplicationContext);
  const [modalScreen, setModalScreen] = useState("login");

  const [modal, setModal] = useState(false);

  const [bar, setBar] = useState(false);

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

  setPrimaryColor(getData(keys.primaryColor));

  useEffect(() => {
    getCustomerRewardListApiHandler();
    getCustomerRewardHistoryListApiHandler();
    getCustomerScorePointsHandler();
  }, []);

  const getCustomerScorePointsHandler = async () => {
    let venueId = getData(keys.venueId);
    let response = await getCustomerScorePoints(venueId);
    if (response.success) {
      setProfileCoin(response?.content);
    }
  };

  const getCustomerRewardListApiHandler = async () => {
    let venueId = getData(keys.venueId);
    let response = await getCustomerRewardList(venueId);
    if (response.success) {
      setRewardsData(response.content);
    }
  };

  const getCustomerRewardHistoryListApiHandler = async () => {
    //reward history api
    let venueId = getData(keys.venueId);
    let response = await getCustomerRewardHistoryList(venueId);
    if (response.success) {
      setHistoryRewardsData(response.content);
    }
  };

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
    document.querySelector(".points").style.zIndex = -1;
    document
      .getElementsByClassName("header")[0]
      .classList.add("disable-interactions");
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);
    document.querySelector(".points").style.zIndex = 0;
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
    <div className="rewardsContainer">
      <div onClick={() => allCheck()} className={bar ? "blur" : null}>
        <Mainheader show={() => check()} mainText={allStrings.title} />
        <div className={"side"}>
          <SideBar
            color={primaryColor}
            show={() => check()}
            hide={bar}
            openModal={setModal}
            alignment={0}
          />
        </div>
      </div>
      <svg
        viewBox="0 0 376 154"
        className="headerSVG sub-header"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 0H375.5L339.985 106.201C330.437 134.751 303.704 154 273.599 154H0.5V0Z"
          fill={`#${primaryColor}`}
        />
      </svg>
      <svg
        className="below headerSVG sub-header"
        viewBox="0 0 376 164"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 0L375.5 0L348.153 110.055C340.19 142.1 310.917 164.223 277.915 163.136L0.5 154V0Z"
          fill="#DBDADC"
          fill-opacity="0.6"
        />
      </svg>

      <div className="points alignment">
        <span className="title">{allStrings.myPoints}</span>
        <div>
          <img className="coin" src={getSVG.coin}></img>
          <span className="totalPoints">{profileCoin}</span>
        </div>
      </div>

      <Tabs leftString={allStrings.rewards} rightString={allStrings.history}>
        <div className="left">
          <ItemContainer
            openModal={setModal}
            changeModalScreen={setModalScreen}
            modalScreen={modalScreen}
            data={rewardsData}
          ></ItemContainer>
        </div>
        <div className="right">
          <ItemContainer
            openModal={setModal}
            changeModalScreen={setModalScreen}
            modalScreen={modalScreen}
            data={historyRewardsData}
          ></ItemContainer>
        </div>
      </Tabs>

      {modal ? (
        <Modal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
        ></Modal>
      ) : null}
    </div>
  );
}
