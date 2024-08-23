import "./style.scss";
import food from "./../../utills/food1.jpg";
import coin from "./Group.svg";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { useEffect, useContext } from "react";
import { allStrings, colors } from "../../commons";
import getSVG from "../../commons/svgs";

function ItemContainer({ openModal, changeModalScreen, modalScreen, data }) {
  const { primaryColor, setPrimaryColor, redeemData, setRedeemData } =
    useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));

  const handleClick = (name, cost, statusName, rewardId) => {
    if (statusName === "redeemed" || statusName== "used") {
      return;
    }
    let dataRedeem = [];
    dataRedeem.push({
      name: name,
      cost: cost,
      statusName: statusName,
      rewardId: rewardId,
    });

    setRedeemData(dataRedeem);
    console.log("Redeem Data Aneeq 3333 :::::::::::     ", redeemData);
    changeModalScreen(allStrings.modalScreens.redeemOrder);
    openModal(true);
  };

  return (
    <div className="itemContainer">
      {data.slice(0)
            .reverse()
            .map((val, index) => {
        let statusName = "Redeem";
        const redeemedColor = `2d981c`;
        const redeemedBackgroundColor = `EEF7ED`;
        if (val?.rewardStatus) {
          statusName = val?.rewardStatus;
        }
        return (
          <div className="item" key={val.rewardId}>
            {/* <img className="itemImage" src={val?.rewardImage}></img> */}

            <span className="itemTitle">{val?.rewardName}</span>
            <div className="points-badge">
              <img src={getSVG.coin}></img>
              <span className="amount">{val?.rewardCost}</span>
            </div>
            <div
              className="redeemBtn"
              onClick={() =>
                handleClick(
                  val?.rewardName,
                  val?.rewardCost,
                  statusName,
                  val?.rewardId
                )
              }
              style={{
                backgroundColor: `#${
                  statusName == "redeemed"
                    ? redeemedBackgroundColor
                    : statusName == allStrings.rewardsStatus.pending
                    ? colors.yellow
                    : primaryColor
                }`,
                color: `#${statusName == "redeemed" ? redeemedColor : "fff"}`,
              }}
            >
              {`${statusName}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ItemContainer;
