import { useState, useContext, useCallback, useRef } from "react";
import { Mainheader, SideBar } from "../../components/index";
import { allStrings } from "../../commons/index";
import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage/index";
import "./style.scss";
import Tabs from "../../components/tabs/Tabs";
import {
  getUserDetails,
  isUserLoggedIn,
} from "../../utills/helpers/AuthHelper";
import Question from "../../components/question/question";
import PastQuestions from "../../components/past-questions/pastQuestions";
import UserRank from "../../components/user-rank/userRank";

import Modal from "../../components/modal/Modal";
export function ContestScreen() {
  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");

  const optionsList = useRef();
  const selectRef = useRef();

  const [value, setValue] = useState("Active Contest");
  const [toast, setToast] = useState(false);

  const showOptions = (ref) => {
    ref.current.style.visibility = "visible";
    ref.current.style.opacity = "1";
  };

  const hideOptions = (ref) => {
    ref.current.style.visibility = "hidden";
    ref.current.style.opacity = "0";
  };

  const handleClick = (e) => {
    if (e.target.children.length) {
      showOptions(optionsList);
    } else {
      setValue(e.target.textContent);
      hideOptions(optionsList);
    }
  };

  console.log(value);

  var scrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);
  setPrimaryColor(getData(keys.primaryColor));

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

      <Tabs
        leftString={allStrings.contests}
        rightString={allStrings.leaderboard}
      >
        <div className="left">
          <div className="input-container">
            <ul className="selectOptions contest-dropdown">
              <li onClick={handleClick} ref={selectRef}>
                {value}
                <svg
                  width="12"
                  height="5"
                  viewBox="0 0 12 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.99778 3.31167L11.1826 0.00580786L12 1.17217L5.99658 5L-5.09372e-08 1.16531L0.819087 -4.88733e-07L5.99778 3.31167Z"
                    fill="#AFAFAF"
                  />
                </svg>
                <ul className="selectOptions" ref={optionsList}>
                  <li>Active Contest</li>
                  <li>Past Contest</li>
                </ul>
              </li>
            </ul>
          </div>

          {value === "Active Contest" ? <Question /> : <PastQuestions />}
        </div>
        <div className="right">
          <UserRank
            name={"Michael Thomas"}
            rank={"first"}
            distinction={true}
            points={"1200"}
          />
          <UserRank
            name={"Sara Waters"}
            rank={"second"}
            points={"1200"}
            distinction={true}
          />
          <UserRank
            name={"Maria Taylor"}
            rank={"third"}
            points={"1200"}
            distinction={true}
          />
        </div>
      </Tabs>
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
