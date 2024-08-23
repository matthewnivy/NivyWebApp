import React, { useEffect, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineClockCircle, AiOutlineCalendar } from "react-icons/ai";
import "./style.scss";
import { allStrings } from "../../commons";
import { getData } from "../../utills/local-storage/index";

export const DeliveryBox = ({ name, rowNo, seatNo, orderId }) => {
	// const getCurrentTime = () => {
	//   var time = new Date();
	//   var t = time.toLocaleString("en-US", {
	//     hour: "numeric",
	//     minute: "numeric",
	//     hour12: true,
	//   });
	//   return t;
	// };

	const getDate = () => {
		let now = new Date();
		return now.toLocaleDateString("en-US");
	};

	return (
		<div>
			<div className={"deliveryBox"}>
				<div className={"reciver"}>
					<p className={"reciverName"}>
						{allStrings.thank}
						{name + "!"}
					</p>
					<p className={"confirmation"}>{allStrings.confirmationText}</p>
				</div>
				<div className={"reciverInfo"}>
					<div className={"location"}>
						<HiOutlineLocationMarker className={"iconColor"} size={20} />
						<span className={"innerText"}>
							{/* {rowNo ? "Order# ROW NUMBER : ( " + rowNo : "Order# NAN  "} */}
							{/* {seatNo ? "  ) SEAT NUBMER : ( " + seatNo + " )" : "  NAN"} */}
							{"Order# " + orderId}
						</span>
					</div>
					<div className={"location"}>
						<AiOutlineCalendar className={"iconColor"} size={16} />
						<span className={"innerText"}>{getDate()}</span>
					</div>
					<div className={"location"}>
						<AiOutlineClockCircle className={"iconColor"} size={16} />
						<span className={"innerText"}>{getData("time")}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
