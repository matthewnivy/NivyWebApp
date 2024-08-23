import React from "react";
import { allStrings } from "../../commons";
import "./styles.scss";

export function Description({ disciption, price, url }) {
  return (
    <>
      <div className={"Container"}>
        <div className={"img_container"}>
          <img src={url} width={75} />
        </div>
        <div className={"text_container"}>
          <div className={"headingContainer"}>
            <p className={"description"}>{allStrings.description}</p>
          </div>
          <div className={"paragraphContainer"}>
            <p className={"textStyle"}>{disciption ? disciption : "N/A"}</p>
          </div>
          <div className={"headingContainer"}>
            <p className={"price"}>
              <span style={{ color: "#000" }}>
                <b>{allStrings.price} $</b>
              </span>
              {price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
