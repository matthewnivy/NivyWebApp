import "./style.scss";
import { useRef } from "react";
import { allStrings } from "../../commons";
import { useContext, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";

function ResetCodeForm({ changeModalScreen }) {
  const submitBtn = useRef();

  const { primaryColor, setResetCode } = useContext(ApplicationContext);

  const [errorMsg, setErrorMsg] = useState(null);

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
    let resetCode = "";
    Array.from(e.target.elements).forEach((el) => {
      if (!el.classList.contains("submitBtn")) resetCode += el.value;
    });

    if (resetCode.length !== 6) {
      setErrorMsg("Please provide the 6-digit reset code.");
      return;
    } else {
      setErrorMsg(null);
      resetCode = Number.parseInt(resetCode);
      setResetCode(resetCode);
      changeModalScreen("createPassword");
    }
  };

  const preventInvalidChar = (e) => {
    return ["-", "e", "E", "+"].includes(e.key) && e.preventDefault();
  };

  return (
    <form className="modalForm" onSubmit={handleSubmission}>
      <div className="text">
        <div className="login-text">{allStrings.forgotPassword}</div>
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
        value={allStrings.sendCode}
        className="submitBtn"
        style={{
          background: `#${primaryColor}`,
          border: `1px solid #${primaryColor}`,
        }}
      ></input>
    </form>
  );
}

export default ResetCodeForm;
