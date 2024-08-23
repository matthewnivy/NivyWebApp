import { useContext, useEffect, useState } from "react";
import { allStrings, colors } from "../commons";
import RewardBox from "../components/reward-box/RewardBox";
// import { allStrings }
import ApplicationContext from "../utills/context-api/context";
import { getUserDetails, ObjectToJSON } from "../utills/helpers/AuthHelper";
import { getData, saveData } from "../utills/local-storage";
import { keys } from "../utills/local-storage/keys";
import {
  consumeReward,
  getCustomerRewardHistoryList,
} from "../utills/rest-apis/ApiHandeling";

function MultipleRewardsModal({ openModal, rewardCouponVendors }) {
  const {
    historyRewardsData,
    setHistoryRewardsData,
    primaryColor,
    discountAmount,
    setDiscountAmount,
    setTotal,
    total,
  } = useContext(ApplicationContext);
  let [selectedReward, setSelectedReward] = useState();
  let [couponAmount, setCouponAmount] = useState(0);

  useEffect(() => {
    console.log("hey total");
    setTotal(getData(keys.TotalAmount) ?? 0);
  }, [total, getData(keys.TotalAmount)]);

  const getCustomerRewardHistoryListApiHandler = async () => {
    let venueId = getData(keys.venueId);
    let response = await getCustomerRewardHistoryList(venueId);
    if (response.success) {
      setHistoryRewardsData(response.content);
    }
  };

  const [filteredRewards, setFilteredRewards] = useState(
    historyRewardsData.filter(
      (reward) =>
        reward.rewardStatus === allStrings.rewardsStatus.redeemed &&
        reward.rewardCouponVendors[0] == rewardCouponVendors
    )
  );
  console.log(
    historyRewardsData,
    "kk",
    filteredRewards,
    "hey",
    rewardCouponVendors
  );

  const clickOptionHandler = (name, vendorId, rewardId, e, rewardAmount) => {
    console.log(
      name,
      vendorId,
      rewardId,
      "SELECTED REWARD ID",
      rewardId,
      e,
      rewardAmount
    );
    for (
      let i = 0;
      i < document.getElementsByClassName(`rewardWriting`).length;
      i++
    ) {
      document.getElementsByClassName(`rewardWriting`)[i].style.border = "0";
    }
    setSelectedReward(rewardId);
    setCouponAmount(Number(couponAmount) + Number(rewardAmount));
    document.getElementsByClassName(
      `rewardWriting ${name}`
    )[0].style.border = `3px solid grey`;
  };

  const HandleSubmit = async () => {
    console.log("selectedReward ID", selectedReward);
    const userId = getUserDetails(getData(keys.accessToken)).userId;
    let venueId = getData(keys.venueId);
    try {
      console.log(userId, venueId, selectedReward);
      let response = await consumeReward(userId, venueId, selectedReward);
      console.log("Api Submit Response ::: ", response);
      if (response.success) {
        setFilteredRewards(
          filteredRewards.filter((reward) => reward.rewardId != selectedReward)
        );
        setDiscountAmount(discountAmount + couponAmount);
        setTotal(getData(keys.TotalAmount));
        saveData(keys.discountAmount, couponAmount);
        getCustomerRewardHistoryListApiHandler();
        filteredRewards?.length == 0 && openModal(false);
      }
    } catch (error) {}
  };

  return (
    <>
      <div>
        <div className="text">
          <div className="login-text">{allStrings.selectRewards}</div>
          <hr />
        </div>
        <div id="venueBox">
          <>
            {filteredRewards?.map((reward, index) => (
              <RewardBox
                reward={reward.rewardName}
                key={index}
                name={rewardCouponVendors}
                onClick={(e) => {
                  clickOptionHandler(
                    reward.rewardName,
                    rewardCouponVendors,
                    reward.rewardId,
                    e,
                    reward.rewardCouponAmmount
                  );
                }}
              />
            ))}
            <input
              onClick={() => {
                HandleSubmit();
              }}
              type="button"
              className="submitBtn"
              value={allStrings.apply}
              style={{ background: `#${primaryColor}` }}
            />
          </>
        </div>
      </div>
    </>
  );
}

export default MultipleRewardsModal;
