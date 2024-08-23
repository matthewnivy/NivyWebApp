import React, { useState, useContext, useEffect } from "react";
import "./style.scss";
import { CartBox } from "../index";
import { allStrings } from "../../commons";
import ApplicationContext from "../../utills/context-api/context";
import CustomModal from "../modal/Modal";
import { isUserLoggedIn } from "../../utills/helpers/AuthHelper";

export const CartDepartment = ({
  PID,
  arrays,
  catagoryName,
  modelOpen,
  orderReview,
  deliveryCharg,
  vendorTotal,
  tax,
  Buttonquantity,
  vId,
  updatePopUpClosed,
  setdeliveryCharges,
  popUp,
  dID,
  dNAME,
  dPrice,
  dTax,
  delvendroId,
  popOpen,
  setUrl,
  address,
  setCheckD,
  clickOpenHandler,
  onCheckBoxChange,
  isDeliveryBackend,
}) => {
  const [subTotal, setSubTotal] = useState(0);
  const [isDeliveryCheck, setisDeliveryCheck] = useState(false);
  const { setOrderList, OrderList, primaryColor, historyRewardsData } =
    useContext(ApplicationContext);

  //custom modal
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");

  const filteredRewards = historyRewardsData?.filter(
    (reward) =>
      reward.rewardStatus === allStrings.rewardsStatus.redeemed &&
      reward.rewardCouponVendors[0] == vId
  );

  useEffect(() => {
    //to update jSon According to Delivery Charges
    let temp = [...OrderList];
    temp.forEach((tempElement) => {
      let vendorsItem = tempElement.vendorsItems;
      vendorsItem.forEach((vendorsItemElement) => {
        if (vendorsItemElement.vendorId == vId) {
          vendorsItemElement.isDelivery = isDeliveryCheck;
        }
      });
    });
    setOrderList(temp);
  }, [isDeliveryCheck]);

  const handleRewardsRedemption = () => {
    setModal(true);
    setModalScreen(allStrings.modalScreens.rewards);
  };

  return (
    <div>
      {arrays.length !== 0 && orderReview == true ? (
        <div>
          <ul className={"ulList margin"}>
            <li>{catagoryName}</li>
          </ul>
          {isUserLoggedIn() && filteredRewards?.length > 0 && (
            <div
              className="redeemRewards"
              style={{ backgroundColor: `#${primaryColor}` }}
              onClick={handleRewardsRedemption}
            >
              {allStrings.applyRewards}
            </div>
          )}
        </div>
      ) : null}
      {arrays.length !== 0 && orderReview == true ? (
        <div className={"main"}>
          <div className={"checkBox"}>
            <div className={"innercheckbox"}>
              {isDeliveryBackend == true ? (
                <>
                  <input
                    id="delivery-checkbox"
                    type="checkbox"
                    name={deliveryCharg}
                    onChange={(e) => {
                      if (e.target.checked) {
                        clickOpenHandler();
                        setdeliveryCharges((p) => p + deliveryCharg);
                        onCheckBoxChange(e.target.checked, deliveryCharg);
                        setisDeliveryCheck(true);
                        setCheckD(true);
                        address(true);
                      } else if (e.target.checked == false) {
                        setdeliveryCharges((p) => p - deliveryCharg);
                        onCheckBoxChange(e.target.checked, deliveryCharg);
                        setisDeliveryCheck(false);
                        setCheckD(false);
                        address(false);
                      }
                    }}
                  />
                  <b>
                    <p className={"deliverytotal"}>
                      Delivery ({"Add $" + deliveryCharg.toFixed(2)})
                    </p>
                  </b>
                </>
              ) : null}
            </div>
            <div>
              <p className={"deliverytotal"}>
                <b>
                  <span style={{ fontSize: "13px" }}>
                    {allStrings.subTotalText}
                  </span>
                </b>
                {"$" +
                  (isDeliveryCheck === true
                    ? (deliveryCharg + vendorTotal).toFixed(2)
                    : (0 + vendorTotal).toFixed(2))}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <div className={"containers"}>
        <div className={"boxes"}>
          {arrays.map((item) => {
            return (
              <div className={"innerList"}>
                <CartBox
                  quantityBtn={orderReview}
                  title={item.itemName}
                  options={item.itemOptions}
                  itemPrice={item.itemPrice}
                  itemQuantity={item.quantity}
                  open={(e) => modelOpen(e, item)}
                  id={item.id}
                  ID={(val) => PID(val)}
                  subtotal={subTotal}
                  setsubtotal={(val) => setSubTotal(val)}
                  img={item.images}
                  taxRate={item.itemTaxRate}
                  getValue={(val) => Buttonquantity(val)}
                  vId={vId}
                  updatePopUpClosed={updatePopUpClosed}
                  popUpOpen={popUp}
                  dId={dID}
                  dName={dNAME}
                  DPrice={dPrice}
                  DTax={dTax}
                  DVendorId={delvendroId}
                  popOpen={popOpen}
                  pooUperl={setUrl}
                  instruction={item.instructions}
                />
              </div>
            );
          })}
        </div>
      </div>
      {modal ? (
        <CustomModal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
          checkoutForm={"1"}
          rewardCouponVendors={vId}
        ></CustomModal>
      ) : null}
    </div>
  );
};
