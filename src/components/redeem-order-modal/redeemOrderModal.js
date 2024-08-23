import food from "./../../utills/food1.jpg";
import getSVG from "../../commons/svgs";
import { allStrings } from "../../commons";
import { useContext, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import "./style.scss";
import {
  getCustomerRewardHistoryList,
  getCustomerScorePoints,
  redeemReward,
} from "../../utills/rest-apis/ApiHandeling";
import { makeStyles } from "@material-ui/core";
import CustomAlert from "../alert/customAlert";

function RedeemOrderModal({ openModal, changeModalScreen }) {
  const {
    primaryColor,
    setPrimaryColor,
    redeemData,
    setRedeemData,
    rewardsData,
    setRewardsData,
    setHistoryRewardsData,
    setProfileCoin,
  } = useContext(ApplicationContext);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});

  const handleClose = () => {
    setChecked((prev) => !prev);
  };
  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      justifyContent: "center",
    },
  }));
  const classes = useStyles();

  const Animate = () => {
    setChecked((prev) => !prev);
    setTimeout(() => {
      setChecked(false);
    }, 10000);
  };

  const handleCloseClick = (e) => {
    openModal(false);
    changeModalScreen(allStrings.modalScreens.login);
  };

  const getCustomerScorePointsHandler = async () => {
    let venueId = getData(keys.venueId);
    let response = await getCustomerScorePoints(venueId);
    if (response.success) {
      setProfileCoin(response?.content);
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

  const handleRedeemClickHandler = async () => {
    let venueId = getData(keys.venueId);
    let rewardId = redeemData[0].rewardId;
    try {
      let response = await redeemReward(venueId, rewardId);
      if (response.success) {
        setRewardsData(rewardsData.filter((i) => i.rewardId !== rewardId));
        getCustomerRewardHistoryListApiHandler();
        getCustomerScorePointsHandler();
        openModal(false);
        changeModalScreen(allStrings.modalScreens.login);
      } else {
        Animate();
        let updatedValue = {};
        updatedValue = {
          message: `${response?.title}!  ${response?.description}`,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      }
    } catch (error) {}
  };

  setPrimaryColor(getData(keys.primaryColor));
  let pendingCase = false;
  if (redeemData[0]?.statusName === "pending") {
    pendingCase = true;
  }
  return (
    <div className="redeemOrderContainer">
      {pendingCase ? (
        <>
          {/* <img src={food}></img> */}
          <div className="item-name">{allStrings.teamShopCoupon}</div>
          <div className="points-badge">
            <img src={getSVG.coin}></img>
            <span className="amount">{redeemData[0].cost}</span>
          </div>
          <div className="pending-text-div">
            <span className="pending-text">
              {
                allStrings.showThisCouponToTheAttendantInTheTeamShopToRedeemYourCoupon
              }
            </span>
          </div>

          <div
            onClick={() => handleCloseClick()}
            className="confirmBtn"
            style={{ background: `#${primaryColor}` }}
          >
            {allStrings.ok.toUpperCase()}
          </div>
        </>
      ) : (
        <div>
          {/* <img src={food}></img> */}
          <div className="item-name">{redeemData[0]?.name}</div>
          <div className="points-badge">
            <img src={getSVG.coin}></img>
            <span className="amount">{redeemData[0]?.cost}</span>
          </div>

          <div
            onClick={() => handleRedeemClickHandler()}
            className="confirmBtn"
            style={{ background: `#${primaryColor}` }}
          >
            {allStrings.confirm.toUpperCase()}
          </div>
        </div>
      )}
      <div className={classes.wrapper}>
        <CustomAlert
          message={alertData.message}
          onClose={handleClose}
          type={alertData.type}
          checked={checked}
        />
      </div>
    </div>
  );
}

export default RedeemOrderModal;
