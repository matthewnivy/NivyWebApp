import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineHome } from "react-icons/ai";
import "./style.scss";
import homeicon from "../../utills/home.png";
import ApplicationContext from "../../utills/context-api/context";
import { Link } from "react-router-dom";
import { name } from "../../commons/routes/routesName";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";

// <img className={"home"} src={homeicon} /> is now replaced with AiOutlineHome on line 22

export function Mainheader({ home, show, isVenueFinder }) {
  const primaryColor = getData(keys.primaryColor);

  return (
    <header>
      {!isVenueFinder ? (
	  <div style={{ backgroundColor: `#${primaryColor}` }} className={"header"}>
          <FaBars
            onClick={() => show()}
            color={"#FFF"}
            className={"iconstyle"}
          />
        {home ? (
          <Link to={name.home}>
            <AiOutlineHome id="home-icon" />
          </Link>
        ) : (
          <>
            <Link to={name.cart} className="cart">
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {getData(keys.cartCount) > 0 ? (
                  <div
                    className={"counter"}
                    style={{
                      color: `#FFFFFF`,
                      backgroundColor: `#${getData(keys.secondaryColor)}`,
                    }}
                  >
                    <p className="contStyle">{getData(keys.cartCount)}</p>
                  </div>
                ) : null}
			   <AiOutlineShoppingCart className={"shop"} color={"#FFF"} />
              </div>
            </Link>
          </>
        )}
      </div>
	  ): (
	  <div style={{ backgroundColor: `#${primaryColor}` }} className={"header"} />
	  )
	  }
    </header>
  );
}
