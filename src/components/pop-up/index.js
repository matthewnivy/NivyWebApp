import { allStrings } from "../../commons/constants";
import "./style.scss";

export const Popup = () => {
  return (
    <div>
      <div className={"OuterBox"}>
        <div className={"inputs "}>
          <div className={"inputdiv"}>
            <label>{allStrings.row}</label>
            <input type="number" />
          </div>
          <div className={"inputdiv"}>
            <label>{allStrings.section}</label>
            <input type="number" />
          </div>
          <div>
            <button className={"button"}>{allStrings.submitButton}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
