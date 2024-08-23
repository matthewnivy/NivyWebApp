import { useContext } from "react";
import { allStrings } from "../../commons";
import ApplicationContext from "../../utills/context-api/context";
import VenueBox from "../venue-box/VenueBox";
import "./style.scss";

function MultipleVenuesModal({ openModal }) {
  const { venues } = useContext(ApplicationContext);

  return (
    <>
      <div>
        <div className="text">
          <div className="login-text">{allStrings.venue}</div>
          <hr />
        </div>
        <div id="venueBox">
          {venues?.length > 1 ? (
            venues.map((venue, index) => (
              <VenueBox
                venueName={venue.name}
                key={index}
                openModal={openModal}
                id={venue.id}
              />
            ))
          ) : (
            <b className="venueNotFound">{allStrings.noVenue}</b>
          )}
        </div>
      </div>
    </>
  );
}

export default MultipleVenuesModal;
