import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ApplicationContext from "../../../utills/context-api/context";
import { saveData } from "../../../utills/local-storage";
import { keys } from "../../../utills/local-storage/keys";
import "./style.scss";

export const SubOptions = ({ catagoryName, urls, productName }) => {
  const { setCatId } = useContext(ApplicationContext);

  const setCatagory = () => {
    console.log("saving category in local storage >>", catagoryName);
    saveData(keys.itemCat, catagoryName);
  };

  return (
    <>
      {catagoryName ? (
        <div className="linksOptions" onClick={() => setCatagory()}>
          <nav onClick={() => setCatId(catagoryName)}>
            <Link
              className="main-nav"
              to={{
                pathname: `${urls}`,
                state: {
                  name: productName,
                  catagoryId: catagoryName,
                },
              }}
            >
              <li>{productName}</li>
            </Link>
          </nav>
        </div>
      ) : (
        <a
          style={{ textDecoration: "none" }}
          className="linksOptions"
          rel={"external"}
          href={`http://${urls}`}
        >
          <li>{productName}</li>
        </a>
      )}
    </>
  );
};
