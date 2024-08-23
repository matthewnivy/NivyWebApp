import "./style.scss";
import { BiPhoneCall, BiLock } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { allStrings } from "../../commons";
import ApplicationContext from "../../utills/context-api/context";
import { login } from "../../utills/rest-apis/ApiHandeling";
import { saveData } from "../../utills/local-storage";
import { ObjectToJSON, getUserDetails } from "../../utills/helpers/AuthHelper";
import { keys } from "../../utills/local-storage/keys";
import { makeStyles } from "@material-ui/core";
import CustomAlert from "../alert/customAlert";
import { ReactLoading } from "react-loading";
import {
  inputOrder,
  removeImages,
  stripeDevelopmentKey,
} from "../../utills/helpers/StripeHelper";

function LoginForm({
  openModal,
  changeModalScreen,
  checkoutForm,
  contestLogin,
}) {
  const phoneNum = useRef(null);
  const password = useRef(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});
  const {
    setUser,
    primaryColor,
    signupCheckout,
    setSignupCheckout,
    setGuestCheckout,
    total,
    grandTaxTotal,
    grandSubTotal,
    totalDeliveryCharges,
  } = useContext(ApplicationContext);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setSignupCheckout(false);
    setGuestCheckout(false);
  }, []);

  const loginHandler = async (phoneNum, password) => {
    let apiResponse = await login(phoneNum, password);
    try {
      Animate();
      let updatedValue = {};
      if (apiResponse?.success === false) {
        updatedValue = {
          message: `${apiResponse?.title}!  ${apiResponse?.description}`,
          type: apiResponse.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      } else {
        console.log({ apiResponse });
        updatedValue = {
          message: allStrings.loggedIn,
          type: apiResponse.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
        saveData(keys.accessToken, apiResponse.content.token);
        saveData(
          keys.userDetails,
          ObjectToJSON(getUserDetails(apiResponse.content.token))
        );
        openModal(false);
        setUser(true);
        contestLogin && <Link to="/contests" />;
        if (signupCheckout || checkoutForm) {
          removeImages();
          setLoader(true);
          let sessionID = await inputOrder(
            total,
            grandTaxTotal,
            grandSubTotal,
            totalDeliveryCharges
          );
          setLoader(false);
          (await stripeDevelopmentKey).redirectToCheckout({
            sessionId: sessionID,
          }); // redirecting to checkout
        }
      }
    } catch (error) {}
  };

  const validate = () => {
    if (phoneNum.current.value && password.current.value) {
      if (phoneNum.current.value.length !== 10) {
        setErrorMsg("Phone number must consist of 10 digits.");
        return false;
      }

      setErrorMsg(null);
      return true;
    }

    setErrorMsg("Please enter both number/password to login.");
    return false;
  };

  const preventInvalidChar = (e) => {
    return ["-", "e", "E", "+"].includes(e.key) && e.preventDefault();
  };

  const handleSubmission = (e) => {
    e.preventDefault();

    if (validate()) {
      loginHandler(phoneNum.current.value, password.current.value);
    }
  };

  const handleChange = (e) => {
    validate();
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
        className="modalForm"
        onSubmit={handleSubmission}
        onChange={handleChange}
      >
        <div className="text">
          <div className="login-text">
            {contestLogin ? allStrings.loginContest : allStrings.signIn}
          </div>
        </div>

        <div className="input-container">
          <BiPhoneCall className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="number"
            ref={phoneNum}
            placeholder="Phone Number"
            style={{ border: `1px solid #${primaryColor}` }}
            onKeyPress={preventInvalidChar}
          ></input>
        </div>

        <div className="input-container">
          <BiLock className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="password"
            placeholder="Password"
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

        <span
          className="forgetPassword link"
          onClick={() => {
            changeModalScreen("forgetPassword");
          }}
        >
          {allStrings.forgetPassword}
        </span>
        <input
          type="submit"
          value={allStrings.submit}
          className="submitBtn"
          style={{
            backgroundColor: `#${primaryColor}`,
            border: `#${primaryColor}`,
          }}
        ></input>
        {!checkoutForm && (
          <span
            className="signUp link"
            style={{ color: `#${primaryColor}` }}
            onClick={() => {
              changeModalScreen(
                allStrings.modalScreens.createAccount,
                openModal
              );
            }}
          >
            {allStrings.signup}
          </span>
        )}

        {checkoutForm && (
          <div class="container">
            <div
              class="item"
              id="item-1"
              style={{
                color: `#${primaryColor}`,
                border: `2px solid #${primaryColor}`,
              }}
              onClick={() => {
                setSignupCheckout(true);
                changeModalScreen(
                  allStrings.modalScreens.createAccount,
                  openModal
                );
              }}
            >
              {allStrings.signup}
            </div>
            <div
              class="item"
              id="item-2"
              style={{ color: `#${primaryColor}` }}
              onClick={() => {
                changeModalScreen(
                  allStrings.modalScreens.createAccount,
                  openModal
                );
                setGuestCheckout(true);
              }}
            >
              {allStrings.continueAsGuest}
            </div>
          </div>
        )}
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

export default LoginForm;
