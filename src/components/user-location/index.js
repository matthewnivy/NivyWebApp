import React, { useState, useEffect } from "react";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";

const UserLocation = () => {
  let userLocationFields = getData(keys.userLocationFields);
  userLocationFields = userLocationFields.split(",");
  let urlParam = JSON.parse(getData(keys.urlParameters));

  let [loc, setLoc] = useState([]);
  let location = ["loc1", "loc2", "loc3", "loc4"];
  useEffect(() => {
    let temp = [];
    userLocationFields?.map(
      (userlocation, index) =>
        userlocation &&
        urlParam[location[index]] &&
        temp.push(userlocation + " " + urlParam[location[index]])
    );
    setLoc(temp);
  }, []);

  return (
    <section className="seat-info">
      {loc?.map((locationString) => (
        <p>{locationString}</p>
      ))}
    </section>
  );
};

export default UserLocation;
