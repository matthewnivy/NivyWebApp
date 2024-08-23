import React, { useState } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  HashRouter,
  Redirect,
} from "react-router-dom";
import { name } from "./routesName/index";
import {
  HomeScreen,
  VendorDetails,
  ProductCatagory,
  CartScreen,
  CheckOutScreen,
  OrderReview,
  AccountScreen,
  ProfileScreen,
  UserOrders,
  OrderDetails,
  RewardsScreen,
  ContestScreen,
} from "../../screens/index";
import ApplicationContext from "../../utills/context-api/context";
import { saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { parse } from "query-string";
import AutomaticVenue from "../../components/automatic-venue/AutomaticVenue";
import ManualVenue from "../../components/manual-venue/ManualVenue";

export const Routing = () => {
  const [modelTotalPrice, setModelTotalPrice] = useState(0);
  const [sections, setSections] = useState([]);
  const [catId, setCatId] = useState("Food");
  const [vendor, setVendor] = useState([]);
  const [vendorId, setVendorId] = useState(0);
  const [itemName, setItemName] = useState("");
  const [signleOption, setSingleOptions] = useState([]);
  const [options, setItemOptions] = useState([]);
  const [addons, setAddons] = useState("");
  const [quantityItem, setQuantityItem] = useState("");
  const [edit, setEdit] = useState(false);
  const [productId, setProductId] = useState(1);
  const [catName, setCatName] = useState("");
  const [object, setObjects] = useState([]);
  const [productList, setProductsList] = useState([]);
  const [itemId, setItemId] = useState();
  const [vendorItems, setVendorItems] = useState([]);
  const [userLocationFields, setUserLocationFields] = useState([]);
  //for primary color
  const [primaryColor, setPrimaryColor] = useState("000");
  const [OrderList, setOrderList] = useState([]);
  const [grandTaxTotal, setgrandTaxTotal] = useState(0);
  const [grandSubTotal, setgrandSubTotal] = useState(0);
  const [totalDeliveryCharges, settotalDeliveryCharges] = useState(0);
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rowNumber, setRowNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [carCount, setcartCount] = useState(0);
  const [cartImgUrl, setcartImgUrl] = useState([]);
  const [instruction, seInstructions] = useState("");
  //for testing
  const [isDelete, setisDelete] = useState(false);
  const [deliveryCharges, setdeliveryCharges] = useState(0);
  const [orderReviewId, setOrderReviwewId] = useState();
  const [rout, setRout] = useState(false);
  const [itemTaxRate, setItemTaxRate] = useState();

  // user login state (yet to be implemented)
  const [user, setUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // user checkin state (yet to be implemented)
  const [checkIn, setCheckIn] = useState(false);

  //modal radeem data arryofobject
  const [redeemData, setRedeemData] = useState([]);

  //for cancel order
  const [vendorOrderId, setVendorOrderId] = useState("");

  //for phone number without country code used for signin/signup
  const [phoneNumberwithOutCountryCode, setPhoneNumberwithOutCountryCode] =
    useState();

  const [signupCheckout, setSignupCheckout] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [venues, setVenues] = useState({});
  const [isVisited, setIsVisited] = useState(false);

  //rewards
  const [rewardsData, setRewardsData] = useState([]);
  const [historyRewardsData, setHistoryRewardsData] = useState([]);
  const [profileCoin, setProfileCoin] = useState(0);

  //avail rewards discount
  const [discountAmount, setDiscountAmount] = useState(0);
  //forget password API
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");

  const findItemInArray = (array, id) => {
    return array.findIndex((e) => e.id == id);
  };
  // function for the Delet cart list JSON...
  const deletItem = (productId, price, taxRate, vendorId, checkD) => {
    let temp = [...OrderList];
    for (let i = 0; i < temp.length; i++) {
      let elem = temp[0].vendorsItems;
      elem.forEach((element, i) => {
        if (element.vendorId == vendorId) {
          let itemArray = element.items;
          itemArray.forEach((e) => {
            if (e.id == productId) {
              let index = findItemInArray(itemArray, productId);
              itemArray.splice(index, 1);
              setisDelete(!isDelete);
              let subtotal = element.vendorSubTotal;
              element.vendorSubTotal = subtotal - price.toFixed(2);
              let TaxAmount = parseFloat(
                (parseFloat(price) * parseFloat(taxRate)) / 100
              );
              element.taxAmount -= TaxAmount;
              let VenDorTotal = element.vendorSubTotal + element.taxAmount;
              element.vendorTotal = parseFloat(VenDorTotal.toFixed(2));
              setcartCount(carCount - 1);
            }
          });
          if (itemArray.length === 0) {
            elem.splice(i, 1);
            if (checkD && totalDeliveryCharges > 0) {
              setdeliveryCharges(
                totalDeliveryCharges - element.DeliveryCharges
              );
              if (totalDeliveryCharges === 0) {
                setRowNumber("");
                setSeatNumber("");
              }
              window.location.reload();
            }
          }
        }
      });
      if (elem.length === 0) {
        temp = [];
      }
    }
    setOrderList(temp);
    saveData(keys.orderList, JSON.stringify(temp));
  };

  let grandTotal = 0;
  let optionPrice = 0.0;
  let grandTax = 0.0;
  // function for the cart list JSON...
  const addNewOrder = (
    vendorId,
    itemName,
    signleOption,
    itemPrice,
    itemTaxRate,
    quantityItem,
    vendorName,
    offerDelivery,
    deliveryFee,
    taxRate,
    url,
    id,
    instruction
  ) => {
    for (let j = 0; j < signleOption.length; j++) {
      const element = signleOption[j].selectedOptions;
      for (let k = 0; k < element.length; k++) {
        const elem = element[k];
        optionPrice += parseFloat(elem.price);
      }
    }
    // converting string boolean into actual boolean value...
    function toBool(string) {
      if (string === "True") {
        return true;
      } else {
        return false;
      }
    }
    let temp = [...OrderList];
    // for item total tax calculations...
    for (let k = 0; k < temp.length; k++) {
      const vendorItem = temp[k].vendorsItems;
      for (let j = 0; j < vendorItem.length; j++) {
        const elem = vendorItem[j].items;
        for (let i = 0; i < elem.length; i++) {
          const element = elem[i];
          grandTax += element.itemTaxAmount * element.quantity;
          console.log(grandTax);
        }
      }
    }
    // for item total amount calculation...
    for (let i = 0; i < temp.length; i++) {
      const vendorItem = temp[i].vendorsItems;
      for (let j = 0; j < vendorItem.length; j++) {
        const obj = vendorItem[j].items;
        for (let k = 0; k < obj.length; k++) {
          const element = obj;
          grandTotal = 0;
          for (let l = 0; l < element.length; l++) {
            const object = element[l];
            grandTotal += object.itemSubTotal * object.quantity;
          }
        }
      }
    }
    if (temp.length === 0) {
      let itemTotalAmount = (
        parseFloat(itemPrice) + parseFloat(optionPrice)
      ).toFixed(2);
      let taxAmountPerItem =
        parseFloat(
          parseFloat(itemTaxRate) *
            (parseFloat(itemPrice) + parseFloat(optionPrice))
        ) / 100;
      let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
      let taxAmount = parseFloat(taxAmountPerItem * quantityItem);
      let VenDorTotal = parseFloat(subTotal + taxAmount);
      let fullPrice = parseFloat(
        parseFloat(itemTotalAmount) + parseFloat(taxAmountPerItem)
      );
      temp.push({
        vendorsItems: [
          {
            vendorId: vendorId,
            vendorName,
            vendorSubTotal: parseFloat(subTotal.toFixed(2)),
            taxRate: parseFloat(taxRate),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            vendorTotal: parseFloat(VenDorTotal.toFixed(2)),
            isDelivery: toBool(offerDelivery),
            DeliveryCharges: parseFloat(deliveryFee),
            backendStatus: toBool(offerDelivery),
            orderStatus: "OPEN",
            items: [
              {
                itemName,
                itemTaxRate,
                quantity: parseInt(quantityItem),
                instructions: instruction,
                itemOptions: signleOption,
                itemPrice: itemPrice,
                itemSubTotal: parseFloat(itemTotalAmount),
                itemTaxAmount: parseFloat(taxAmountPerItem.toFixed(2)),
                totalPrice: parseFloat(fullPrice.toFixed(2)),
                images: url,
                id,
              },
            ],
          },
        ],
      });
    } else {
      if (vendorExist(vendorId)) {
        let temp2 = temp[0].vendorsItems;
        let itemTotalAmount = (
          parseFloat(itemPrice) + parseFloat(optionPrice)
        ).toFixed(2);
        let taxAmountPerItem =
          parseFloat(
            parseFloat(itemTaxRate) *
              (parseFloat(itemPrice) + parseFloat(optionPrice))
          ) / 100;
        let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
        let taxAmount = parseFloat(
          parseFloat(taxAmountPerItem * quantityItem) + parseFloat(grandTax)
        );
        let VenDorTotal = parseFloat(subTotal + taxAmount);
        let fullPrice = parseFloat(
          parseFloat(itemTotalAmount) + parseFloat(taxAmountPerItem)
        );
        for (let i = 0; i < temp2.length; i++) {
          const element = temp2[i];
          let Id = element.vendorId;
          if (Id == vendorId) {
            element.vendorSubTotal = parseFloat(subTotal.toFixed(2));
            element.taxAmount = parseFloat(taxAmount.toFixed(2));
            element.vendorTotal = parseFloat(VenDorTotal.toFixed(2));
            element.items.push({
              itemName,
              itemTaxRate,
              quantity: parseInt(quantityItem),
              instructions: instruction,
              itemOptions: signleOption,
              itemPrice: itemPrice,
              itemSubTotal: parseFloat(itemTotalAmount),
              itemTaxAmount: parseFloat(taxAmountPerItem.toFixed(2)),
              totalPrice: parseFloat(fullPrice.toFixed(2)),
              images: url,
              id,
            });
          }
        }
      } else if (!vendorExist(vendorId)) {
        grandTotal = 0;
        let itemTotalAmount = (
          parseFloat(itemPrice) + parseFloat(optionPrice)
        ).toFixed(2);

        let taxAmountPerItem =
          parseFloat(
            parseFloat(itemTaxRate) *
              (parseFloat(itemPrice) + parseFloat(optionPrice))
          ) / 100;
        let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
        let taxAmount = parseFloat(taxAmountPerItem * quantityItem);
        let VenDorTotal = parseFloat(subTotal + taxAmount);
        let fullPrice = parseFloat(
          parseFloat(itemTotalAmount) + parseFloat(taxAmountPerItem)
        );
        temp[0].vendorsItems.push({
          vendorId: vendorId,
          vendorName,
          vendorSubTotal: parseFloat(subTotal.toFixed(2)),
          taxRate: parseFloat(taxRate),
          taxAmount: parseFloat(taxAmount.toFixed(2)),
          vendorTotal: parseFloat(VenDorTotal.toFixed(2)),
          isDelivery: toBool(offerDelivery),
          backendStatus: toBool(offerDelivery),
          DeliveryCharges: parseFloat(deliveryFee),
          orderStatus: "OPEN",
          items: [
            {
              itemName,
              itemTaxRate,
              quantity: parseInt(quantityItem),
              instructions: instruction,
              itemOptions: signleOption,
              itemPrice: itemPrice,
              itemSubTotal: parseFloat(itemTotalAmount),
              itemTaxAmount: parseFloat(taxAmountPerItem.toFixed(2)),
              totalPrice: parseFloat(fullPrice.toFixed(2)),
              images: url,
              id,
            },
          ],
        });
      }
    }
    setOrderList(temp);
    console.log(temp);
    saveData(keys.orderList, JSON.stringify(temp));
    setSingleOptions([]);
  };
  const vendorExist = (vendorId) => {
    for (let i = 0; i < OrderList.length; i++) {
      const element = OrderList[i];
      for (let j = 0; j < element.vendorsItems.length; j++) {
        const elem = element.vendorsItems[j];
        if (elem.vendorId == vendorId) {
          return true;
        }
      }
    }
    return false;
  };

  const productExistCalculations = (
    vendorId,
    quantity,
    itemPrice,
    taxRate,
    newPrice,
    id,
    optionPrice,
    increase
  ) => {
    let temp = [...OrderList];
    if (vendorExist(vendorId)) {
      let temp2 = temp[0].vendorsItems;
      for (let i = 0; i < temp2.length; i++) {
        const element = temp2[i];
        if (element.vendorId == vendorId) {
          let items = element.items;
          if (increase) {
            let newSubtotal = element.vendorSubTotal + optionPrice + itemPrice;
            element.vendorSubTotal = parseFloat(newSubtotal.toFixed(2));
            let TaxAmount =
              parseFloat(
                parseFloat(taxRate) *
                  (parseFloat(itemPrice) + parseFloat(optionPrice))
              ) / 100;
            let taxLog = element.taxAmount + TaxAmount;
            element.taxAmount = parseFloat(taxLog.toFixed(2));
            let newTotal = element.taxAmount + element.vendorSubTotal;
            element.vendorTotal = parseFloat(newTotal.toFixed(2));
          } else {
            let decSubTotal =
              element.vendorSubTotal - (optionPrice + itemPrice);
            element.vendorSubTotal = parseFloat(decSubTotal.toFixed(2));

            let TaxAmount =
              parseFloat(
                parseFloat(taxRate) *
                  (parseFloat(itemPrice) + parseFloat(optionPrice))
              ) / 100;

            let decTax = element.taxAmount - TaxAmount;
            element.taxAmount = parseFloat(decTax.toFixed(2));
            let decTotal = element.taxAmount + element.vendorSubTotal;
            element.vendorTotal = parseFloat(decTotal.toFixed(2));
          }

          items.forEach((element, index) => {
            if (element.id == id) {
              element.quantity = quantity;
            }
          });
        }
      }
    }
    setOrderList(temp);
    saveData(keys.orderList, JSON.stringify(temp));
  };

  const calculateOptionsPrice = (array) => {
    let optionsPrice = 0;
    array.forEach((optionObject) => {
      let slectedOptions = optionObject.selectedOptions;
      slectedOptions.forEach((sOption) => {
        optionsPrice += parseFloat(sOption.price);
      });
    });
    return optionsPrice;
  };
  const venDorSubTotalCalculations = (temp, vId) => {
    let gTotal = 0;
    temp.forEach((tempElement) => {
      let vendorItem = tempElement.vendorsItems;
      vendorItem.forEach((itemElement) => {
        if (itemElement.vendorId == vId) {
          let itemArray = itemElement.items;
          itemArray.forEach((itemArrayElement) => {
            gTotal += itemArrayElement.itemSubTotal * itemArrayElement.quantity;
          });
        }
      });
    });
    return gTotal;
  };
  const UpdateProduct = (
    vendorId,
    pid,
    signleOption,
    instruction,
    modelTotalPrice
  ) => {
    let temp = [...OrderList];
    let optionTotal = calculateOptionsPrice(signleOption);

    temp.forEach((tempList, i) => {
      let vendorItem = tempList.vendorsItems;
      vendorItem.forEach((vItem, j) => {
        if (vItem.vendorId == vendorId) {
          let itemArray = vItem.items;
          itemArray.forEach((itemObject, k) => {
            if (itemObject.id == pid) {
              itemObject.itemOptions = signleOption;
              itemObject.instructions = instruction;
              let sub = itemObject.itemPrice + optionTotal;
              itemObject.itemSubTotal = parseFloat(sub.toFixed(2));
              let updateTax =
                ((itemObject.itemPrice + optionTotal) *
                  itemObject.itemTaxRate) /
                100;
              itemObject.itemTaxAmount = parseFloat(updateTax.toFixed(2));
              let updatePrice =
                itemObject.itemSubTotal + itemObject.itemTaxAmount;
              itemObject.totalPrice = parseFloat(updatePrice.toFixed(2));
              let subtotalVendor = venDorSubTotalCalculations(temp, vendorId);
              vItem.vendorSubTotal = parseFloat(subtotalVendor.toFixed(2));
              let oldTax = (modelTotalPrice * itemObject.itemTaxRate) / 100;
              vItem.taxAmount = Math.abs(vItem.taxAmount - oldTax);
              let taxamount = vItem.taxAmount + itemObject.itemTaxAmount;
              vItem.taxAmount = parseFloat(taxamount.toFixed(2));
              let updateTotal = vItem.taxAmount + subtotalVendor;
              vItem.vendorTotal = parseFloat(updateTotal.toFixed(2));
            }
          });
        }
      });
    });
    setOrderList(temp);
    saveData(keys.orderList, JSON.stringify(temp));
    setSingleOptions([]);
  };

  window.onpopstate = () => {
    document.body.style.overflow = "";
  };

  return (
    <ApplicationContext.Provider
      value={{
        orderReviewId,
        setOrderReviwewId,
        UpdateProduct,
        cartImgUrl,
        setcartImgUrl,
        carCount,
        setcartCount,
        productExistCalculations,
        addNewOrder,
        sections,
        setSections,
        catId,
        setCatId,
        vendor,
        setVendor,
        vendorId,
        setVendorId,
        itemName,
        setItemName,
        options,
        setItemOptions,
        addons,
        setAddons,
        quantityItem,
        setQuantityItem,
        object,
        setObjects,
        edit,
        setEdit,
        productId,
        setProductId,
        catName,
        setCatName,
        productList,
        setProductsList,
        itemId,
        setItemId,
        deletItem,
        vendorItems,
        setVendorItems,
        userLocationFields,
        setUserLocationFields,
        primaryColor,
        setPrimaryColor,
        signleOption,
        setSingleOptions,
        OrderList,
        setOrderList,
        grandTaxTotal,
        setgrandTaxTotal,
        grandSubTotal,
        setgrandSubTotal,
        totalDeliveryCharges,
        settotalDeliveryCharges,
        total,
        setTotal,
        userName,
        setUserName,
        userContact,
        setUserContact,
        userEmail,
        setUserEmail,
        rowNumber,
        setRowNumber,
        seatNumber,
        setSeatNumber,
        isDelete,
        setisDelete,
        instruction,
        seInstructions,
        deliveryCharges,
        setdeliveryCharges,
        userLastName,
        setUserLastName,
        rout,
        setRout,
        itemTaxRate,
        setItemTaxRate,
        modelTotalPrice,
        setModelTotalPrice,
        user,
        setUser,
        checkIn,
        setCheckIn,
        redeemData,
        setRedeemData,
        phoneNumber,
        setPhoneNumber,
        vendorOrderId,
        setVendorOrderId,
        phoneNumberwithOutCountryCode,
        setPhoneNumberwithOutCountryCode,
        signupCheckout,
        setSignupCheckout,
        guestCheckout,
        setGuestCheckout,
        venues,
        setVenues,
        isVisited,
        setIsVisited,
        rewardsData,
        setRewardsData,
        historyRewardsData,
        setHistoryRewardsData,
        profileCoin,
        setProfileCoin,
        discountAmount,
        setDiscountAmount,
        resetCode,
        setResetCode,
        password,
        setPassword,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path={name.home} exact component={HomeScreen} />
          <Route path={name.vanodr} exact component={VendorDetails} />
          <Route path={name.product} exact component={ProductCatagory} />
          <Route path={name.cart} exact component={CartScreen} />
          <Route path={name.checkout} exact component={CheckOutScreen} />
          <Route path={name.orderReview} exact component={OrderReview} />
          <Route path={name.account} exact component={AccountScreen}></Route>
          <Route path={name.profile} exact component={ProfileScreen}></Route>
          <Route path={name.userOrders} exact component={UserOrders}></Route>
          <Route path={name.orderDetails} exact component={OrderDetails} />
          <Route path={name.rewards} exact component={RewardsScreen} />
          <Route path={name.contests} exact component={ContestScreen} />
          <Route path={name.automaticVenue} exact component={AutomaticVenue} />
          <Route path={name.manualVenue} exact component={ManualVenue} />
        </Switch>
      </BrowserRouter>
    </ApplicationContext.Provider>
  );
};
