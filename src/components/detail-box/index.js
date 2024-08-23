import React, { useContext } from "react";
import "./style.scss";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegUserCircle, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ApplicationContext from "../../utills/context-api/context";
import { saveData } from "../../utills/local-storage/index";
import { keys } from "../../utills/local-storage/keys";
import { allStrings } from "../../commons/constants";

export function DetailBox({
  vendorName,
  offerDelivery,
  deliveryFee,
  vendorTaxRate,
  vendorLocation,
  distance,
  id,
  vendorUrl,
  backListName,
}) {
  const { setVendorId, primaryColor } = useContext(ApplicationContext);

  const SetId = () => {
    setVendorId(id);
    saveData("id", id);
    vendorUrl
      ? saveData(keys.vendorImgUrl, vendorUrl)
      : saveData(keys.vendorImgUrl, allStrings.staticImage);
  };

  return (
    <div style={{ borderColor: `#${primaryColor}` }} className={"main_div"}>
      <div className={"img_style"}>
        <Link
          to={{
            pathname: "/product",
            state: {
              name: vendorName,
              vendorId: id,
              isDelivery: offerDelivery,
              deliveryFee: deliveryFee,
              vendorTaxRate: vendorTaxRate,
              backListName: backListName,
            },
          }}
        >
          <img
            className={"VendorImage"}
            src={vendorUrl ? vendorUrl : allStrings.staticImage}
            onClick={() => SetId()}
          />
        </Link>
      </div>
      <div className={"textArea"}>
        <div className={"user"}>
          <FaRegUserCircle className={"icon"} color={"b2b2b2"} />
          <span className={"simpleText"}>{vendorName}</span>
        </div>
        <div className={"user"}>
          <HiOutlineLocationMarker className={"icon"} color={"b2b2b2"} />
          <span className={"simpleText"}>{vendorLocation}</span>
        </div>
        <div className={"user"}>
          <FaMapMarkedAlt className={"icon"} color={"b2b2b2"} />
          <span className={"simpleText"}>
            {distance}
            {distance == 1 ? " Section Away" : " Sections Away"}
          </span>
        </div>
      </div>
      <div className={"order_btn"}>
        <Link
          to={{
            pathname: "/product",
            state: {
              name: vendorName,
              vendorId: id,
              isDelivery: offerDelivery,
              deliveryFee: deliveryFee,
              vendorTaxRate: vendorTaxRate,
              backListName: backListName,
            },
          }}
          className="order_a"
        >
          <button
            style={{ backgroundColor: `#${primaryColor}` }}
            class="orderBtn"
            onClick={() => SetId()}
          >
            {allStrings.orderButton}
          </button>
        </Link>
      </div>
    </div>
  );
}
