import { AiOutlineClose } from "react-icons/ai";
import { ImCheckmark } from "react-icons/im";
import React from "react";
import "./style.scss";
import { Slide } from "@material-ui/core";
import { BiError } from "react-icons/bi";
import { allStrings } from "../../commons";
const CustomAlert = ({ message, onClose, type, checked, bottomStyle,position }) => {
  return (
    <Slide
      direction={allStrings.slideDirection.up}
      in={checked}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={`toast-style-one toast-style-one-${type}`}
        style={{ bottom: bottomStyle, position: position }}
      >
        <div className={`toast-style-two toast-style-two-${type}`}>
          {type === allStrings.apiResponseType.success && (
            <ImCheckmark className={`toast-icon toast-icon-${type}`} />
          )}
          {type === allStrings.apiResponseType.error && (
            <BiError className={`toast-icon toast-icon-${type}`} />
          )}
        </div>
        <div className={`toast-style-three toast-style-three-${type}`}>
          {type}
          <br></br>
          <div className={`toast-style-four`}>{message}</div>
        </div>

        <AiOutlineClose className="alert-close" onClick={onClose} />
      </div>
    </Slide>
  );
};

export default CustomAlert;
