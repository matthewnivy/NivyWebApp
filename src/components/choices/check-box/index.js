import React, { useState, useContext, useEffect } from "react";
import "./style.scss";

export function CheckBoxes({
  array,
  optionName,
  selectedOptions,
  updateAddOnPrice,
}) {
  const [data, setData] = useState(array);

  useEffect(() => {
    if (selectedOptions) {
      normalizedData();
    }
  }, []);

  const normalizedData = () => {
    let temp = [...data];
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < selectedOptions.length; j++) {
        if (!temp[i].selected) {
          temp[i].selected =
            temp[i].optionChoiceName === selectedOptions[j].optionChoiceName;
        }
      }
    }
    setData(temp);
    updateAddOnPrice(optionName, temp);
  };

  return (
    <div>
      <div>
        <p className="Addon">{optionName}</p>
      </div>
      {array.map((item, index) => (
        <div className={"mainContainer"}>
          <div className="Checkbox">
            <input
              type="checkbox"
              style={{
                borderColor: "#fff",
              }}
              disabled={item.outOfStock}
              checked={item.selected}
              onChange={(e) => {
                let temp = [...data];
                if (e.target.checked) {
                  for (let i = 0; i < temp.length; i++) {
                    if (i === index) {
                      temp[i].selected = true;
                    }
                  }
                } else {
                  for (let i = 0; i < temp.length; i++) {
                    if (i === index) {
                      temp[i].selected = false;
                    }
                  }
                }
                setData(temp);
                updateAddOnPrice(optionName, array);
              }}
            />
          </div>
          <div className="labeles">
            <label className={"lableStyle"}>{item.optionChoiceName}</label>
          </div>
          <div className="PriceContainer">
            <span className={"prices"}>{"$ " + item.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
