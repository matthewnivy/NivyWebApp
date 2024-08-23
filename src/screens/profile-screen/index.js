import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { Mainheader, SideBar } from "../../components/index";
import { allStrings } from "../../commons/index";
import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData, saveData } from "../../utills/local-storage/index";
import Modal from "../../components/modal/Modal";
import ReactLoading from "react-loading";
import "./../../components/forms/UpdateAccount.scss";
import { updateAccount } from "../../utills/rest-apis/ApiHandeling";
import { JSONToObject, ObjectToJSON } from "../../utills/helpers/AuthHelper";
import { makeStyles } from "@material-ui/core/styles";
import CustomAlert from "../../components/alert/customAlert";
import { fields } from "./formData";
const UpdateAccountForm = React.lazy(() =>
  import("../../components/forms/UpdateAccountForm")
);

export function ProfileScreen() {
  let firstNameDOM;
  let lastNameDOM;
  let existingPasswordDOM;
  let newPasswordDOM;
  let confirmNewPasswordDOM;

  const [bar, setBar] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [errorMessage, setErrorMessage] = useState({});
  const [checked, setChecked] = useState(false);
  const [alertData, setAlertData] = useState({});

  const { user, primaryColor, setPrimaryColor } =
    useContext(ApplicationContext);

  const updateProfileHandler = async (
    firstName,
    lastName,
    existingPassword,
    newPassword
  ) => {
    let response = await updateAccount(
      firstName,
      lastName,
      existingPassword,
      newPassword
    );
    try {
      Animate();
      let updatedValue = {};
      if (response.success === true) {
        updatedValue = {
          message: response?.content,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
        const { userId, Phone, Email } = JSONToObject(
          getData(keys.userDetails)
        );
        let obj = JSONToObject(getData(keys.userDetails));
        obj = { ...obj, FirstName: firstName, LastName: lastName };
        saveData(keys.userDetails, ObjectToJSON(obj));
      } else {
        updatedValue = {
          message: `${response?.title}!  ${response?.description}`,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
      }
    } catch (error) {}
  };

  const inputRefs = useRef([]);
  inputRefs.current = [];

  const addToRefs = (element) => {
    if (element && !inputRefs.current.includes(element)) {
      inputRefs.current.push(element);
    }
    firstNameDOM = inputRefs.current[0];
    lastNameDOM = inputRefs.current[1];
    existingPasswordDOM = inputRefs.current[4];
    newPasswordDOM = inputRefs.current[5];
    confirmNewPasswordDOM = inputRefs.current[6];
  };

  const validate = () => {
    const errors = {};
    if (!firstNameDOM.value) {
      errors.firstName = allStrings.formValidation.requireFirstName;
    }
    if (!lastNameDOM.value) {
      errors.lastName = allStrings.formValidation.requireLastName;
    }
    if (!existingPasswordDOM.value) {
      errors.currentPassword =
        allStrings.formValidation.requireExistingPassword;
    }
    if (!newPasswordDOM.value) {
      errors.newPassword = allStrings.formValidation.requireNewPassword;
    }
    if (!confirmNewPasswordDOM.value) {
      errors.confirmNewPassword =
        allStrings.formValidation.requireConfirmNewPassword;
    }
    if (newPasswordDOM.value && confirmNewPasswordDOM.value) {
      if (newPasswordDOM.value !== confirmNewPasswordDOM.value)
        errors.confirmNewPassword =
          allStrings.formValidation.newPasswordMismatch;
    }
    if (existingPasswordDOM.value && newPasswordDOM.value) {
      if (existingPasswordDOM.value === newPasswordDOM.value) {
        errors.newPassword =
          allStrings.formValidation.oldAndNewPasswordValidation;
      }
    }
    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
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

  const handleSubmission = (e) => {
    e.preventDefault();

    if (validate()) {
      updateProfileHandler(
        firstNameDOM.value,
        lastNameDOM.value,
        existingPasswordDOM.value,
        newPasswordDOM.value
      );
    }
  };

  const handleChange = (e) => {
    validate();
  };

  setPrimaryColor(getData(keys.primaryColor));
  var scrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);
  const preventDefaultKeys = useCallback((event) => {
    if (scrollKeys[event.keyCode]) {
      event.preventDefault();
      return false;
    }
  }, []);

  function disableMainBody() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultKeys, false);

    document
      .getElementsByClassName("header")[0]
      .classList.add("disable-interactions");
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);

    document
      .getElementsByClassName("header")[0]
      .classList.remove("disable-interactions");
  }

  const check = () => {
    if (bar == false) {
      setBar(true);
      disableMainBody();
    } else {
      setBar(false);
      enableMainBody();
    }
  };
  const allCheck = () => {
    if (bar == true) {
      setBar(false);
      enableMainBody();
      return;
    } else {
      return;
    }
  };

  return (
    <>
      <div onClick={() => allCheck()} className={bar ? "blur" : null}>
        <Mainheader show={() => check()} mainText={allStrings.title} />

        <div>
          <div>
            <div className={"side"}>
              <SideBar
                color={primaryColor}
                show={() => check()}
                hide={bar}
                openModal={setModal}
              />
            </div>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className={"loader"}>
            <ReactLoading
              type={"spin"}
              color={"#d3d3d3"}
              height={"20%"}
              width={"20%"}
            />
          </div>
        }
      >
        <UpdateAccountForm
          handleSubmission={handleSubmission}
          handleChange={handleChange}
          primaryColor={primaryColor}
          addToRefs={addToRefs}
          errorMessage={errorMessage}
          inputRefs={inputRefs}
          fields={fields}
        />
      </Suspense>

      {modal ? (
        <Modal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
        ></Modal>
      ) : null}

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
