import { OrderReviewBox } from "../index";
import "./style.scss";

export const DeptBpx = ({ vendorName, Itemarray }) => {
  return (
    <div>
      <div>
        <ul className={"ulListOne"}>
          <li>{vendorName}</li>
        </ul>
      </div>
      {Itemarray.map((item) => (
        <div className={"insideContainer"}>
          <OrderReviewBox
            name={item.itemName}
            option={item.itemOptions}
            quantity={item.quantity}
            price={item.totalPrice}
            img={item.images}
          />
        </div>
      ))}
    </div>
  );
};
