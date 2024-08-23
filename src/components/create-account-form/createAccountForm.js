import { BiUser, BiLock } from "react-icons/bi";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
} from "react-icons/ai";
import { allStrings } from "../../commons";
import { memo, useContext, useRef, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { createAccountDetails } from "../../utills/rest-apis/ApiHandeling";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./createAccountForm.scss";
import { makeStyles } from "@material-ui/core";
import CustomAlert from "../alert/customAlert";
import { React } from "react";
import {
  inputOrder,
  removeImages,
  stripeDevelopmentKey,
} from "../../utills/helpers/StripeHelper";
import ReactLoading from "react-loading";

function CreateAccountForm({ changeModalScreen, openModal }) {
  let {
    primaryColor,
    setPrimaryColor,
    setPhoneNumberwithOutCountryCode,
    signupCheckout,
    guestCheckout,
    total,
    grandTaxTotal,
    grandSubTotal,
    totalDeliveryCharges,
    setPassword,
  } = useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [loader, setLoader] = useState(false);

  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const createAccountDetailsHandler = async (
    firstName,
    lastName,
    withoutCountryCode,
    countryCode,
    email,
    password
  ) => {
    let apiResponse = await createAccountDetails(
      firstName,
      lastName,
      withoutCountryCode,
      countryCode,
      email,
      password
    );
    try {
      Animate();
      if (apiResponse?.success === false) {
        let updatedValue = {};
        updatedValue = {
          message: `${apiResponse?.description}!`,
          type: apiResponse.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      } else {
        changeModalScreen(allStrings.modalScreens.verifyAccount, openModal);
      }
    } catch (error) {}
  };

  const validate = () => {
    if (!firstName.current.value) {
      setErrorMsg(allStrings.formValidation.requireFirstName);
      return false;
    }
    if (!lastName.current.value) {
      setErrorMsg(allStrings.formValidation.requireLastName);
      return false;
    }
    if (!phoneNumber) {
      setErrorMsg(allStrings.formValidation.requirePhoneNumber);
      return false;
    }
    if (!password.current.value && !guestCheckout) {
      setErrorMsg(allStrings.formValidation.requirePassword);
      return false;
    }
    if (
      !isAlphaOnly(firstName.current.value) ||
      !isAlphaOnly(lastName.current.value)
    ) {
      setErrorMsg(
        "Name must have atleast 2 characters and should consist of alphabets only."
      );
      return false;
    }
    if (!email.current.value.includes("@")) {
      setErrorMsg("Invalid email address.");
      return false;
    }
    console.log(phoneNumber, phoneNumber.length);
    if (phoneNumber.length < 11) {
      setErrorMsg(allStrings.phoneLengthVerificationMessage);
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const isAlphaOnly = (str) => {
    if (str.length >= 2 && /^[a-zA-Z]+$/.test(str)) {
      return true;
    }
    return false;
  };

  const diff = (diffMe, diffBy) => diffMe.split(diffBy).join("");
  const handleSubmission = async (e) => {
    e.preventDefault();
    let vidlating = validate();
    setPhoneNumberwithOutCountryCode(e.target[3].value.replace(/[- )(]/g, ""));
    setPassword(password.current.value);

    const withoutCountryCode = e.target[3].value;
    //phone number with country code, phone number without country code
    // diff(phoneNumber, e.target[3].value) -> differnce to get the country code

    if (
      (vidlating && !guestCheckout) ||
      (vidlating && guestCheckout && password.current.value)
    ) {
      createAccountDetailsHandler(
        firstName.current.value,
        lastName.current.value,
        e.target[3].value.replace(/[- )(]/g, ""),
        diff(phoneNumber, withoutCountryCode.replace(/[- )(]/g, "")),
        email.current.value,
        password.current.value ?? null
      );
    } else if (vidlating && guestCheckout && !password.current.value) {
      removeImages();
      setLoader(true);
      let sessionID = await inputOrder(
        firstName.current.value,
        lastName.current.value,
        withoutCountryCode,
        email.current.value,
        total,
        grandTaxTotal,
        grandSubTotal,
        totalDeliveryCharges
      );
      setLoader(false);
      (await stripeDevelopmentKey).redirectToCheckout({ sessionId: sessionID }); // redirecting to checkout
    }
  };

  const handlePasswordToggle = (e) => {
    showPass
      ? (password.current.type = "password")
      : (password.current.type = "text");

    setShowPass(!showPass);
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
      <form
        className="modalForm inp"
        onChange={validate}
        onSubmit={handleSubmission}
        noValidate
      >
        <div className="text">
          <div className="login-text">
            {guestCheckout ? allStrings.continueAsGuest : allStrings.signup}
          </div>
        </div>
        <div className="input-container">
          <BiUser className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="text"
            placeholder="First Name"
            style={{
              border: `1px solid #${primaryColor}`,
            }}
            ref={firstName}
          ></input>
        </div>
        <div className="input-container">
          <BiUser className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="text"
            placeholder="Last Name"
            style={{
              border: `1px solid #${primaryColor}`,
            }}
            ref={lastName}
          ></input>
        </div>
        {console.log(signupCheckout, "signupCheckoutCREATE ACOOUNT")}
        {console.log(guestCheckout, "guestCheckout CREATE ACOOUNT")}
        <div className="input-container">
          <PhoneInput
            international={false}
            defaultCountry={allStrings.defaultCountry}
            placeholder={allStrings.phoneNumber}
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
        </div>
        <div className="input-container">
          <AiOutlineMail
            className="icon"
            style={{ color: `#${primaryColor}` }}
          />
          <input
            type="email"
            placeholder="Email"
            style={{
              border: `1px solid #${primaryColor}`,
            }}
            ref={email}
          ></input>
        </div>

        <div className="input-container">
          <BiLock className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="password"
            placeholder={guestCheckout ? "Password (Optional)" : "Password"}
            ref={password}
            style={{ border: `1px solid #${primaryColor}` }}
          ></input>

          {showPass ? (
            <AiOutlineEyeInvisible
              className="icon pass-icon invi"
              onClick={handlePasswordToggle}
            />
          ) : (
            <AiOutlineEye
              className="icon pass-icon"
              onClick={handlePasswordToggle}
            />
          )}
        </div>

        {errorMsg ? <span className="error">{errorMsg}</span> : null}

        <input
          type="submit"
          value={
            guestCheckout && !password?.current?.value
              ? allStrings.checkoutText.toUpperCase()
              : allStrings.sendCode.toUpperCase()
          }
          className="submitBtn"
          style={{
            backgroundColor: `#${primaryColor}`,
            border: `#${primaryColor}`,
            padding: "0.55rem",
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
      {loader ? (
        <div className={"want_end"}>
          <ReactLoading
            type={"spin"}
            color={"#d3d3d3"}
            height={"20%"}
            width={"20%"}
          />
        </div>
      ) : null}
    </>
  );
}

export default memo(CreateAccountForm);
