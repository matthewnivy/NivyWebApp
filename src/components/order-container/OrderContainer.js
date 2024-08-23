import "./style.scss";
import { allStrings } from "../../commons";
import { Link } from "react-router-dom";
import ApplicationContext from "../../utills/context-api/context";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripe = loadStripe(allStrings.stripePublicKey); // stripe public development key

function OrderContainer({
  orderId,
  orderStatus,
  name,
  orderDateTime,
  vendorOrderId,
  paymentSessionId,
}) {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  let date = new Date(orderDateTime);
  let today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let day =
    today.getDate() === date.getDate() &&
    today.getDay() === date.getDay() &&
    today.getFullYear() === date.getFullYear()
      ? "Today"
      : days[date.getDay()];
  let month = months[date.getMonth()];

  const handleCheckout = async (e) => {
    if (orderStatus === allStrings.orderStatus.pending) {
      e.preventDefault();
      (await stripe).redirectToCheckout({ sessionId: paymentSessionId }); // redirecting to checkout
    }
  };

  return (
    <div className="orders">
      <div className="orderContainer">
        <div className="date-time">
          <p className="date">
            {day}, {date.getDate()} {month}
          </p>
          <p>{formatAMPM(date)}</p>
        </div>

        <div
          className="orderDetails"
          style={{ border: `2px solid #${primaryColor}` }}
        >
          <div className="userDetails">
            <p className="orderId">#{orderId}</p>
            <p className="userName">{name}</p>
          </div>

          <div
            className={`statusBadge ${orderStatus}`}
            onClick={handleCheckout}
          >
            {orderStatus}
          </div>
          <Link
            style={{ textDecoration: "none" }}
            to={{
              pathname: `/details/${orderId}`,
              vendorOrderId: `${vendorOrderId}`,
              id: { orderId },
            }}
          >
            <div
              className="orderDetailsBtn"
              style={{ backgroundColor: `#${primaryColor}` }}
            >
              Order Details
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderContainer;
