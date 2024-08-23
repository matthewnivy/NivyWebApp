import React from "react";
import "./style.scss";

export const Payment = ({ textOne, textTwo }) => {
  return (
    <div>
      <div className={"paymentBox"}>
        <p className={"innerTexts"}>{textOne}</p>
        <p className={"totalPrice"}>{textTwo}</p>
      </div>
    </div>
  );
};
