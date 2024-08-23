import { getData } from "../utills/local-storage";
import { keys } from "../utills/local-storage/keys";
import { allStrings } from "./constants";

const baseUrl =
  process.env.NODE_ENV === "development" ||
  window.location.origin.includes("develop")
    ? `${allStrings.apiBaseUrl.develop}/api/Venue`
    : `${allStrings.apiBaseUrl.master}/api/Venue`;

const baseUrl2 =
  process.env.NODE_ENV === "development" ||
  window.location.origin.includes("develop")
    ? `${allStrings.apiBaseUrl.develop}/api/Account`
    : `${allStrings.apiBaseUrl.master}/api/Account`;

const baseUrl3 =
  process.env.NODE_ENV === "development" ||
  window.location.origin.includes("develop")
    ? `${allStrings.apiBaseUrl.develop}/api/Contest`
    : `${allStrings.apiBaseUrl.master}/api/Contest`;

const eventBaseURL =
  process.env.NODE_ENV === "development" ||
  window.location.origin.includes("develop")
    ? `${allStrings.apiBaseUrl.develop}/api/Event`
    : `${allStrings.apiBaseUrl.master}/api/Event`;

//---base url for the main deployemnts
// const baseUrl = "https://nivyapi-develop.azurewebsites.net/api/Venue";

const organization = {
  id: getData(keys.orgId),
};

const endpoints = {
  organization: "/OrganizationVenue/",
  vendorsLocation: "/CategoryVendors/",
  menu: "/GetVendorMenus/",
  getDetails: "/GetItemDetails/",
  addorder: "/AddNewOrder",
  orderDetailsHistory: "/GetOrderDetailsHistory/",
  customerLogIn: "/CustomerLogIn/",
  createCustomerAccount: "/CreateCustomerAccount/",
  verifyCustomerAccount: "/VerifyCustomerAccount/",
  getCustomerRewardList: "/GetCustomerRewardList",
  getCustomerRewardsHistory: "/GetCustomerRewardsHistory",
  getCustomerScorePoints: "/GetCustomerScorePoints",
  redeemReward: "/RedeemReward",
  getCustomerContestList: "/GetCustomerContestList",
  getCustomerPastContestList: "/CustomerPastContestList",
  submitContestAnswer: "/SubmitContestAnswer",
  updateCustomerAccount: "/UpdateCustomerAccount",
  getOrdersList: "/GetOrdersList/",
  cancelOrder: "/MarkOrderCancelled/",
  orderDetails: "/GetOrderDetails/",
  getVenueAutomatically: "/GetVenueByLatLong/",
  getVenueManually: "/GetVenueByName/",
  consumeReward: "/CustomerConsumeReward/",
  getPasswordResetCode: "/GetPasswordResetCode/",
  resetPasswordByCode: "/ResetPasswordByCode/",
  isEventActive: "/EventAvailable",
  coordiantesViaVenue: "/GetLatLongByVenueId",
};

const header = {
  simpleHeader: {
    "access-control-allow-origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  },
  jsonHeader: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
  tokenHeader: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTczZTdiOC00MWYyLTRlMjMtYTk4ZS1iOTlkNWI2OGY5NWMiLCJGaXJzdE5hbWUiOiJUYWhpciIsIkxhc3ROYW1lIjoiTWVobW9vZCIsIlBob25lIjoiMzMzMTQzNTQ3NiIsIkVtYWlsIjoiYmx1ZXN0YWNrdGFoaXJAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJuYmYiOiIxNjQ3NjA3Mjk2IiwiZXhwIjoiMTY1MDE5OTI5NiJ9.e93t6fJICREknWx4_VZtSmZquKJDZPku9lYqkyfc3r0`,
  },
};

const methods = {
  get: "GET",
  post: "POST",
};
export function authenticatedHeader() {
  const bearerToken = getAuthTokenDetails();
  return {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    Authorization: bearerToken,
  };
}

export const getAuthTokenDetails = () => {
  let authToken = getData(keys.accessToken);
  let bearerToken = `Bearer ${authToken}` || "";
  return bearerToken;
};

export {
  methods,
  baseUrl,
  baseUrl2,
  baseUrl3,
  endpoints,
  header,
  organization,
  eventBaseURL,
};
