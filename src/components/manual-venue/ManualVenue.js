import { useCallback, useContext, useEffect, useState } from "react";
import { allStrings } from "../../commons";
import ApplicationContext from "../../utills/context-api/context";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { Mainheader } from "../header";
import { SideBar } from "../side-navigation";
import Modal from "../modal/Modal";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fetchVenueByName } from "../../utills/rest-apis/ApiHandeling";
import "./style.scss";
import { name } from "../../commons/routes/routesName";

const ManualVenue = () => {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);
  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState(allStrings.modalScreens.login);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState();

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

  const getVenueHandler = async (name) => {
    let response = await fetchVenueByName(name);
    try {
      if (response.success === true) {
        setSuggestions(response.content);
      }
    } catch (error) {}
  };

  const SelectVenueHandler = (event, value) => {
    getVenueHandler(event.target.value);
    setSelectedVenue(value);
  };

  const handleSubmit = (e) => {
    saveData(keys.urlParameters, `{"venueId":"${selectedVenue?.id}"}`);
    window.location.href = name.home;
  };

  return (
    <>
      <Mainheader isVenueFinder={true}/>
      <div className="heading">{allStrings.location.manualLocation}</div>

      <div className="inpu">
        <Autocomplete
          id="combo-box-demo"
          options={suggestions}
          getOptionLabel={(option) => option.name.toString()}
          renderInput={(params) => (
            <TextField
              {...params}
              label={allStrings.venuePlaceHolder}
              variant="outlined"
            />
          )}
          onChange={SelectVenueHandler}
          onKeyUp={SelectVenueHandler}
        />
        <input
          type="submit"
          className="submitBtn"
          onClick={handleSubmit}
          value={allStrings.submitButton.toUpperCase()}
          style={{
            backgroundColor: `#${primaryColor}`,
            border: `#${primaryColor}`,
            padding: "0.55rem",
          }}
        ></input>
      </div>
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

export default ManualVenue;
