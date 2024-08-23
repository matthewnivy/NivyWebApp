import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage/index";
import { useContext, useRef, useState } from "react";
import "./style.scss";

function Tabs({ leftString, rightString, children }) {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);
  setPrimaryColor(getData(keys.primaryColor));

  const leftBar = useRef();
  const rightBar = useRef();

  const [leftTabSelected, setLeftTabSelected] = useState(true);

  const toggleActive = (enable, disable) => {
    enable.classList.add("active-bar");
    disable.classList.remove("active-bar");
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("title")) {
      const leftTab = e.target.classList.contains("left");
      leftTab
        ? toggleActive(leftBar.current, rightBar.current)
        : toggleActive(rightBar.current, leftBar.current);

      setLeftTabSelected(leftTab);
    }
  };

  return (
    <div className="tabs">
      <div className="listTitle" onClick={handleClick}>
        <span className="title left">
          {leftString}
          <div className="bar active-bar" ref={leftBar}></div>
        </span>
        <span
          className="title right"
          style={{ borderBottomColor: `#${primaryColor}` }}
        >
          {rightString}
          <div className="bar" ref={rightBar}></div>
        </span>
      </div>

      {leftTabSelected ? children[0] : children[1]}
    </div>
  );
}

export default Tabs;
