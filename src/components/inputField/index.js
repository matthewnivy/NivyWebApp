import React from "react";
import "./style.scss";
import fx from "../../utills/call.svg";
import em from "../../utills/email.svg";
import us from "../../utills/user.svg";

export const InputField = ({
  getValue,
  placeHolder,
  count,
  textType,
  isdisable,
  val
}) => {
  const SpaceHander = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div className="MainContainer">
      {count == 1 ? <img src={us} className={"img"} /> : null}
      {count == 2 ? <img src={fx} className={"img"} /> : null}
      {count == 3 ? <img src={em} className={"img"} /> : null}
      <input
        style={{ border: "none" }}
        type={textType}
        value={val}
        className={"inputStyle"}
        placeholder={placeHolder}
        onChange={(e) => getValue(e.target.value)}
        required={require}
        disabled={isdisable && true}
        maxLength={60}
        onKeyDown={SpaceHander}
      />
    </div>
  );
};
