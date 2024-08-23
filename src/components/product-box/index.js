import React, { useEffect, useContext, useState } from "react";
import "./style.scss";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { allStrings } from "../../commons/constants";

export const Product = ({
  show,
  productPrice,
  productName,
  imgUrl,
  setImageUrl,
  outOfstock,
}) => {
  const { setItemName, primaryColor, setcartImgUrl } =
    useContext(ApplicationContext);
  const [vendorImg, setVendorImg] = useState("");
  useEffect(() => {
    setVendorImg(getData(keys.vendorImgUrl));
  }, []);

  const openModel = () => {
    show();
    setItemName(productName);
    if (imgUrl == "") {
      setImageUrl(vendorImg);
      setcartImgUrl([""]);
    } else {
      setImageUrl(imgUrl[0]);
      setcartImgUrl(imgUrl);
    }
  };

  return (
    <div style={{ borderColor: `#${primaryColor}` }} className={"main_div1"}>
      <div className={"imgBox"}>
        {imgUrl.length != 0 ? (
          <img className={"imgstyling"} src={imgUrl[0]} width={50} />
        ) : (
          <img className={"imgstyling"} src={vendorImg} width={50} />
        )}
      </div>
      <div className={"childContainer"}>
        <div className="productTitleContainer">
          <p className={"productName"}>{productName}</p>
        </div>
        {outOfstock == false ? (
          <div onClick={() => openModel()} className="buttonConatiner">
            <button
              style={{ backgroundColor: `#${primaryColor}` }}
              className="orderBtn1"
            >
              {allStrings.selectButton}
            </button>
          </div>
        ) : (
          <div className="buttonConatiner">
            <button disabled={true} className="StockBtn">
              {allStrings.disable}
            </button>
          </div>
        )}
        <div className="priceContainer">
          <p className="productPrice">{"$" + productPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
