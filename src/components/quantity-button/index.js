import React, { useContext } from "react";
import "./style.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPlusSmall } from "react-icons/go";
import { AiOutlineMinus } from "react-icons/ai";
import ApplicationContext from "../../utills/context-api/context";

export const QuantityButton = ({ count, inc, dec, onModalScreenButton }) => {
  const { primaryColor } = useContext(ApplicationContext);
  return (
    <div>
      <div
        style={onModalScreenButton === true ? { height: 26, width: 85 } : null}
        className={"btnDiv"}
      >
        <div className={count < 2 ? "decrease disable-interactions" : "decrease"} onClick={() => dec()}>
          {count < 2 ? (
            <AiOutlineMinus
              style={{ color: `#BBB`}}
              className={"icons disable-interactions"}
            />
          ) : (
            <AiOutlineMinus
              style={{ color: `#${primaryColor}` }}
              className={"icons"}
            />
          )}
        </div>
        <div style={{ color: `#${primaryColor}` }} className={"quantity"}>
          {count}
        </div>
        <div className={"increase"} onClick={() => inc()}>
          <GoPlusSmall
            style={{ color: `#${primaryColor}` }}
            className={"icons"}
          />
        </div>
      </div>
    </div>
  );
};
