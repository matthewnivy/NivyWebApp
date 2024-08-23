import React from "react";
import "./style.scss";

export const SubInput = ({ placeHolder, textType }) => {
  return (
    <div className={"SubContainer"}>
      <form>
        <input
          type={textType}
          className={"SubinputStyle"}
          placeholder={placeHolder}
        />
      </form>
    </div>
  );
};
