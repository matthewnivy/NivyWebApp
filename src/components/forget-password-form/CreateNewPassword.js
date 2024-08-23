import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiLock } from "react-icons/bi";
import ApplicationContext from "../../utills/context-api/context";
import { useContext, useRef } from "react";
import { allStrings } from "../../commons";
import { resetPasswordByCode } from "../../utills/rest-apis/ApiHandeling";
import CustomAlert from "../alert/customAlert";
import { makeStyles } from "@material-ui/core";

function CreateNewPassword(props) {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { primaryColor, resetCode, setResetCode } =
    useContext(ApplicationContext);

  const newPassword = useRef();
  const confirmPassword = useRef();

  const [errorMsg, setErrorMsg] = useState(null);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});

  const newPasswordHandler = async (newPassword) => {
    let response = await resetPasswordByCode(`${resetCode}`, newPassword);
    try {
      Animate();
      console.log({ response });
      if (response?.success === false) {
        let updatedValue = {};
        updatedValue = {
          message: `${
            response?.description ? response?.description : response?.title
          }!`,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      } else {
        setResetCode("");
        props.openModal(false);
      }
    } catch (error) {}
  };

  const validate = () => {
    if (newPassword.current.value && confirmPassword.current.value) {
      if (newPassword.current.value === confirmPassword.current.value) {
        setErrorMsg(null);
        return true;
      }

      setErrorMsg("Passwords don't match.");
      return false;
    }

    setErrorMsg("Please enter both fields.");
    return false;
  };

  const handleSubmission = (e) => {
    e.preventDefault();

    validate() && newPasswordHandler(newPassword.current.value);
  };

  const handleNewPasswordToggle = (e) => {
    showNewPass
      ? (newPassword.current.type = "password")
      : (newPassword.current.type = "text");

    setShowNewPass(!showNewPass);
  };

  const handleConfirmPasswordToggle = (e) => {
    showConfirmPass
      ? (confirmPassword.current.type = "password")
      : (confirmPassword.current.type = "text");

    setShowConfirmPass(!showConfirmPass);
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
        onChange={validate}
      >
        <div className="text">
          <div className="login-text">{allStrings.createNewPassword}</div>
          <div className="text-muted">{allStrings.enterNewPassword}</div>
        </div>

        <div className="input-container">
          <BiLock className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            ref={newPassword}
            type="password"
            placeholder={`${allStrings.newPasswordPlaceholder}`}
            style={{ borderColor: `#${primaryColor}` }}
          ></input>

          {showNewPass ? (
            <AiOutlineEyeInvisible
              className="icon pass-icon invi"
              onClick={handleNewPasswordToggle}
            />
          ) : (
            <AiOutlineEye
              className="icon pass-icon"
              onClick={handleNewPasswordToggle}
            />
          )}
        </div>

        <div className="input-container">
          <BiLock className="icon" style={{ color: `#${primaryColor}` }} />
          <input
            type="password"
            placeholder={`${allStrings.confirmPasswordPlaceholder}`}
            ref={confirmPassword}
            style={{ borderColor: `#${primaryColor}` }}
          ></input>

          {showConfirmPass ? (
            <AiOutlineEyeInvisible
              className="icon pass-icon invi"
              onClick={handleConfirmPasswordToggle}
            />
          ) : (
            <AiOutlineEye
              className="icon pass-icon"
              onClick={handleConfirmPasswordToggle}
            />
          )}
        </div>

        {errorMsg ? <span className="error">{errorMsg}</span> : null}

        <input
          type="submit"
          value={allStrings.Login}
          className="submitBtn"
          style={{
            borderColor: `#${primaryColor}`,
            backgroundColor: `#${primaryColor}`,
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
}

export default CreateNewPassword;
