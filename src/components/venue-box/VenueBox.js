import { memo } from "react";
import { name } from "../../commons/routes/routesName";
import { firstLetterWord } from "../../utills/helpers/CapitalizeHelper";
import { saveData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import "./style.scss";

const VenueBox = ({ venueName, openModal, id }) => {
  const selectVenue = () => {
    openModal(false);
    saveData(keys.urlParameters, `{"venueId":"${id}"}`);
    window.location.href = name.home;
  };

  return (
    <div className="encapsulatingBox" onClick={selectVenue}>
      <div className="badge">
        <div className="badgeText">{firstLetterWord(venueName?.toUpperCase())}</div>
      </div>
      <div className="venue">{venueName}</div>
    </div>
  );
};

export default memo(VenueBox);
