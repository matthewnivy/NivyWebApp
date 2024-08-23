import React, { useContext, useState, useEffect } from "react";
import ApplicationContext from "../../utills/context-api/context";
import "./style.scss";
import {
  AiOutlineHome,
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineLogout,
} from "react-icons/ai";

import { Link } from "react-router-dom";
import { SubOptions } from "./sub-navigation-options/index";
import { name } from "../../commons/routes/routesName/index";
import { getData, saveData } from "../../utills/local-storage";
import { isUserLoggedIn, JSONToObject } from "../../utills/helpers/AuthHelper";
import { keys } from "../../utills/local-storage/keys";
import { allStrings } from "../../commons/constants";
import Modal from "../modal/Modal";
import { parse } from "query-string";

export function SideBar({ show, hide, openModal, alignment }) {
  const { primaryColor, user, setUser } = useContext(ApplicationContext);

  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [sideBarOptions, setSideBarOptions] = useState([]);
  const [userDetails, setUserDetails] = useState(
    getData(keys?.userDetails) || ""
  );

  useEffect(() => {
    setSideBarOptions(JSON.parse(getData(keys.home)));
  }, []);

  useEffect(() => {
    setUserDetails(getData(keys?.userDetails) || "");
  }, [getData(keys.userDetails)]);

  const handleClick = () => {
    setModal(true);
    setModalScreen(allStrings.modalScreens.feedbackForm);
  };

  return (
    <div
      style={{
        backgroundColor: `#${primaryColor}`,
        marginTop: `${alignment}px`,
      }}
      className={hide ? "nav_menu active" : "nav_menu"}
      id="side-bar"
    >
      <div style={{ backgroundColor: `#${primaryColor}` }} className={"top"}>
        <AiOutlineClose
          onClick={() => show()}
          className={"bars"}
          size={25}
          color={"#FFF"}
        />
      </div>

      <nav className={"navbar"}>
        <li>
          {!isUserLoggedIn() ? (
            <>
              <span>
                <AiOutlineLogin className={"iconStyle"} />
              </span>
              <p
                onClick={() => {
                  openModal(true);
                }}
                className={"linkstyle"}
              >
                {allStrings.signIn}
              </p>
            </>
          ) : (
            <div className={"user-container"}>
              <AiOutlineLogout className={"logoutIconStyle"} />
              <span
                onClick={() => {
                  setUser(false);
                  saveData(keys.accessToken, "");
                  saveData(keys.userDetails, "");
                  window.location.href = "/";
                }}
                className="logoutButton"
              >
                {allStrings.Logout}
              </span>
              <p>
                Welcome,{" "}
                {JSONToObject(getData(keys.userDetails))?.FirstName || ""}
              </p>

              <Link to={name.account} className={"linkstyle"}>
                <div className="account-badge">View Account</div>
              </Link>
            </div>
          )}
        </li>

        <li className="homeStyle">
          <span>
            <AiOutlineHome className={"iconStyle"} />
          </span>
          <Link className={"linkstyle"} to={name.home}>
            {allStrings.homeText}
          </Link>
        </li>
        {sideBarOptions
          ? sideBarOptions.map((item) => (
              <SubOptions
                productName={item.name}
                catagoryName={item.category}
                urls={item.url}
              />
            ))
          : null}

        <li>
          <span>
            <AiOutlineShoppingCart className={"iconStyle"} />
          </span>
          <Link className={"linkstyle"} to={name.cart}>
            {allStrings.cartText}
          </Link>
        </li>

        <div className="feedback" onClick={handleClick}>
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.58945 16.5645C8.42279 15.9458 9.2353 15.386 9.99423 14.7644C10.5032 14.349 11.024 14.1781 11.6847 14.2017C12.9615 14.2488 14.2413 14.1928 15.5181 14.2223C16.4139 14.2429 17.0925 13.5918 17.0836 12.6668C17.0627 10.575 17.0776 8.48032 17.0776 6.38857C17.0776 5.99084 17.2413 5.76988 17.5419 5.76694C17.8484 5.76104 18.027 5.99084 18.027 6.39446C18.027 8.51272 18.03 10.6339 18.027 12.7522C18.024 13.9748 17.2145 14.9235 15.9972 15.1268C15.8365 15.1533 15.6699 15.1533 15.5062 15.1533C14.0895 15.1562 12.6728 15.1533 11.2591 15.1592C11.152 15.1592 11.024 15.2004 10.9377 15.2623C9.79185 16.1049 8.64898 16.9563 7.50612 17.8018C7.41683 17.8667 7.31862 17.9344 7.21445 17.958C6.9079 18.0287 6.65195 17.8048 6.64897 17.4719C6.646 16.7795 6.64897 16.0901 6.646 15.3978C6.646 15.3271 6.646 15.2564 6.646 15.1533C6.55671 15.1533 6.4823 15.1533 6.40492 15.1533C5.04777 15.1533 3.69062 15.1621 2.33644 15.1474C1.25608 15.1385 0.345361 14.4138 0.0804782 13.3768C0.0328589 13.1882 0.0120254 12.9908 0.00904922 12.7964C0.000120591 9.99167 -0.00285562 7.18108 0.0030968 4.37048C0.00607301 3.04767 1.0537 2.01358 2.38704 2.01063C5.19361 2.00769 7.99719 2.00769 10.8038 2.01063C11.2204 2.01063 11.4645 2.28462 11.3544 2.62048C11.2919 2.81198 11.155 2.92393 10.9526 2.94455C10.8752 2.95339 10.7948 2.95045 10.7145 2.95045C7.95553 2.95045 5.19658 2.95045 2.43764 2.95045C1.69656 2.95045 1.1281 3.39236 0.98227 4.08176C0.955484 4.20255 0.955484 4.32628 0.955484 4.45002C0.955484 7.20759 0.952507 9.96516 0.955484 12.7227C0.955484 13.6272 1.54477 14.2135 2.46442 14.2135C3.96741 14.2164 5.46742 14.2135 6.9704 14.2135C7.43172 14.2135 7.59541 14.3785 7.59541 14.838C7.59541 15.333 7.59541 15.8279 7.59541 16.3258C7.58945 16.3936 7.58945 16.4555 7.58945 16.5645Z"
              fill="white"
            />
            <path
              d="M10.4345 7.16643C10.4345 6.89833 10.4434 6.63024 10.4315 6.36508C10.4196 6.13823 10.503 5.9703 10.6637 5.81121C11.9196 4.57384 13.1697 3.33353 14.4226 2.09321C15.009 1.51282 15.5953 0.932436 16.1816 0.35205C16.4762 0.0603843 16.7173 0.0603843 17.0119 0.35205C17.5953 0.926544 18.1756 1.50398 18.759 2.08142C19.0417 2.36131 19.0417 2.60583 18.756 2.88866C16.9048 4.7182 15.0566 6.54774 13.2113 8.38023C13.0714 8.5187 12.9226 8.58941 12.7232 8.58646C12.1429 8.58057 11.5655 8.58646 10.9851 8.58351C10.6042 8.58057 10.4375 8.40969 10.4375 8.02964C10.4315 7.74092 10.4345 7.45515 10.4345 7.16643ZM11.3839 7.6437C11.744 7.6437 12.0804 7.63486 12.4137 7.64665C12.5595 7.65254 12.6577 7.59951 12.756 7.50229C14.3869 5.88192 16.0209 4.2645 17.6548 2.65003C17.7054 2.59994 17.7709 2.56459 17.8125 2.53513C17.381 2.10794 16.9792 1.70727 16.5715 1.30365C16.5744 1.30365 16.5566 1.30954 16.5417 1.32427C14.8482 3.00061 13.1518 4.67696 11.4613 6.35625C11.4226 6.39455 11.3869 6.45347 11.3869 6.50355C11.381 6.87476 11.3839 7.24597 11.3839 7.6437Z"
              fill="white"
            />
            <path
              d="M8.99414 11.3999C7.13103 11.3999 5.26792 11.3999 3.40481 11.3999C3.07743 11.3999 2.87803 11.2496 2.84826 10.9933C2.82148 10.7429 2.97326 10.5278 3.22327 10.4777C3.29469 10.463 3.36612 10.463 3.44053 10.463C7.15186 10.463 10.8662 10.463 14.5775 10.463C14.896 10.463 15.0686 10.5632 15.143 10.79C15.2352 11.0699 15.0537 11.3616 14.7591 11.3969C14.6757 11.4058 14.5894 11.4028 14.5031 11.4028C12.6668 11.3999 10.8305 11.3999 8.99414 11.3999Z"
              fill="white"
            />
            <path
              d="M5.68131 5.76705C4.90452 5.76705 4.12773 5.77 3.35392 5.7641C3.02058 5.76116 2.81225 5.53136 2.85392 5.22791C2.88665 4.98633 3.08904 4.83018 3.3807 4.82724C3.97297 4.82429 4.56524 4.82724 5.1575 4.82724C6.10394 4.82724 7.05037 4.82429 7.99978 4.82724C8.38966 4.82724 8.62479 5.1248 8.50871 5.45181C8.43728 5.65215 8.27062 5.76116 8.01466 5.7641C7.2349 5.76705 6.45811 5.76705 5.68131 5.76705Z"
              fill="white"
            />
            <path
              d="M5.68423 8.58346C4.90744 8.58346 4.13065 8.5864 3.35683 8.58346C3.0354 8.58051 2.836 8.38017 2.85088 8.08851C2.86278 7.8322 3.06516 7.64954 3.35683 7.64659C3.83005 7.6407 4.30327 7.64364 4.77648 7.64364C5.84792 7.64364 6.91935 7.6407 7.99377 7.64364C8.39258 7.64364 8.63068 7.95299 8.49972 8.2859C8.42234 8.48034 8.25865 8.58051 7.99377 8.58346C7.22293 8.5864 6.45507 8.58346 5.68423 8.58346Z"
              fill="white"
            />
          </svg>
          <span>Feedback</span>
        </div>
      </nav>

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
