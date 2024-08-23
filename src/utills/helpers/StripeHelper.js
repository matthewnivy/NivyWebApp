import { loadStripe } from "@stripe/stripe-js";
import { getData, saveData } from "../../utills/local-storage";
import { allStrings } from "../../commons";
import { JSONToObject, ObjectToJSON } from "./AuthHelper";
import { keys } from "../local-storage/keys";
import { addnewOrder } from "../rest-apis/ApiHandeling";

export const stripeDevelopmentKey = loadStripe(allStrings.stripePublicKey); // stripe public development key

let sessionID; // the ID that stripes uses to redirect to the checkout form

export const getDate = () => {
  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
  let day = month + "/" + date + "/" + year;
  return day;
};

export const getTime = () => {
  var time = new Date();
  var t = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  saveData("time", t);
  return t;
};

export const inputOrder = async (
  firstName,
  lastName,
  phoneNumber,
  email,
  total,
  grandTaxTotal,
  grandSubTotal,
  totalDeliveryCharges
) => {
  const secName = JSON.parse(getData(keys.sectId));
  let rowNumber = getData(keys.userLocationFields).includes(allStrings.section)
    ? JSON.parse(getData(keys.urlParameters))["loc2"]
    : JSON.parse(getData(keys.urlParameters))["loc1"];
  let seatNumber = getData(keys.userLocationFields).includes(allStrings.section)
    ? JSON.parse(getData(keys.urlParameters))["loc3"]
    : JSON.parse(getData(keys.urlParameters))["loc2"];

  const Time = getTime();
  const date = getDate();
  let dateAndTime = date + " " + Time;
  let userDetails = getData(keys?.userDetails);

  let res = await addnewOrder(
    JSONToObject(getData(keys.TotalAmount)).toFixed(2),
    userDetails ? JSONToObject(userDetails)?.FirstName : firstName,
    userDetails ? JSONToObject(userDetails)?.LastName : lastName,
    userDetails ? JSONToObject(userDetails).Phone : phoneNumber,
    userDetails ? JSONToObject(userDetails).Email : email,
    dateAndTime,
    JSONToObject(getData(keys.orderList))[0]?.vendorsItems,
    parseFloat(JSONToObject(getData(keys.grandTax)).toFixed(2)),
    parseFloat(JSONToObject(getData(keys.subtotal))).toFixed(2),
    parseFloat(getData(keys.delivery)).toFixed(2) ?? null,
    secName ? `${secName}` : secName,
    rowNumber,
    seatNumber,
    getData(keys.venueId)
  );
  if (res.success) {
    return res.content;
  }
};

export const removeImages = () => {
  let id;

  if (getData(keys.vedorSection) === "") {
    id = getData(keys.userSection);
  } else {
    id = getData(keys.vedorSection);
  }

  saveData(keys.sectId, id);
  let orders = JSONToObject(getData(keys.orderList));

  orders[0]?.vendorsItems.forEach((vendor) => {
    // Stripe server-side checkout demands that there should be no null keys, so if there are no images for items we have to delete the image key
    vendor.items.forEach((item) => {
      if (item.images && item.images.length) {
        item.images.forEach((image) => {
          if (image === "") delete item.images;
        });
      }
    });
  });

  saveData(keys.orderList, ObjectToJSON(orders));
};
