import React, { useState, useContext, useEffect, useCallback } from "react";
import "./style.scss";
import { Mainheader, DetailBox, SideBar } from "../../components/index";
import ApplicationContext from "../../utills/context-api/context";
import {
  fetchVendorsLocation,
  fetchOrganization,
} from "../../utills/rest-apis/ApiHandeling";
import { Link, useLocation } from "react-router-dom";
import { allStrings, organization } from "../../commons/index";
import Loader from "react-loader-spinner";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { RiEditBoxFill } from "react-icons/ri";
import Dialog from "@material-ui/core/Dialog";
import ReactLoading from "react-loading";
import { name } from "../../commons/routes/routesName";
import { JSONToObject } from "../../utills/helpers/AuthHelper";
import UserLocation from "../../components/user-location";
import Modal from "../../components/modal/Modal";

export function VendorDetails() {
  const [vendors, setVendors] = useState([]);
  const [selectVal, setSelectVal] = useState(
    getData(keys.vedorSection) ?? JSON.parse(getData(keys.vedorSection))
  );
  const [loading, setLoading] = useState(true);
  const [section, setSections] = useState([]);
  const [sectionValue, setSectionValue] = useState(getData(keys.vedorSection));
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");

  const param = useLocation();

  // side navigation bar
  const [bar, setBar] = useState(false);
  // contaxt API collections
  const {
    sections,
    catId,
    bSortVendors,
    setVendor,
    vendor,
    primaryColor,
    setdeliveryCharges,
    setIsVisited,
  } = useContext(ApplicationContext);

  useEffect(() => {
    // ...we have to set this  0 on all screen Coz of its globalization , Delivery charges gets added in subtotals again .
    setdeliveryCharges(0);
    fetchSections();
    console.log("Catogyr id ", catId, param.state.catagoryId);
    console.log("selectVal  ::", selectVal);
    console.log("get data ::: ", getData(keys.vedorSection));
    fetchData(getData(keys.itemCat) ?? param.state.catagoryId, selectVal);
    if (!JSONToObject(getData(keys.urlParameters))?.venueId) {
      window.location.href = name.automaticVenue;
    }
    setIsVisited(true);
  }, [param.state.catagoryId, getData(keys.itemCat)]);

  var scrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  let urlParam = getData(keys.urlParameters)
    ? JSON.parse(getData(keys.urlParameters))
    : null;
  console.log("URL params main ::::: ", urlParam);
  const [seatInputOpen, setSeatInputOpen] = React.useState(false);

  const handleSeatInputOpen = () => {
    setSeatInputOpen(true);
  };

  const handleSeatInputClose = () => {
    setSeatInputOpen(false);
  };

  const updateSeatInfo = () => {
    var section = document.getElementById("section-input").value;
    var row = document.getElementById("row-input").value;
    var seat = document.getElementById("seat-input").value;
    if (
      !Number.isInteger(parseInt(row)) ||
      !Number.isInteger(parseInt(seat)) ||
      !Number.isInteger(parseInt(section))
    ) {
      document.getElementById("seat-input-alert").innerHTML =
        "Please enter all fields";
      return;
    }
    saveData(
      keys.urlParameters,
      `{"venueId":"${urlParam["venueId"]}","row":"${row}","seat":"${seat}","section":"${section}"}`
    );
    saveData(keys.userSection, `${section}`);
    saveData(keys.vedorSection, `${section}`);
    updateText(section, row, seat);
    handleSeatInputClose();
  };

  const updateText = (section, row, seat) => {
    document.getElementById("section-text").innerHTML = `Section: ${section}`;
    document.getElementById("row-text").innerHTML = `Row: ${row}`;
    document.getElementById("seat-text").innerHTML = `Seat: ${seat}`;
  };

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
      .getElementsByClassName("items")[0]
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
      .getElementsByClassName("items")[0]
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

  const fetchData = async (catId, selectVal) => {
    console.log("Catagory Id ", catId, { selectVal });
    if (selectVal != "") {
      setLoading(true);
      let response = await fetchVendorsLocation(
        getData(keys.venueId),
        selectVal,
        catId,
        bSortVendors
      );
      console.log("Respone of Fetch Data ;;;; ", response);
      if (response.success) {
        if (response.content != null) {
          setVendors(response.content);
          console.log("VEN", vendors);
          //saving data into context for making it global.
          setVendor(response.content);
        } else {
          setVendors([]);
          setVendor([]);
        }
        setLoading(false);
      } else {
      }
    } else {
      //   let response = await fetchVendorsLocation(
      //     catId,
      //     getData(keys.userSection),
      //     getData(keys.venueId)
      //   );
      let response = await fetchVendorsLocation("1", "1", catId, false);
      console.log("2Respone of Fetch Data ;;;; ", response);
      if (response.success) {
        if (response.content != null) {
          setVendors(response.content);
          //saving data into context for making it global.
          setVendor(response?.content);
        }
        setLoading(false);
      } else {
      }
    }
  };

  const fetchSections = async () => {
    // let response = await fetchOrganization("9875");
    let response = await fetchOrganization("2");
    console.log("Fetch Sections ::: ", response);
    if (response.success) {
      setSections(response?.content?.sections);
    }
  };

  const recall = async (e) => {
    setSelectVal(e.target.value.slice(-1));
    saveData(keys.userSection, e.target.value.slice(-1));
  };

  return (
    <>
      {loading ? (
        <div className={"loader"}>
          <ReactLoading
            type={"spin"}
            color={"#d3d3d3"}
            height={"20%"}
            width={"20%"}
          />
          {/* <Loader type="Puff" color="#d3d3d3" height={100} width={100} /> */}
          {/* <RectSpinner.Spinner animation="border" size={40} /> */}
        </div>
      ) : (
        <div onClick={() => allCheck()} className={bar ? "blur" : null}>
          <div>
            <Mainheader show={() => check()} mainText={"WebApp"} />
          </div>
          <div className={"side"}>
            <SideBar show={() => check()} hide={bar} openModal={setModal} />
          </div>
          <div className="seat-info-holder">
            <ul className={"list"}>
              <Link to={"/"}>
                <li>{allStrings.Home}/</li>
              </Link>
              <li>{param?.state?.catagoryId}</li>
            </ul>
            <div className="seat-info-div" align="right">
              <UserLocation />
            </div>
          </div>
          <div className={"items"}>
            {loading ? null : (
              <div>
                {console.log("vendors", vendors)}
                {vendors.length != 0
                  ? vendors.map((item) => (
                      <div className={"box"}>
                        <DetailBox
                          number={1}
                          offerDelivery={item.offerDelivery}
                          vendorTaxRate={item.vendorTaxRate}
                          deliveryFee={item.deliveryFee}
                          vendorName={item.vendorName}
                          vendorLocation={item.location}
                          distance={item.distance}
                          id={item.vendorId}
                          vendorUrl={item.vendorImageURL}
                          backListName={param?.state?.name}
                        />
                      </div>
                    ))
                  : null}
              </div>
            )}
            {loading == false && selectVal && vendors.length == 0 ? (
              <p className={"noVendor"}>{allStrings.notAvaialble}</p>
            ) : null}
          </div>
        </div>
      )}
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
