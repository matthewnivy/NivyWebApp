import React, { useState, useEffect } from "react";
import ApplicationContext from "./context";
import { saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";

const ContextProvider = ({ children }) => {
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
  //for primary color
  const [primaryColor, setPrimaryColor] = useState("000");
  const [OrderList, setOrderList] = useState([]);
  const [grandTaxTotal, setgrandTaxTotal] = useState(0);
  const [grandSubTotal, setgrandSubTotal] = useState(0);
  const [totalDeliveryCharges, settotalDeliveryCharges] = useState(0);
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("");
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

  //modal radeem data arryofobject
  const [redeemData, setRedeemData] = useState([]);

  //user login (not yet implement on server-side)
  const [user, setUser] = useState(false);

  //user checked-in
  const [checkIn, setCheckIn] = useState(false);

  //for user sign up
  const [phoneNumber, setPhoneNumber] = useState("");

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
  const deletItem = (productId, price, taxRate, vendorId) => {
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
              element.vendorSubTotal = subtotal - parseFloat(price);
              let TaxAmount = parseFloat((subtotal / 100) * taxRate);
              let VenDorTotal = subtotal + TaxAmount;
              element.taxAmount = TaxAmount;
              element.vendorTotal = VenDorTotal;
              setcartCount(carCount - 1);
            }
          });
          if (itemArray.length === 0) {
            elem.splice(i, 1);
            setdeliveryCharges(0);
          }
        }
      });
      if (elem.length === 0) {
        temp = [];
        setdeliveryCharges(0);
      }
    }
    setOrderList(temp);
  };

  let grandTotal = 0;
  let optionPrice = 0.0;
  // function for the cart list JSON...
  const addNewOrder = (
    vendorId,
    itemName,
    signleOption,
    itemPrice,
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
      if (string === "true") {
        return true;
      } else {
        return false;
      }
    }
    let temp = [...OrderList];

    for (let i = 0; i < temp.length; i++) {
      const vendorItem = temp[i].vendorsItems;
      for (let j = 0; j < vendorItem.length; j++) {
        const obj = vendorItem[j].items;
        for (let k = 0; k < obj.length; k++) {
          const element = obj;
          grandTotal = 0;
          for (let l = 0; l < element.length; l++) {
            const object = element[l];
            grandTotal += object.totalPrice * object.quantity;
          }
        }
      }
    }
    if (temp.length === 0) {
      let itemTotalAmount = (
        parseFloat(itemPrice) + parseFloat(optionPrice)
      ).toFixed(2);
      let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
      let taxAmount = parseFloat((subTotal / 100) * taxRate);
      let VenDorTotal = (subTotal + taxAmount).toFixed(2);
      temp.push({
        vendorsItems: [
          {
            vendorId: vendorId,
            vendorName,
            vendorSubTotal: subTotal,
            taxRate: parseFloat(taxRate),
            taxAmount: taxAmount,
            vendorTotal: parseFloat(VenDorTotal),
            isDelivery: toBool(offerDelivery),
            DeliveryCharges: parseFloat(deliveryFee),
            orderStatus: "OPEN",
            items: [
              {
                itemName,
                quantity: parseInt(quantityItem),
                instructions: instruction,
                itemOptions: signleOption,
                itemPrice: itemPrice,
                totalPrice: parseFloat(itemTotalAmount),
                images: url,
                id,
              },
            ],
          },
        ],
      });
    } else {
      if (vendorExist(vendorId)) {
        let itemTotalAmount = (
          parseFloat(itemPrice) + parseFloat(optionPrice)
        ).toFixed(2);
        let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
        let TaxAmount = parseFloat((subTotal / 100) * taxRate);
        let VenDorTotal = (subTotal + TaxAmount).toFixed(2);
        let temp2 = temp[0].vendorsItems;
        for (let i = 0; i < temp2.length; i++) {
          const element = temp2[i];
          let Id = element.vendorId;
          if (Id == vendorId) {
            element.vendorSubTotal = subTotal;
            element.taxAmount = TaxAmount;
            element.vendorTotal = parseFloat(VenDorTotal);
            element.items.push({
              itemName,
              quantity: parseInt(quantityItem),
              instructions: instruction,
              itemOptions: signleOption,
              itemPrice: itemPrice,
              totalPrice: parseFloat(itemTotalAmount),
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

        let subTotal = parseFloat(grandTotal + itemTotalAmount * quantityItem);
        let TaxAmount = parseFloat(
          ((grandTotal + itemPrice * quantityItem) / 100) * taxRate
        );
        let VenDorTotal = (subTotal + TaxAmount).toFixed(2);
        temp[0].vendorsItems.push({
          vendorId: vendorId,
          vendorName,
          vendorSubTotal: subTotal,
          taxRate: parseFloat(taxRate),
          taxAmount: TaxAmount,
          vendorTotal: parseFloat(VenDorTotal),
          isDelivery: toBool(offerDelivery),
          DeliveryCharges: parseFloat(deliveryFee),
          orderStatus: "OPEN",
          items: [
            {
              itemName,
              quantity: parseInt(quantityItem),
              instructions: instruction,
              itemOptions: signleOption,
              itemPrice: itemPrice,
              totalPrice: parseFloat(itemTotalAmount),
              images: url,
              id,
            },
          ],
        });
      }
    }

    setOrderList(temp);
    saveData(keys.orderList, JSON.stringify(OrderList));
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
            element.vendorSubTotal += optionPrice + itemPrice;
            let TaxAmount = parseFloat(
              (element.vendorSubTotal / 100) * taxRate
            );
            element.taxAmount = TaxAmount;
            element.vendorTotal = TaxAmount + element.vendorSubTotal;
          } else {
            element.vendorSubTotal -= optionPrice + itemPrice;
            let TaxAmount = parseFloat(
              (element.vendorSubTotal / 100) * taxRate
            );
            element.taxAmount = TaxAmount;
            element.vendorTotal = TaxAmount + element.vendorSubTotal;
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
            gTotal += itemArrayElement.totalPrice * itemArrayElement.quantity;
          });
        }
      });
    });
    return gTotal;
  };

  const UpdateProduct = (vendorId, pid, signleOption, instruction) => {
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
              itemObject.totalPrice = itemObject.itemPrice + optionTotal;
              let subtotalVendor = venDorSubTotalCalculations(temp, vendorId);
              vItem.vendorSubTotal = subtotalVendor;
              let TaxAmount = (subtotalVendor / 100) * vItem.taxRate;
              vItem.taxAmount = TaxAmount;
              vItem.vendorTotal = TaxAmount + subtotalVendor;
            }
          });
        }
      });
    });
    setOrderList(temp);
    setSingleOptions([]);
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
      {children}
    </ApplicationContext.Provider>
  );
};

export default ContextProvider;
