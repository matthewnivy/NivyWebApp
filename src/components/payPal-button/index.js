import { useContext, useRef, useEffect, useState } from "react";
import { addnewOrder, UpdateOrder } from "../../utills/rest-apis/ApiHandeling";
import ApplicationContext from "../../utills/context-api/context";
import { Redirect } from "react-router-dom";
import { name } from "../../commons/routes/routesName";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";

export const PayPaylButton = ({ load }) => {
  const paypalRef = useRef();
  // const [rout, setRout] = useState(false);
  // const { rout, setRout } = useContext(ApplicationContext);

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
    setOrderList,
    setcartCount,
    rowNumber,
    seatNumber,
    rout,
    setRout,
  } = useContext(ApplicationContext);

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

  useEffect(() => {
    console.log(
      total,
      userName,
      userLastName,
      userContact,
      userEmail,
      // dateAndTime,
      OrderList[0].vendorsItems,
      parseFloat(grandTaxTotal.toFixed(2)),
      grandSubTotal,
      totalDeliveryCharges,
      // secName,
      // rowNumber,
      // seatNumber,
      getData(keys.venueId)
    );

    if (getData(keys.vedorSection) == "") {
      let id = getData(keys.userSection);
      saveData(keys.sectId, id);
    } else {
      let id = getData(keys.vedorSection);
      saveData(keys.sectId, id);
    }
    window.paypal
      .Buttons({
        onInit: function (data, actions) {},

        createOrder: async (data, actions) => {
          data = inputOrder();
          return data;
        },
        onApprove: async (data, actions) => {
          Update(data.orderID);
          setOrderList([]);
          saveData(keys.orderList, JSON.stringify([]));
          saveData(keys.cartCount, 0);
          setcartCount(0);
        },
        onError: (err) => {
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, []);
  const inputOrder = async () => {
    const secName = getData(keys.sectId);
    const Time = getTime();
    const date = getDate();
    let dateAndTime = date + " " + Time;
    let res = await addnewOrder(
      total.toFixed(2),
      userName,
      userLastName,
      userContact,
      userEmail,
      dateAndTime,
      OrderList[0].vendorsItems,
      parseFloat(grandTaxTotal.toFixed(2)),
      grandSubTotal,
      totalDeliveryCharges,
      secName,
      rowNumber,
      seatNumber,
      getData(keys.venueId)
    );
    console.log("Paypal Response ::: ", res);
    if (res.success) {
      return res.content;
    }
  };

  const Update = async (venueId) => {
    load(true);
    let res = await UpdateOrder(venueId);
    if (res.success) {
      saveData("OrderID", res.content);
      setRout(true);
      load(false);
      return res.content;
    } else {
      console.log("Wrong number");
    }
  };

  return (
    <div style={{ width: "90%" }}>
      <div ref={paypalRef}></div>
      {rout ? <Redirect to={name.orderReview} /> : null}
    </div>
  );
};
