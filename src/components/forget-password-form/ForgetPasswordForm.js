import { BiPhoneCall } from "react-icons/bi";
import { useRef, useState } from "react";
import { allStrings } from "../../commons";
import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApplicationContext from "../../utills/context-api/context";
import CustomAlert from "../alert/customAlert";
import { getPasswordResetCode } from "../../utills/rest-apis/ApiHandeling";

function ForgetPasswordForm({ changeModalScreen }) {
  const phoneNum = useRef();
  const { primaryColor } = useContext(ApplicationContext);

  const [errorMsg, setErrorMsg] = useState(null);
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});

  const forgetPasswordHandler = async (phoneNumber) => {
    let response = await getPasswordResetCode(phoneNumber);
    try {
      console.log({ response });
      if (response.success === true) {
        changeModalScreen("resetCodeForm");
      } else {
        Animate();
        let updatedValue = {
          message: `${response?.title}!  ${response?.description}`,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      }
    } catch (error) {}
  };

  const validate = () => {
    if (phoneNum.current.value) {
      if (phoneNum.current.value.length !== 10) {
        setErrorMsg("Phone number must consist of 10 digits.");
        return false;
      }

      setErrorMsg(null);
      return true;
    }

    setErrorMsg("Please enter phone number.");
    return false;
  };

  const preventInvalidChar = (e) => {
    return ["-", "e", "E", "+"].includes(e.key) && e.preventDefault();
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    if (validate()) {
      forgetPasswordHandler(phoneNum.current.value);
    }
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
          <div className="login-text">{allStrings.forgotPassword}</div>
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
        {errorMsg ? <span className="error">{errorMsg}</span> : null}
        <input
          type="submit"
          value={allStrings.sendCode}
          className="submitBtn"
          style={{ background: `#${primaryColor}`, border: `#${primaryColor}` }}
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

export default ForgetPasswordForm;
