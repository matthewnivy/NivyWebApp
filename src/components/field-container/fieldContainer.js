import React, { memo, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { allStrings } from "../../commons";
import { icons } from "../../screens/profile-screen/formData";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { JSONToObject } from "./../../utills/helpers/AuthHelper";
import "./fieldContainer.scss";

const FieldContainer = ({
  placeholder,
  inputType,
  isEditable,
  referalKey,
  color,
  id,
  addToRefs,
  error,
  errorKey,
  inputRefs,
  val,
}) => {
  let [isHide, setIsHide] = useState(true);
  const [inputValue, setInputValue] = useState(
    JSONToObject(getData(keys.userDetails))[val]
  );
  let canHide;
  if (
    errorKey === allStrings.currentPassword ||
    errorKey === allStrings.newPassword ||
    errorKey === allStrings.confirmNewPassword
  ) {
    canHide = 1;
  }

  const handlePasswordToggle = (e) => {
    if (inputRefs.current[id].type === allStrings.inputTypes.text) {
      inputRefs.current[id].type = allStrings.inputTypes.password;
      setIsHide(true);
    } else if (inputRefs.current[id].type === allStrings.inputTypes.password) {
      inputRefs.current[id].type = allStrings.inputTypes.text;
      setIsHide(false);
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="input-container input">
        <div className="icon" style={{ color: `#${color}` }}>
          {icons[referalKey]}
        </div>
        <input
          type={inputType}
          ref={addToRefs}
          placeholder={placeholder}
          style={{
            border: `1px solid #${color}`,
          }}
          value={inputValue}
          onChange={handleInputChange}
          className={isEditable ? "" : "isEdit"}
          readOnly={!isEditable}
        ></input>
        {canHide &&
          (isHide ? (
            <AiOutlineEyeInvisible
              className="icon pass-icon invi"
              onClick={handlePasswordToggle}
            />
          ) : (
            <AiOutlineEye
              className="icon pass-icon"
              onClick={handlePasswordToggle}
            />
          ))}
      </div>

      {error[errorKey] ? (
        <span id="validationError">{error[errorKey]}</span>
      ) : null}
    </>
  );
};

export default memo(FieldContainer);
