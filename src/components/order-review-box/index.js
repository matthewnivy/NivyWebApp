import React, { useEffect, useState } from "react";
import "./style.scss";
import { allStrings } from "../../commons/constants";
import { OptionsDept } from "./options";

export const OrderReviewBox = ({ name, option, quantity, price, img }) => {
  const [names, setNames] = useState([]);
  const [addons, setAddon] = useState([]);

  useEffect(() => {
    // console.log(option);
    let temp = [];
    let temp2 = [];
    for (let i = 0; i < option.length; i++) {
      let ele = option[i].selectedOptions;
      for (let j = 0; j < ele.length; j++) {
        if (option[i].optionSelections == "Single") {
          // temp = [...temp, ele[j].optionChoiceName];
          temp.push({
            catagoryName: option[i].optionName,
            selectionOption: option[i].selectedOptions,
          });
        } else {
          temp2 = [...temp2, ele[j].optionChoiceName];
        }
      }
    }
    console.log(temp);
    setNames(temp);
    setAddon(temp2);
  }, []);

  return (
    <div>
      <div className={"BoxContainers"}>
        <div className={"ImageContainer"}>
          <img src={img[0]} width={70} height={70} />
        </div>
        <div className={"InsideBox"}>
          <p className={"nameOne"}>{name}</p>
          <div className="subone">
            <span className={"CatName"}> {allStrings.options}</span>
            <div className="optionDpt">
              {names.map((item) => (
                <OptionsDept
                  catName={item.catagoryName}
                  optionArray={item.selectionOption}
                />
              ))}
            </div>
          </div>

          <div className={"subOne"}>
            <span className={"opt1"}>{allStrings.addons}</span>
            {addons.map((item) => (
              <span className={"d"}>{item}</span>
            ))}
          </div>
          <div className={"subOne"}>
            <span className={"opt1"}>{allStrings.quantity}</span>
            <span className={"d"}>{quantity}</span>
          </div>
        </div>
        <div className={"PriceBox"}>
          <p className={"pricing"}>{"$" + price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
