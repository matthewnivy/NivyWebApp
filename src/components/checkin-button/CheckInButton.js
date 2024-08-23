import { MdLocationOn } from "react-icons/md";
import { Fragment, useContext, useEffect, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { allStrings } from "../../commons";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import CustomAlert from "../alert/customAlert";
import { makeStyles } from "@material-ui/core";
import { getCoordinatesViaVenue } from "../../utills/rest-apis/ApiHandeling";
import "./style.scss";

function CheckInButton({ showModal }) {
  const { user, checkIn, setCheckIn } =
    useContext(ApplicationContext);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    fetchCoordinatesViaVenue();
  }, []);

  const fetchCoordinatesViaVenue = async () => {
    let response = await getCoordinatesViaVenue(getData(keys.venueId));
    console.log(response);
    if (response.success) {
      setLatitude(response.content.latitude);
      setLongitude(response.content.longitude);
    }
  };

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (
        position.coords.latitude == latitude &&
        position.coords.longitude == longitude
      ) {
        user ? setCheckIn(true) : showModal(true);
      } else {
        Animate();
        setAlertData({
          message: `Must be located at event!`,
          type: allStrings.apiResponseType.error,
        });
      }
    });
  };

  const handleClose = () => {
    setChecked((prev) => !prev);
  };

  const Animate = () => {
    setChecked((prev) => !prev);
    setTimeout(() => {
      setChecked(false);
    }, 10000);
  };

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    getData(keys?.userDetails) && setCheckIn(true);
  }, []);

  return (
    <Fragment>
      <div>
        {checkIn ? (
          <div className="checkmark-container checkin-btn-shadow checkin-btn-sizing">
            <svg viewBox="0 0 25 30" fill="none" className="checkmark-svg">
              <path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2" />
            </svg>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="checkin-btn-sizing checkin-btn-shadow  checkin-btn-container"
            style={{ backgroundColor: `#${getData(keys.secondaryColor)}` }}
          >
            <MdLocationOn className="signOut" />{" "}
            <span>{allStrings.checkin}</span>
          </div>
        )}
      </div>
      <div className={classes.wrapper}>
        <CustomAlert
          message={alertData.message}
          onClose={handleClose}
          type={alertData.type}
          checked={checked}
        />
      </div>
    </Fragment>
  );
}

export default CheckInButton;
