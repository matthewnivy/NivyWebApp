import "./style.scss";
import { useRef } from "react";
import { allStrings } from "../../commons";
import { useContext, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";
import {
  login,
  verifyAccountDetails,
} from "../../utills/rest-apis/ApiHandeling";
import { makeStyles } from "@material-ui/core";
import CustomAlert from "../alert/customAlert";
import { Link } from "react-router-dom";
import { keys } from "../../utills/local-storage/keys";
import { saveData } from "../../utills/local-storage";
import { getUserDetails, ObjectToJSON } from "../../utills/helpers/AuthHelper";

const VerifyAccountForm = ({ changeModalScreen, contestLogin, openModal }) => {
  const submitBtn = useRef();

  const { primaryColor, phoneNumberwithOutCountryCode, password, setUser } =
    useContext(ApplicationContext);

  const [errorMsg, setErrorMsg] = useState(null);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});

  const verifyAccountDetailsHandler = async (verifyCode) => {
    let apiResponse = await verifyAccountDetails(
      `${verifyCode}`,
      phoneNumberwithOutCountryCode
    );
    try {
      Animate();
      if (apiResponse?.success === false) {
        let updatedValue = {};
        updatedValue = {
          message: `${
            apiResponse?.description
              ? apiResponse?.description
              : apiResponse?.title
          }!`,
          type: apiResponse.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      } else {
        debugger;
        console.log(
          "phoneNumberwithOutCountryCode, password",
          phoneNumberwithOutCountryCode,
          password
        );
        let res = await login(phoneNumberwithOutCountryCode, password);
        saveData(keys.accessToken, res.content.token);
        saveData(
          keys.userDetails,
          ObjectToJSON(getUserDetails(res.content.token))
        );
        setUser(true);
        openModal(false);
        contestLogin && <Link to="/contests" />;
      }
    } catch (error) {}
  };

  const handleInput = (e) => {
    if (e.target.nextSibling && e.target.value.length === e.target.maxLength)
      e.target.nextSibling.focus();
    else if (!e.target.nextSibling) submitBtn.current.focus();
  };

  const handleFocus = (e) => {
    if (e.target.value.length === 1) {
      e.target.select();
    }
  };

  const handleClick = (e) => {
    if (e.target.value.length === e.target.maxLength) {
      e.target.value = null;
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    let verifyCode = "";
    Array.from(e.target.elements).forEach((el) => {
      if (!el.classList.contains("submitBtn")) verifyCode += el.value;
    });

    if (verifyCode.length !== 6) {
      setErrorMsg(allStrings.verificationCodeErrorMessage);
      return;
    } else {
      setErrorMsg(null);
      verifyCode = Number.parseInt(verifyCode);
      verifyAccountDetailsHandler(verifyCode);
    }
  };

  const preventInvalidChar = (e) => {
    return ["-", "e", "E", "+"].includes(e.key) && e.preventDefault();
  };

  const Animate = () => {
    setChecked((prev) => !prev);
    setTimeout(() => {
      setChecked(false);
    }, 10000);
  };

  const handleClose = () => {
    setChecked((prev) => !prev);
  };

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      justifyContent: "center",
    },
  }));
  const classes = useStyles();

  return (
    <>
      <form className="modalForm" onSubmit={handleSubmission}>
        <div className="text">
          <div className="login-text">{allStrings.verifyAccount}</div>
          <div className="text-muted">{allStrings.enterCode}</div>
        </div>

        <div className="code-container">
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
          <input
            type="number"
            onInput={handleInput}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyPress={preventInvalidChar}
            maxLength="1"
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>
        </div>
        {errorMsg ? <span className="error">{errorMsg}</span> : null}
        <input
          type="submit"
          ref={submitBtn}
          value={allStrings.submitButton}
          className="submitBtn"
          style={{
            background: `#${primaryColor}`,
            border: `1px solid #${primaryColor}`,
          }}
        ></input>
      </form>

      <div className={classes.wrapper}>
        <CustomAlert
          message={alertData.message}
          onClose={handleClose}
          type={alertData.type}
          checked={checked}
        />
      </div>
    </>
  );
};

export default VerifyAccountForm;
