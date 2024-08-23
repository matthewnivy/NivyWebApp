import "./style.scss";
import { allStrings } from "../../commons";
import { useParams } from "react-router-dom";
import { Fragment, useContext, useEffect } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { cancelOrder } from "../../utills/rest-apis/ApiHandeling";
import { JSONToObject } from "../../utills/helpers/AuthHelper";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
function CancelOrderModal({ openModal }) {
  const orderId = useParams();
  const id = orderId.id;

  const { vendorOrderId, setVendorOrderId } = useContext(ApplicationContext);
  let urlParam = JSONToObject(getData(keys.urlParameters));

  const cancelOrderHandler = async (
    OrderId,
    vendorOrderId,
    venueId,
    customerId
  ) => {
    let response = await cancelOrder(
      OrderId,
      vendorOrderId,
      venueId,
      customerId
    );
    if (response.success) {
      setVendorOrderId("");
      window.location.href = "/Orders";
    }
  };

  const handleDontCancel = () => {
    openModal(false);
  };

  const handleCancel = () => {
    cancelOrderHandler(
      id.toString(),
      vendorOrderId,
      urlParam.venueId,
      JSONToObject(getData(keys.userDetails)).userId
    );
  };

  return (
    <div>
      <div className="cancelOrderText">
        <div>{allStrings.cancelQuestion}</div>
        <p>{allStrings.cancelText}</p>
      </div>

      <div className="parent">
        <div className="cancelBtn mutedBtn resize" onClick={handleDontCancel}>
          {allStrings.dontCancel}
        </div>
        <div className="cancelBtn resize">
          <div onClick={handleCancel}>{allStrings.cancelOrder}</div>
        </div>
      </div>
    </div>
  );
}

export default CancelOrderModal;
