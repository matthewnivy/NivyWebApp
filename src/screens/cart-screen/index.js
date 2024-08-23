import React, { useState, useContext, useEffect, useCallback } from "react";
import { CartDepartment } from "../../components/index";
import "./style.scss";
import { Mainheader, SideBar } from "../../components/index";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { name } from "../../commons/routes/routesName/index";
import ApplicationContext from "../../utills/context-api/context";
import Modal from "react-modal";
import { ModeScreen } from "../index";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { allStrings, customStyle } from "../../commons";
import { getData, saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import { RiEditBoxFill } from "react-icons/ri";
import CustomModal from "../../components/modal/Modal";
import {
  isUserLoggedIn,
  JSONToObject,
  ObjectToJSON,
} from "../../utills/helpers/AuthHelper";
import ReactLoading from "react-loading";
import {
  inputOrder,
  stripeDevelopmentKey,
} from "../../utills/helpers/StripeHelper";
import UserLocation from "../../components/user-location";
import { getCustomerRewardHistoryList } from "../../utills/rest-apis/ApiHandeling";

export const CartScreen = () => {
  const [bar, setBar] = useState(false);
  const {
    setOrderList,
    primaryColor,
    setgrandTaxTotal,
    setgrandSubTotal,
    settotalDeliveryCharges,
    totalDeliveryCharges,
    setSingleOptions,
    signleOption,
    carCount,
    setTotal,
    total,
    UpdateProduct,
    setUserName,
    setUserContact,
    setUserEmail,
    grandSubTotal,
    grandTaxTotal,
    deletItem,
    setcartCount,
    instruction,
    deliveryCharges,
    setdeliveryCharges,
    setSeatNumber,
    setRowNumber,
    rowNumber,
    seatNumber,
    modelTotalPrice,
    discountAmount,
    setDiscountAmount,
    setHistoryRewardsData,
    setPrimaryColor,
  } = useContext(ApplicationContext);

  setPrimaryColor(getData(keys.primaryColor));
  const [arrays, setArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemPrice, setItemPrice] = useState();
  const [quantityItem, setQuantityItem] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(undefined);
  const [pid, setPid] = useState("");
  const [btnquantity, setbtnQuantity] = useState(0);
  const [currentVendor, setcurrentVendor] = useState();

  // material UI POPUP
  const [delid, setDelId] = useState();
  const [delname, setDelName] = useState();
  const [delprice, setDelPrice] = useState();
  const [deltTaxRate, setDelTaxRate] = useState();
  const [delVid, setDelVid] = useState();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url, setUrl] = useState("");
  const [isDeliveryCheck, setisDeliveryCheck] = useState(false);
  const [status, setStatus] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [error, setError] = useState(false);
  const [checkD, setCheckD] = useState(false);
  const [tempSeat, setTempSeat] = useState("");
  const [tempRow, setTempRow] = useState("");
  const [deleteAll, setDeletAll] = useState(false);
  const [popUpAddressHeading, setPopUpAddressHeading] = useState(
    allStrings.Address
  );
  const [seatInputOpen, setSeatInputOpen] = React.useState(false);

  //custom modal

  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState("login");
  const [loader, setLoader] = useState(false);

  const handleSeatInputOpen = () => {
    setSeatInputOpen(true);
  };

  const handleSeatInputClose = () => {
    setSeatInputOpen(false);
  };

  let urlParam = JSON.parse(getData(keys.urlParameters));
  const handleClickOpen = () => {
    setOpenPopUp(true);
  };

  const handleClose = () => {
    setOpenPopUp(false);
  };
  const Agree = () => {
    deletItem(delid, delprice, deltTaxRate, delVid, checkD);
    setOpenPopUp(false);
  };

  const handleDeleteAll = () => {
    setDeletAll(true);
  };
  const handleDeleteClose = () => {
    setDeletAll(false);
  };
  const AgreeDeleteAll = () => {
    saveData(keys.orderList, JSON.stringify([]));
    setdeliveryCharges(0);
    setDeletAll(false);
    setcartCount(0);
  };

  const updateSeatInfo = () => {
    var section = document.getElementById("section-input").value;
    var row = document.getElementById("row-input").value;
    var seat = document.getElementById("seat-input").value;
    if (
      !Number.isInteger(parseInt(row)) ||
      !Number.isInteger(parseInt(seat)) ||
      !Number.isInteger(parseInt(section))
    ) {
      return;
    }
    saveData(
      keys.urlParameters,
      `{"venueId":"${urlParam["venueId"]}","row":"${row}","seat":"${seat}","section":"${section}"}`
    );
    saveData(keys.userSection, `${section}`);
    saveData(keys.vedorSection, `${section}`);
    updateText(section, row, seat);
    handleSeatInputClose();
    if (isDeliveryCheck) {
      if (
        Number.isInteger(parseInt(row)) &&
        Number.isInteger(parseInt(seat)) &&
        Number.isInteger(parseInt(section))
      ) {
        setisDeliveryCheck(false);
      } else {
        setisDeliveryCheck(true);
      }
    }
  };

  const updateText = (section, row, seat) => {
    document.getElementById("section-text").innerHTML = `Section: ${section}`;
    document.getElementById("row-text").innerHTML = `Row: ${row}`;
    document.getElementById("seat-text").innerHTML = `Seat: ${seat}`;
  };

  //opening the popup for user to enter data(seat or row number)
  const Opendelivery = () => {
    if (urlParam.row !== "" && urlParam.seat !== "") {
      setRowNumber(tempRow);
      setSeatNumber(tempSeat);
    } else if (rowNumber === "" || seatNumber === "") {
      setPopUpAddressHeading(allStrings.Address);
      setisDeliveryCheck(true);
    }
  };

  const editDelivery = () => {
    if (urlParam.row === "" || urlParam.seat === "") {
      setPopUpAddressHeading(allStrings.editAddress);
      setisDeliveryCheck(true);
    }
  };

  const CloseDelivey = () => {
    setStatus(true);
    setisDeliveryCheck(false);
    if (urlParam.seat === "") {
      setSeatNumber(tempSeat);
      setRowNumber(tempRow);
    }
    if (urlParam.row === "") {
      setRowNumber(tempRow);
      setSeatNumber(tempSeat);
    }
  };
  const ErrorAlert = () => {
    setError(true);
  };

  const checkboxChangeHandler = (e, charges) => {
    let isAllCheckboxChecked = 0;
    if (!e) {
      isAllCheckboxChecked = totalDeliveryCharges - charges;
    } else {
      isAllCheckboxChecked = totalDeliveryCharges + charges;
    }
    if (isAllCheckboxChecked <= 0) {
      setSeatNumber("");
      setRowNumber("");
    }
  };

  useEffect(() => {
    setDiscountAmount(getData(keys.discountAmount) ?? 0);
  }, [discountAmount]);

  useEffect(() => {
    let x =
      parseFloat(getData(keys.subtotal) ?? 0) +
      parseFloat(getData(keys.grandTax) ?? 0) -
      parseFloat(getData(keys.discountAmount) ?? 0);
    if (x <= 0) x = 0;
    setTotal(x);
    saveData(keys.TotalAmount, x);
  }, [total, getData(keys.TotalAmount)]);

  useEffect(() => {
    setRowNumber("");
    setSeatNumber("");
    if (urlParam.row !== undefined) {
      setTempRow(urlParam.row);
    }
    if (urlParam.seat !== undefined) {
      setTempSeat(urlParam.seat);
    }
  }, []);

  useEffect(() => {
    setUserName("");
    setUserContact("");
    setUserEmail("");
    if (carCount == 0) {
      setRowNumber("");
      setSeatNumber("");
    }

    if (getData(keys.orderList)) {
      let List = JSON.parse(getData(keys.orderList));
      if (List) {
        if (List.length != 0) {
          setArray(List[0].vendorsItems);
          console.log(List[0].vendorsItems);
        } else {
          setArray([]);
        }
      }

      let sumTax = 0;
      let subTotal = 0;
      let totaldelivery = 0;
      let totalQuantity = 0;
      let temp = [...List];
      for (let i = 0; i < temp.length; i++) {
        let element = temp[i].vendorsItems;
        for (let j = 0; j < element.length; j++) {
          sumTax = sumTax + element[j].taxAmount;
          subTotal = subTotal + element[j].vendorSubTotal;
          totaldelivery = deliveryCharges;
        }
      }
      for (let i = 0; i < temp.length; i++) {
        let element = temp[i].vendorsItems;
        for (let j = 0; j < element.length; j++) {
          let elem = element[j].items;
          elem.forEach((element) => {
            totalQuantity = totalQuantity + element.quantity;
          });
        }
      }
      setgrandTaxTotal(parseFloat(sumTax));
      setgrandSubTotal(parseFloat(subTotal) + deliveryCharges);
      settotalDeliveryCharges(parseFloat(totaldelivery));
      setTotal(
        parseFloat(
          sumTax + subTotal + totaldelivery - discountAmount
            ? sumTax + subTotal + totaldelivery - discountAmount
            : 0
        )
      );
      console.log("total amount", sumTax);
      setcartCount(totalQuantity);
      saveData(keys.cartCount, totalQuantity);
      saveData(
        keys.TotalAmount,
        parseFloat(
          sumTax + subTotal + totaldelivery - discountAmount > 0
            ? sumTax + subTotal + totaldelivery - discountAmount
            : 0
        )
      );
      saveData(keys.grandTax, parseFloat(sumTax));
      saveData(keys.subtotal, parseFloat(subTotal) + deliveryCharges);
      saveData(keys.delivery, parseFloat(totaldelivery));
      setOrderList(temp);
    }
  }, [
    deleteAll,
    error,
    btnquantity,
    carCount,
    deliveryCharges,
    open,
    openPopUp,
  ]);

  var scrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };
  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);
  const preventDefaultKeys = useCallback((event) => {
    if (scrollKeys[event.keyCode]) {
      event.preventDefault();
      return false;
    }
  }, []);

  function disableMainBody() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultKeys, false);
    document
      .getElementsByClassName("header")[0]
      .classList.add("disable-interactions");
    if (document.getElementsByClassName("emptyCart")[0])
      document
        .getElementsByClassName("emptyCart")[0]
        .classList.add("disable-interactions");

    if (document.getElementsByClassName("section")[0])
      document
        .getElementsByClassName("section")[0]
        .classList.add("disable-interactions");
  }

  function enableMainBody() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.removeEventListener("keydown", preventDefaultKeys, false);
    document
      .getElementsByClassName("header")[0]
      .classList.remove("disable-interactions");
    if (document.getElementsByClassName("emptyCart")[0])
      document
        .getElementsByClassName("emptyCart")[0]
        .classList.remove("disable-interactions");

    if (document.getElementsByClassName("section")[0])
      document
        .getElementsByClassName("section")[0]
        .classList.remove("disable-interactions");
  }

  const check = () => {
    if (bar == false) {
      setBar(true);
      disableMainBody();
    } else {
      setBar(false);
      enableMainBody();
    }
  };

  const allCheck = () => {
    if (bar == true) {
      setBar(false);
      enableMainBody();
      return;
    } else {
      return;
    }
  };

  // filter the cart list  on click the cross button
  const toggleModeOpen = (e) => {
    setOpen(!open);
    if (open) {
      document.body.style.margin = "";
      document.body.style.overflow = "";
      document.body.style.overflow = "auto";
    } else {
      var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.style.overflow = "hidden";
      document.body.style.margin = "0px " + scrollBarWidth + "px 0px 0px";
    }
    setcurrentVendor(e);
    setSingleOptions([]);
  };

  // update the object with new detaisl ,
  const toggleModeClose = () => {
    console.log("Current Price :", modelTotalPrice);
    var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0px " + scrollBarWidth + "px 0px 0px";
    UpdateProduct(
      currentVendor,
      pid,
      signleOption,
      instruction,
      modelTotalPrice
    );
    setOpen(!open);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (isUserLoggedIn()) {
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

      setLoader(true);
      let content = await inputOrder(
        total,
        grandTaxTotal,
        grandSubTotal,
        totalDeliveryCharges
      );
      setLoader(false);

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
      }, 4000);
      (await stripeDevelopmentKey).redirectToCheckout({ sessionId: content }); // redirecting to checkout
    } else setModal(true);
  };

  const getCustomerRewardHistoryListApiHandler = async () => {
    let venueId = getData(keys.venueId);
    let response = await getCustomerRewardHistoryList(venueId);
    if (response.success) {
      setHistoryRewardsData(response.content);
    }
  };
  useEffect(() => {
    setLoader(true);
    isUserLoggedIn() && getCustomerRewardHistoryListApiHandler();
    setLoader(false);
  }, []);
  return (
    <>
      <div onClick={() => allCheck()} className={bar ? "blur" : null}>
        <div className={"upperheader"}>
          <Mainheader home show={() => check()} mainText={"WebApp"} />
        </div>
        <div className={"side"}>
          <SideBar
            show={() => check()}
            hide={bar}
            openModal={setModal}
          />
        </div>
        <div className="seat-cart-div">
          <div id="seat-info-div">
            <UserLocation />
          </div>
        </div>
        {console.log(arrays, "arrays")}
        {arrays.length > 0 ? (
          <section className={"section"}>
            {arrays.map((item) => {
              return (
                <div>
                  <CartDepartment
                    arrays={item.items}
                    catagoryName={item.vendorName}
                    PID={(val) => setPid(val)}
                    updatePopUpClosed={open}
                    modelOpen={(e, product) => {
                      setSelectedOptions(product.itemOptions);
                      toggleModeOpen(e);
                    }}
                    orderReview={true}
                    deliveryCharg={item.DeliveryCharges}
                    isDeliveryBackend={item.backendStatus}
                    vendorTotal={item.vendorSubTotal}
                    tax={item.taxRate}
                    deliveryStatus={item.isDelivery}
                    Buttonquantity={(val) => setbtnQuantity(val)}
                    vId={item.vendorId}
                    setdeliveryCharges={setdeliveryCharges}
                    deliveryCharges={deliveryCharges}
                    popUp={() => handleClickOpen()}
                    dID={(val) => setDelId(val)}
                    dNAME={(val) => setDelName(val)}
                    dPrice={(val) => setDelPrice(val)}
                    dTax={(val) => setDelTaxRate(val)}
                    delvendroId={(val) => setDelVid(val)}
                    popOpen={openPopUp}
                    setUrl={(val) => setUrl(val)}
                    address={(val) => setAddAddress(val)}
                    setCheckD={(val) => setCheckD(val)}
                    clickOpenHandler={Opendelivery}
                    onCheckBoxChange={(e, charges) =>
                      checkboxChangeHandler(e, charges)
                    }
                  />
                </div>
              );
            })}
          </section>
        ) : null}
        {carCount == 0 ? (
          <div className={"emptyCart"}> {allStrings.empty} </div>
        ) : null}

        <div className={bar ? "bottomButtonNew" : "bottomButton"}>
          <div className="TotalAmountCont">
            <p className="totalText">{allStrings.subtotal} </p>
            <p className="totalText">
              {"$" + Math.abs(grandSubTotal).toFixed(2)}
            </p>
          </div>
          <div className="TotalAmountCont">
            <p className="totalText">{allStrings.Tax} </p>
            <p className="totalText">
              {"$" + Math.abs(grandTaxTotal).toFixed(2)}
            </p>
          </div>

          <div className="TotalAmountCont">
            <p className="totalText">{allStrings.discount} </p>
            <p className="totalText">
              {"$" + Math.abs(discountAmount).toFixed(2)}
            </p>
          </div>

          <div className="TotalAmountCont">
            <p className="totalText">{allStrings.GrandTotal} </p>
            <p className="totalText">
              {"$" + (total.toFixed(2) > 0)
                ? `$${parseFloat(total).toFixed(2)}`
                : "0.0"}
            </p>
          </div>
          {addAddress == true && (seatNumber == "" || rowNumber == "") ? (
            <button
              style={
                carCount !== 0
                  ? { backgroundColor: `#${primaryColor}` }
                  : { backgroundColor: `#808080` }
              }
              className={"btn"}
              onClick={(e) => {
                if (addAddress) {
                  if (seatNumber == "" || rowNumber == "") {
                    ErrorAlert();
                  }
                }
              }}
            >
              {allStrings.checkoutText}
              <BsArrowRight style={{ marginLeft: "5px" }} size={20} />
            </button>
          ) : (
            <button
              style={
                carCount !== 0
                  ? { backgroundColor: `#${primaryColor}` }
                  : { backgroundColor: `#808080` }
              }
              className={"btn"}
              disabled={carCount == 0 ? true : false}
              onClick={handleCheckout}
            >
              {allStrings.checkoutText}
              <BsArrowRight style={{ marginLeft: "5px" }} size={20} />
            </button>
          )}
        </div>
        <Modal
          style={customStyle}
          overlayClassName="overlayStyles"
          isOpen={open}
          onRequestClose={() => toggleModeOpen()}
        >
          <ModeScreen
            cross={() => toggleModeOpen()}
            itemPrice={setItemPrice}
            close={() => toggleModeClose()}
            selectQuantity={(val) => setQuantityItem(val)}
            currentVendor={currentVendor}
            selectedOptions={selectedOptions}
            prductID={pid}
            imageUrl={url}
          />
        </Modal>

        {modal ? (
          <CustomModal
            openModal={setModal}
            changeModalScreen={setModalScreen}
            modalScreen={modalScreen}
            checkoutForm={"1"}
          ></CustomModal>
        ) : null}
        {
          <div>
            <Dialog
              open={openPopUp}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Do you want to remove {delname} from your cart?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  NO
                </Button>
                <Button onClick={Agree} color="primary">
                  YES
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
        {
          <Dialog
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={seatInputOpen || isDeliveryCheck}
            onClose={handleSeatInputClose}
          >
            <div className="seat-input-holder">
              <h2 id="seat-input-header" class="seat-input-text">
                Enter Seat Information
              </h2>
              <p class="seat-input-text alert">Oh no! You messed up!!!</p>
              <div className="seat-input-item">
                <p class="seat-input-text">Section: </p>
                <input
                  id="section-input"
                  className="seat-item-input"
                  type="number"
                />
              </div>
              <div className="seat-input-item">
                <p class="seat-input-text">Row: </p>
                <input
                  id="row-input"
                  className="seat-item-input"
                  type="number"
                />
              </div>
              <div className="seat-input-item">
                <p class="seat-input-text">Seat: </p>
                <input
                  id="seat-input"
                  className="seat-item-input"
                  type="number"
                />
              </div>
              <input
                id="submit-seat"
                type="submit"
                onClick={() => updateSeatInfo()}
                value="Enter Information"
              />
            </div>
          </Dialog>
        }
        {
          <Dialog
            open={error}
            keepMounted
            onClose={ErrorAlert}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
          >
            <center>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {allStrings.submitAddressText}
                </DialogContentText>
              </DialogContent>
            </center>
            <DialogActions>
              <Button onClick={() => setError(false)} color="primary">
                {allStrings.okay}
              </Button>
            </DialogActions>
          </Dialog>
        }
        {
          <div>
            <Dialog
              open={deleteAll}
              keepMounted
              onClose={handleDeleteClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {allStrings.deletAll}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteClose} color="primary">
                  {allStrings.no}
                </Button>
                <Button onClick={AgreeDeleteAll} color="primary">
                  {allStrings.yes}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
      </div>

      {loader ? (
        <div className={"want_end"}>
          <ReactLoading
            type={"spin"}
            color={"#d3d3d3"}
            height={"20%"}
            width={"20%"}
          />
        </div>
      ) : null}
    </>
  );
};
