import React, { useState, useEffect, useContext } from "react";
import {
  Description,
  CheckBoxes,
  Choices,
  QuantityButton,
} from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";

import { fetchItemDetails } from "../../utills/rest-apis/ApiHandeling";
import { getData, saveData } from "../../utills/local-storage/index";
import ApplicationContext from "../../utills/context-api/context";
import { allStrings } from "../../commons/index";
import "./style.scss";
import Loader from "react-loader-spinner";
import { keys } from "../../utills/local-storage/keys";
import ReactLoading from "react-loading";

export function ModeScreen({
  close,
  itemPrice,
  cross,
  selectQuantity,
  imageUrl,
  currentVendor,
  selectedOptions,
  prductID,
}) {
  const [qunatity, setQuantity] = useState(true);
  const [items, setItems] = useState([]);
  const [description, setDiscription] = useState("");
  const [price, setPrice] = useState();
  const [itemCheck, setItemCheck] = useState(true);
  const [totalPrice, setTotapPrice] = useState(0.0);
  const [optionPrice, setOptionPrice] = useState(0);
  const [productName, setproductName] = useState("");
  const [quantity, setquantity] = useState(1);
  const [Options, setOptions] = useState([]);
  const [Addons, setAddons] = useState([]);
  const [inset, setInst] = useState("");
  const {
    object,
    itemName,
    setQuantityItem,
    edit,
    options,
    setCatName,
    primaryColor,
    signleOption,
    setSingleOptions,
    seInstructions,
    instruction,
    OrderList,

    setModelTotalPrice,
    setItemTaxRate,
  } = useContext(ApplicationContext);

  const [loading, setLoading] = useState(true);
  const [pid, setPid] = useState(prductID);
  let count = 0;
  useEffect(() => {
    console.log("vendor id   =  ", currentVendor);
    fetchData();
    setSingleOptions([]);
  }, []);

  const fetchData = async () => {
    if (pid) {
      for (let i = 0; i < OrderList[0].vendorsItems.length; i++) {
        const element = OrderList[0].vendorsItems[i].items;
        for (let k = 0; k < element.length; k++) {
          const elem = element[k];
          if (elem.id == pid) {
            setInst(elem.instructions);
            console.log("Subtotal ", elem.itemSubTotal);
            setModelTotalPrice(elem.itemSubTotal);
          }
        }
      }
    }

    let response = await fetchItemDetails(
      getData(keys.venueId),
      currentVendor,
      itemName
    );
    console.log("param 1 ::: ", getData(keys.venueId));
    console.log("param 2 ::: ", currentVendor);
    console.log("param 3 ::: ", itemName);
    if (response.success) {
      console.log(response.content);
      setItemTaxRate(response.content.taxRate);
      setItems(response.content.itemOptions);
      setDiscription(response.content.description);
      itemPrice(response.content.price);
      setPrice(response.content.price);
      setTotapPrice(response.content.price);
      setLoading(false);
      setproductName(response.content.name);
      setCatName(response.content.category);
      let sortingSingle = [];
      let sortingMultiple = [];
      if (response.content.itemOptions.length !== 0) {
        for (let i = 0; i < response.content.itemOptions.length; i++) {
          const element = response.content.itemOptions[i];
          if (
            element.optionSelections == "Single" ||
            element.optionSelections == "single"
          ) {
            sortingSingle.push({
              element,
              selectedOptions: [],
            });
          } else {
            sortingMultiple.push({
              element,
              selectedOptions: [],
            });
          }
        }
        if (selectedOptions) {
          for (let i = 0; i < sortingSingle.length; i++) {
            for (let j = 0; j < selectedOptions.length; j++) {
              if (
                sortingSingle[i].element.optionName ===
                selectedOptions[j].optionName
              ) {
                sortingSingle[i].element = {
                  ...sortingSingle[i].element,
                  selectedOptions: selectedOptions[j].selectedOptions,
                };
              }
            }
          }
          for (let i = 0; i < sortingMultiple.length; i++) {
            for (let j = 0; j < selectedOptions.length; j++) {
              if (
                sortingMultiple[i].element.optionName ===
                selectedOptions[j].optionName
              ) {
                sortingMultiple[i].element = {
                  ...sortingMultiple[i].element,
                  selectedOptions: selectedOptions[j].selectedOptions,
                };
              }
            }
          }
        }
        setOptions(sortingSingle);
        setAddons(sortingMultiple);
      }
    }
  };

  const [additionalPrice, setAdditionalPrice] = useState(0);

  const totalCal = (e) => {
    selectQuantity(e);
    setquantity(e);
    setTotapPrice(e * price);
  };

  useEffect(() => {
    let data = [];
    let priceT = 0;
    Options.forEach((optionItem) => {
      if (optionItem.selectedOptions) {
        let arr = [];
        for (let i = 0; i < optionItem.selectedOptions.length; i++) {
          if (optionItem.selectedOptions[i].selected) {
            arr.push({
              optionChoiceName: optionItem.selectedOptions[i].optionChoiceName,
              price: parseFloat(optionItem.selectedOptions[i].price),
            });
          }
        }
        data.push({
          optionName: optionItem.element.optionName,
          optionSelections: "Single",
          selectedOptions: arr,
        });
        optionItem.selectedOptions.forEach((selectedItem) => {
          if (selectedItem.selected) {
            priceT += parseFloat(selectedItem.price);
          }
        });
      }
    });
    Addons.forEach((addOnsItem) => {
      if (addOnsItem.selectedOptions) {
        let arr = [];
        for (let i = 0; i < addOnsItem.selectedOptions.length; i++) {
          if (addOnsItem.selectedOptions[i].selected) {
            arr.push({
              optionChoiceName: addOnsItem.selectedOptions[i].optionChoiceName,
              price: parseFloat(addOnsItem.selectedOptions[i].price),
            });
          }
        }
        data.push({
          optionName: addOnsItem.element.optionName,
          optionSelections: "Multiple",
          selectedOptions: arr,
        });
        addOnsItem.selectedOptions.forEach((selectedItem) => {
          if (selectedItem.selected) {
            priceT += parseFloat(selectedItem.price);
          }
        });
      }
    });
    setAdditionalPrice(priceT);
    setSingleOptions(data);
  }, [Options, Addons]);

  useEffect(() => {}, []);

  const updatePrice = (optionName, array) => {
    let temp = [...Options];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].element.optionName === optionName) {
        if (!temp[i].selectedOptions) {
          temp[i] = {
            ...temp[i],
            selectedOptions: [],
          };
        }
        for (let j = 0; j < array.length; j++) {
          if (array[j].selected === true) {
            let found = false;
            temp[i].selectedOptions.forEach((data) => {
              if (data.optionChoiceName === array[j].optionChoiceName) {
                found = true;
              }
            });
            if (!found) {
              temp[i].selectedOptions.push(array[j]);
            }
          }
        }
      }
    }
    setOptions(temp);
  };

  const updateAddOnPrice = (optionName, array) => {
    let temp = [...Addons];
    for (let i = 0; i < temp.length; i++) {
      temp[i] = {
        ...temp[i],
        selectedOptions: [],
      };
      for (let j = 0; j < array.length; j++) {
        if (temp[i].element.optionName === optionName) {
          let found = false;
          temp[i].selectedOptions.forEach((data) => {
            if (data.optionChoiceName === array[j].optionChoiceName) {
              found = true;
            }
          });
          if (!found) {
            if (array[j].selected) {
              temp[i].selectedOptions.push(array[j]);
            }
          }
        }
      }
    }
    setAddons(temp);
  };

  const increaseQuantity = () => {
    setquantity(parseInt(quantity) + 1);
    totalCal(quantity + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setquantity(quantity - 1);
      totalCal(quantity - 1);
    }
  };
  return (
    <>
      {loading ? (
        // <div className={"loader"}>
        //   <Loader type="Puff" color="#d3d3d3" height={100} width={100} />
        // </div>
        <div className={"want_end"}>
          <ReactLoading
            type={"spin"}
            color={"#d3d3d3"}
            height={"20%"}
            width={"20%"}
          />
          {/* <Loader type="Puff" color="#d3d3d3" height={100} width={100} /> */}
        </div>
      ) : (
        <div className="modal-inner">
          <div className={"iconContainer"}>
            <AiOutlineClose size={14} onClick={() => cross()} />
          </div>
          <div className={"descrptionContainer"}>
            <p className={"item_font"}>{productName}</p>
            <Description
              disciption={description}
              price={price}
              url={imageUrl}
            />
          </div>
          <br></br>
          <div>
            {Options.length != 0
              ? Options.map((item) => (
                  <Choices
                    nametype={item.element.optionName}
                    array={item.element.optionList}
                    nameGroup={item.element.optionName}
                    setOptionPrice={setOptionPrice}
                    selectedOptions={item.element.selectedOptions}
                    updatePrice={updatePrice}
                  />
                ))
              : null}
            {Addons.length != 0
              ? Addons.map((item) => (
                  <CheckBoxes
                    array={item.element.optionList}
                    optionName={item.element.optionName}
                    selectedOptions={item.element.selectedOptions}
                    updateAddOnPrice={updateAddOnPrice}
                  />
                ))
              : null}
          </div>
          <p className={"instruction"}>{allStrings.Special_Instructions}</p>
          <div className={"textareaContainer"}>
            <textarea
              className={"textAreaStyles"}
              style={{ borderColor: `#${primaryColor}` }}
              placeholder={allStrings.instruction}
              defaultValue={pid ? inset : null}
              onChange={(e) => seInstructions(e.target.value)}
            ></textarea>
          </div>
          <hr color={"#dcdcdc"} />
          <div className={"bottomContainers"}>
            <div>
              <p className={"containerTotalPrice"}>
                {"Total Price: $" +
                  (totalPrice + additionalPrice * quantity).toFixed(2)}
              </p>
            </div>
            <div className={"lastContainer"}>
              {edit == false ? (
                <div className="quantitybuttonContainer">
                  <QuantityButton
                    count={quantity}
                    onModalScreenButton
                    inc={() => increaseQuantity()}
                    dec={() => decreaseQuantity()}
                  />
                </div>
              ) : null}
              <button
                className={"btnStyleO"}
                onClick={() => close()}
                style={{ backgroundColor: `#${primaryColor}` }}
                disabled={itemCheck ? false : true}
              >
                {edit ? "Update cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
