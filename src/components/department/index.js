import React from "react";
import { allStrings } from "../../commons/index";
import "./style.scss";
import { Product } from "../index";

export const Department = ({ arrays, catName, toggle, setImageUrl }) => {
  return (
    <>
      {arrays.length != 0 ? <p className={"sectionName"}>{catName}</p> : null}
      {arrays.length != 0
        ? arrays.map((item) => (
            <Product
              outOfstock={item.outOfStock}
              productPrice={item.price}
              productName={item.name}
              imgUrl={item.images}
              show={toggle}
              setImageUrl={setImageUrl}
            />
          ))
        : null}
    </>
  );
};
