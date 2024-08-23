import { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { allStrings } from "../../commons";
import { images } from "../../commons/constants";
import { name } from "../../commons/routes/routesName";
import ApplicationContext from "../../utills/context-api/context";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { fetchVenueViaLatituteLongitude } from "../../utills/rest-apis/ApiHandeling";
import { Mainheader } from "../header";
import Modal from "../modal/Modal";
import "./style.scss";

const AutomaticVenue = () => {
  const { primaryColor, setPrimaryColor, setVenues } =
    useContext(ApplicationContext);
  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState(allStrings.modalScreens.login);

  setPrimaryColor(getData(keys.primaryColor));

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
    document.querySelector(".center").style.zIndex = -1;
    document.querySelector(".manual").style.zIndex = -1;
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);
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

  const automaticLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      let venues = fetchVenueViaLatituteLongitude(
        Math.floor(position.coords.latitude),
        Math.floor(position.coords.longitude)
      );
      venues.then(function (result) {
        setVenues(result.content);
        if (result.content.length > 1) {
          setModal(true);
          setModalScreen(allStrings.modalScreens.venues);
        } else if (result.content.length === 0) {
          window.location.href = name.manualVenue;
        } else {
          saveData(keys.urlParameters, `{"venueId":"${result.content[0].id}"}`);
          window.location.href = name.home;
        }
      });
    });
  };

  return (
    <>
      <Mainheader isVenueFinder={true} />
      <div>
        <div>
          <div className={"Imgstyle"}>
            <img src={images.nivyImage} alt={"Nivy"} className="MainImage" />
          </div>
        </div>
      </div>
      <div className="center" onClick={automaticLocation}>
        <div className="circle transitionCircle">
          <div className="innerDiv">
            {allStrings.location.automaticLocation}
          </div>
        </div>
      </div>
      <div className="or">or</div>
      <Link to={name.manualVenue} className={"linkstyle ma"}>
        <div className="manualVenue">
          {" "}
          {allStrings.location.manualLocation}{" "}
        </div>
      </Link>

      {modal ? (
        <Modal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
        ></Modal>
      ) : null}
    </>
  );
};

export default AutomaticVenue;
