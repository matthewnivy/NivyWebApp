import {
  baseUrl,
  baseUrl2,
  baseUrl3,
  eventBaseURL,
  header,
  endpoints,
  methods,
} from "../../commons/index";
import { JSONToObject, ObjectToJSON } from "../helpers/AuthHelper";
import { getData } from "../local-storage";
import { keys } from "../local-storage/keys";
import { authenticatedHeader } from "./../../commons/endPoints";
const fetchOrganization = async (venueId) => {
  let response = await fetch(baseUrl + endpoints.organization + venueId, {
    method: methods.get,
    headers: header.simpleHeader,
  });
  return await response.json();
};

const getCustomerRewardList = async (venueId) => {
  let response = await fetch(baseUrl + endpoints.getCustomerRewardList, {
    method: methods.post,
    headers: header.jsonHeader,
    body: JSON.stringify({
      userId: JSONToObject(getData(keys.userDetails)).userId ?? null,
      venueId: venueId,
    }),
  });
  return await response.json();
};
const getCustomerRewardHistoryList = async (venueId) => {
  let response = await fetch(baseUrl + endpoints.getCustomerRewardsHistory, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: JSON.stringify({
      userId: JSONToObject(getData(keys.userDetails)).userId ?? null,
      venueId: venueId,
    }),
  });
  return await response.json();
};

const getCustomerScorePoints = async (venueId) => {
  let response = await fetch(baseUrl2 + endpoints.getCustomerScorePoints, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: JSON.stringify({
      userId: JSONToObject(getData(keys.userDetails)).userId ?? null,
      venueId: venueId,
    }),
  });
  return await response.json();
};

const getCustomerContestList = async (userId, venueId) => {
  let response = await fetch(baseUrl3 + endpoints.getCustomerContestList, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: JSON.stringify({
      // userId: "a173e7b8-41f2-4e23-a98e-b99d5b68f95c",
      userId: userId,
      venueId: venueId,
    }),
  });
  return await response.json();
};

const getCustomerPastContestList = async (userId, venueId) => {
  let response = await fetch(baseUrl3 + endpoints.getCustomerPastContestList, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: JSON.stringify({
      userId: userId,
      venueId: venueId,
    }),
  });
  return await response.json();
};

const submitContestAnswer = async (
  userId,
  venueId,
  contestId,
  selectedAnswer
) => {
  let response = await fetch(baseUrl3 + endpoints.submitContestAnswer, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: JSON.stringify({
      userId: userId,
      venueId: venueId,
      contestId: contestId,
      selectedAnswer: selectedAnswer,
    }),
  });
  return await response.json();
};

const redeemReward = async (venueId, rewardId) => {
  let response = await fetch(baseUrl + endpoints.redeemReward, {
    method: methods.post,
    headers: header.jsonHeader,
    body: JSON.stringify({
      userId: JSONToObject(getData(keys.userDetails)).userId ?? null,
      venueId: venueId,
      rewardId: rewardId,
    }),
  });
  return await response.json();
};

const fetchVendorsLocation = async (ordId, selectVal, catId, bSortVendors) => {
  let response = await fetch(baseUrl + endpoints.vendorsLocation, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      venueId: ordId,
      category: catId,
      section: selectVal ? `Section ${selectVal}` : selectVal,
      bSortVendors: selectVal ? true : false,
      //section null bsortvendor = false to get all vendors from all section
      //if bSortVendors = true max three vendors are shown

      // bsort = true -> all vendors from current section -> stadium
      // bsort = false -> all vendors from all sections ->restaurant

      // bsort = false or true when section = null -> all vendors will be shown
    }),
  });
  return await response.json();
};

const fetchVendorsMenu = async (venueId, vendorId) => {
  let response = await fetch(baseUrl + endpoints.menu, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({ venueId: venueId, vendorId: vendorId }),
  });
  return await response.json();
};

const UpdateOrder = async (Orderid) => {
  let response = await fetch(
    "https://nivyapi-develop.azurewebsites.net/api/PaypalPayment/UpdateOrder?OrderId=" +
      Orderid,
    {
      method: methods.post,
      headers: header.simpleHeader,
    }
  );
  return await response.json();
};

const fetchItemDetails = async (venueId, id, itemName) => {
  let response = await fetch(baseUrl + endpoints.getDetails, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      venueId: venueId,
      vendorId: id,
      itemName: itemName,
    }),
  });
  return await response.json();
};

const addnewOrder = async (
  total,
  userName,
  userLastName,
  userContact,
  userEmail,
  dateAndTime,
  vendorList,
  grandTaxTotal,
  grandSubTotal,
  totalDeliveryCharges,
  sectionName,
  rowNumber,
  seatNumber,
  ordId
) => {
  console.log("venueId", ordId);
  console.log("firstName", userName);
  console.log("lastName : ", userLastName);
  console.log("phoneNumber : ", userContact.toString());
  console.log("emailAddress : ", userEmail);
  console.log("localDateTime : ", dateAndTime);
  console.log("grandTotal : ", parseFloat(total));
  console.log(
    "grandSubTotal : ",
    parseFloat(grandSubTotal - totalDeliveryCharges).toFixed(2)
  );
  console.log("grandTaxTotal : ", parseFloat(grandTaxTotal).toFixed(2));
  console.log(
    "totalDeliveryCharges : ",
    parseFloat(totalDeliveryCharges).toFixed(2)
  );
  console.log("sectionNo : ", sectionName);
  console.log("rowNo : ", rowNumber);
  console.log("seatNo : ", seatNumber);
  console.log("paymentType", "Stripe");
  console.log("vendorsItems", vendorList);
  let response = await fetch(baseUrl + endpoints.addorder, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      orgId: ordId,
      venueId: ordId,
      firstName: userName,
      lastName: userLastName,
      phoneNumber: userContact.toString(),
      emailAddress: userEmail,
      localDateTime: dateAndTime,
      grandTotal: parseFloat(total),
      grandSubTotal: grandSubTotal - totalDeliveryCharges,
      grandTaxTotal: grandTaxTotal,
      totalDeliveryCharges: parseFloat(totalDeliveryCharges),
      sectionNo: sectionName, //loc1  //
      rowNo: rowNumber, //loc2 //loc1
      seatNo: seatNumber, //loc3 //loc2
      paymentType: "Stripe",
      vendorsItems: vendorList,
      customerId: getData(keys?.userDetails)
        ? JSONToObject(getData(keys?.userDetails))?.userId
        : null,
    }),
  });
  return response.json();
};

