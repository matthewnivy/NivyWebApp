import { loadStripe } from "@stripe/stripe-js";
import { useContext, useEffect } from "react";
import { addnewOrder } from "../../utills/rest-apis/ApiHandeling";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import ApplicationContext from "../../utills/context-api/context";
import { allStrings } from "../../commons";
import "./style.scss";

const stripe = loadStripe(allStrings.stripePublicKey); // stripe public development key
// const stripe = "";
console.log("stripe ::::  ", stripe);
let sessionID; // the ID that stripes uses to redirect to the checkout form

const getDate = () => {
  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
  let day = month + "/" + date + "/" + year;
  return day;
};
const getTime = () => {
  var time = new Date();
  var t = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  saveData("time", t);
  return t;
};

const handleSubmission = async (e) => {
  e.preventDefault();
  (await stripe).redirectToCheckout({ sessionId: sessionID }); // redirecting to checkout
  saveData(keys.orderList,"");
  saveData(keys.subtotal,"");
  saveData(keys.grandTax,"");
  saveData(keys.TotalAmount,"");
  saveData(keys.cartCount,"");
};

function StripeButton({ loader }) {
  const {
    OrderList,
    grandTaxTotal,
    grandSubTotal,
    totalDeliveryCharges,
    total,
    userName,
    userLastName,
    userContact,
    userEmail,
  } = useContext(ApplicationContext);

  useEffect(() => {
    let id;

    if (getData(keys.vedorSection) === "") {
      id = getData(keys.userSection);
    } else {
      id = getData(keys.vedorSection);
    }

    saveData(keys.sectId, id);

    const inputOrder = async () => {
      const secName = getData(keys.sectId);
      let rowNumber = JSON.parse(getData(keys.urlParameters))["row"];
      let seatNumber = JSON.parse(getData(keys.urlParameters))["seat"];
      const Time = getTime();
      const date = getDate();
      let dateAndTime = date + " " + Time;

      loader(true);
      let res = await addnewOrder(
        total.toFixed(2),
        userName,
        userLastName,
        userContact,
        userEmail,
        dateAndTime,
        OrderList[0].vendorsItems,
        parseFloat(grandTaxTotal.toFixed(2)),
        parseFloat(grandSubTotal).toFixed(2),
        parseFloat(totalDeliveryCharges).toFixed(2),
        secName,
        rowNumber,
        seatNumber,
        getData(keys.venueId)
      );
      console.log("2 . Paypal Response ::: ", res);
      if (res.success) {
        loader(false);
        return res.content;
      }
    };

    OrderList[0].vendorsItems.forEach((vendor) => {
      // Stripe server-side checkout demands that there should be no null keys, so if there are no images for items we have to delete the image key
      vendor.items.forEach((item) => {
        if (item.images && item.images.length) {
          item.images.forEach((image) => {
            if (image === "") delete item.images;
          });
        }
      });
    });

    inputOrder().then((data) => {
      // creating order and getting the sessionID as a response
      sessionID = data;
    });
  }, []);

  return (
    <button className="stripe-btn" onClick={handleSubmission}>
      {allStrings.stripeButton}
    </button>
  );
}

export default StripeButton;
