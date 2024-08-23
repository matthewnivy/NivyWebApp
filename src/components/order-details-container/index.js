import food from "./../../utills/food1.jpg";
import { allStrings } from "../../commons";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { useContext } from "react";

import "./style.scss";
function OrderDetailsContainer({
  itemName,
  image,
  instructions,
  quantity,
  totalPrice,
}) {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));
  return (
    <>
      <div className="orderHeading">Orders</div>
      <div className="orderDetailsContainer">
        <div className="orderImageContainer">
          <img src={image ? image : food}></img>
        </div>
        <div className="orderDetails">
          <div className="name">{itemName}</div>
          <div className="addons">
            <span>{allStrings.addons}</span>

            <span className="addons-badge">Extra Cheese</span>
          </div>
          <div className="orderInfo">
            <div className="orderInstructions">
              <p className="instructionTitle">{allStrings.instruction}</p>
              <p className="instructions">
                {instructions ? instructions : "none"}
              </p>
            </div>

            <div className="quantityPrice">
              <div className="orderQuantity">x{quantity}</div>
              <div
                className="orderPrice"
                style={{ backgroundColor: `#${primaryColor}` }}
              >
                ${totalPrice}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsContainer;