const login = async (phoneNum, password) => {
  let response = await fetch(baseUrl2 + endpoints.customerLogIn, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      phoneNumber: phoneNum,
      password: password,
    }),
  });
  return response.json();
};

const updateAccount = async (
  firstName,
  lastName,
  existingPassword,
  newPassword
) => {
  let response = await fetch(baseUrl2 + endpoints.updateCustomerAccount, {
    method: methods.post,
    headers: authenticatedHeader(),
    body: ObjectToJSON({
      id: JSONToObject(getData(keys.userDetails)).userId,
      firstName: firstName,
      lastName: lastName,
      phone: JSONToObject(getData(keys.userDetails)).Phone,
      email: JSONToObject(getData(keys.userDetails)).Email,
      oldPassword: existingPassword,
      newPassword: newPassword,
    }),
  });
  return response.json();
};

const createAccountDetails = async (
  firstName,
  lastName,
  withoutCountryCode,
  countryCode,
  email,
  password
) => {
  let response = await fetch(baseUrl2 + endpoints.createCustomerAccount, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: withoutCountryCode,
      countryCode: countryCode,
      password: password,
    }),
  });
  return response.json();
};

const verifyAccountDetails = async (verifyCode, phoneNumber) => {
  let response = await fetch(baseUrl2 + endpoints.verifyCustomerAccount, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      verificationCode: verifyCode,
      phone: phoneNumber,
    }),
  });
  return response.json();
};

const fetchOrderDetailsHistory = async (OrderId, vendorOrderId, venueId) => {
  let res = await fetch(baseUrl + endpoints.orderDetailsHistory, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      orderId: OrderId,
      venueId: venueId,
      vendorOrderId: vendorOrderId,
    }),
  });
  return await res.json();
};

const fetchOrderDetails = async (OrderId) => {
  let res = await fetch(baseUrl + endpoints.orderDetails + OrderId, {
    method: methods.get,
    headers: header.simpleHeader,
  });
  return await res.json();
};

const fetchOrderList = async () => {
  let response = await fetch(
    baseUrl +
      endpoints.getOrdersList +
      `?customerId=${JSONToObject(getData(keys.userDetails)).userId ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return await response.json();
};

const cancelOrder = async (OrderId, vendorOrderId, venueId, customerId) => {
  let response = await fetch(baseUrl + endpoints.cancelOrder, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      orderId: OrderId ?? null,
      venueId: venueId ?? null,
      vendorOrderId: vendorOrderId ?? null,
      customerId: `${customerId}`,
    }),
  });
  return await response.json();
};

const fetchVenueViaLatituteLongitude = async (latitude, longitude) => {
  let response = await fetch(
    baseUrl +
      endpoints.getVenueAutomatically +
      `?Latitude=${latitude ?? null}&Longitude=${longitude ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return await response.json();
};

const fetchVenueByName = async (name) => {
  let response = await fetch(
    baseUrl + endpoints.getVenueManually + `?name=${name ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return await response.json();
};

const consumeReward = async (userId, venueId, rewardId) => {
  let response = await fetch(baseUrl + endpoints.consumeReward, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      userId: userId,
      venueId: venueId,
      rewardId: rewardId,
    }),
  });
  return response.json();
};

const getPasswordResetCode = async (mobileNo) => {
  let response = await fetch(
    baseUrl2 + endpoints.getPasswordResetCode + `?mobileNo=${mobileNo ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return response.json();
};

const resetPasswordByCode = async (code, newPassword) => {
  let response = await fetch(baseUrl2 + endpoints.resetPasswordByCode, {
    method: methods.post,
    headers: header.simpleHeader,
    body: JSON.stringify({
      code: code,
      newPassword: newPassword,
    }),
  });
  return response.json();
};

const isEventActive = async (venueId) => {
  let response = await fetch(
    eventBaseURL + endpoints.isEventActive + `?venueId=${venueId ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return response.json();
};

const getCoordinatesViaVenue = async (venueId) => {
  const response = await fetch(
    baseUrl + endpoints.coordiantesViaVenue + `?id=${venueId ?? null}`,
    {
      method: methods.get,
      headers: header.simpleHeader,
    }
  );
  return response.json();
};

export {
  fetchOrganization,
  fetchVendorsLocation,
  fetchVendorsMenu,
  fetchItemDetails,
  addnewOrder,
  fetchOrderDetailsHistory,
  UpdateOrder,
  login,
  createAccountDetails,
  getCustomerRewardList,
  getCustomerRewardHistoryList,
  getCustomerScorePoints,
  redeemReward,
  getCustomerContestList,
  getCustomerPastContestList,
  submitContestAnswer,
  updateAccount,
  verifyAccountDetails,
  fetchOrderList,
  cancelOrder,
  fetchOrderDetails,
  fetchVenueViaLatituteLongitude,
  fetchVenueByName,
  consumeReward,
  getPasswordResetCode,
  resetPasswordByCode,
  isEventActive,
  getCoordinatesViaVenue
};
