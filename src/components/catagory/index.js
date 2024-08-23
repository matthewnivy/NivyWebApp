import { useContext, useEffect } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import ApplicationContext from "../../utills/context-api/context";
import { saveAs } from "file-saver";
import { saveData } from "../../utills/local-storage/index";
import { keys } from "../../utills/local-storage/keys";

export function Catagory({ catagoryName, productName, url }) {
  const { setCatId, primaryColor } = useContext(ApplicationContext);

  const setCatagory = () => {
    console.log("saving category in local storage >>", catagoryName);
    saveData(keys.itemCat, catagoryName);
    setCatId(catagoryName);
  };

  const Check = async (url) => {
    var val = url.slice(-3);
    console.log("Url :: ", url);
    // console.log("Url :: ", url);
    if (val == "pdf") {
      saveAs(`http://${url}`, "example.pdf");
    }
  };

  function ChildCategory() {
    return (
      <div
        style={{ borderColor: `#${primaryColor}` }}
        className={"main_boxOne"}
      >
        <div className={"catagoryName"}>
          {productName ? (
            <p className={"text"}>{productName}</p>
          ) : (
            <p className={"text"}>{url}</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div onClick={() => setCatagory()}>
      {catagoryName ? (
        <Link
          className={"catLink"}
          to={{
            // pathname: "/vendor",
            pathname: url,
            state: {
              name: productName,
              catagoryId: catagoryName,
            },
          }}
        >
          {ChildCategory()}
        </Link>
      ) : (
        <a
          style={{ textDecoration: "none" }}
          rel={"external"}
          //   target="_blank"
          href={`http://${url}`}
          onClick={() => Check(url)}
        >
          {ChildCategory()}
        </a>
      )}
    </div>
  );
}
