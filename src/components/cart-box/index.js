import React, { useState, useContext, useEffect } from "react";
import "./style.scss";
import { QuantityButton } from "../index";
import cros from "../../utills/cross.svg";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import ApplicationContext from "../../utills/context-api/context";
import { allStrings } from "../../commons";

export const CartBox = ({
	itemPrice,
	quantityBtn,
	title,
	options,
	itemQuantity,
	open,
	id,
	ID,
	img,
	taxRate,
	getValue,
	vId,
	updatePopUpClosed,
	popUpOpen,
	dId,
	dName,
	DPrice,
	DTax,
	DVendorId,
	popOpen,
	pooUperl,
	instruction,
}) => {
	let actualprie = itemPrice;
	const [price, setPrice] = useState(actualprie);
	const [quantity, setQuantity] = useState(itemQuantity);
	const [names, setNames] = useState([]);
	const [addonName, setaddonName] = useState([]);
	const {
		setItemName,
		setEdit,
		setItemId,
		primaryColor,
		productExistCalculations,
	} = useContext(ApplicationContext);
	let optionPrice = 0.0;
	useEffect(() => {
		priceAndOptionCalculations();
		setQuantity(itemQuantity);
		console.log("Tax Rate ", taxRate);
	}, [quantity, popOpen, updatePopUpClosed]);
	useEffect(() => {
		priceAndOptionCalculations();
	}, []);
	const priceAndOptionCalculations = () => {
		let temp = [];
		let temp2 = [];
		optionPrice = 0;
		for (let i = 0; i < options.length; i++) {
			let ele = options[i].selectedOptions;
			for (let j = 0; j < ele.length; j++) {
				if (options[i].optionSelections == "Single") {
					temp = [...temp, ele[j].optionChoiceName];
				} else {
					temp2 = [...temp2, ele[j].optionChoiceName];
				}
				optionPrice += parseFloat(ele[j].price);
			}
		}
		setPrice((actualprie + optionPrice) * quantity);
		setNames(temp);
		setaddonName(temp2);
	};

	const CalculateOptionPrice = () => {
		let opPrice = 0.0;
		for (let i = 0; i < options.length; i++) {
			let ele = options[i].selectedOptions;
			for (let j = 0; j < ele.length; j++) {
				opPrice += parseFloat(ele[j].price);
			}
		}
		return opPrice;
	};
	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
			setPrice((actualprie + optionPrice) * quantity);
			const opPrice = CalculateOptionPrice();
			productExistCalculations(
				vId,
				quantity - 1,
				itemPrice,
				taxRate,
				actualprie * quantity,
				id,
				opPrice,
				false
			);
			getValue(quantity - 1);
		} else {
			Confirmation(id, price, taxRate, vId);
		}
	};
	const increaseQuantity = () => {
		setQuantity(parseInt(quantity) + 1);
		setPrice((actualprie + optionPrice) * quantity);
		const opPrice = CalculateOptionPrice();
		productExistCalculations(
			vId,
			quantity + 1,
			itemPrice,
			taxRate,
			actualprie * quantity,
			id,
			opPrice,
			true
		);
		getValue(quantity + 1);
	};
	const modelOpens = (vId) => {
		open(vId);
		setItemName(title);
		setEdit(true);
		ID(id);
		setItemId(id);
		pooUperl(img[0]);
	};

	const Confirmation = (id, title, price, taxRate, vId) => {
		dId(id);
		dName(title);
		DPrice(price);
		DTax(taxRate);
		DVendorId(vId);
		popUpOpen();
	};
	var addOnOptions = [];
	var choiceOptions = [];

	for (let i = 0; i < options.length; i++) {
		if (options[i].optionSelections == "Multiple") {
			addOnOptions.push(options[i]);
		} else if (options[i].optionSelections == "Single") {
			if (options[i].selectedOptions.length > 0) choiceOptions.push(options[i]);
			console.log(options[i]);
		}
	}

	function listSelectedChoices(chosenArr) {
		var arr = [];
		for (let i = 0; i < chosenArr.length; i++) {
			arr.push(chosenArr[i].optionChoiceName);
		}
		return arr.join(", ");
	}
	return (
		<>
			<div>
				<div className={quantityBtn ? "mainDiv" : "mainDivQ"}>
					<div className={"imageContainerSS"}>
					{img &&	<img src={img[0]} width={70} height={70} />}
					</div>
					<div className={"texts"}>
						<div className={"descriptions"}>
							<p className={"name"}>{title}</p>
							<div>
								{choiceOptions.length !== 0
									? choiceOptions.map((option) => (
										<p className="sub">
											<span className="opt">{option.optionName + ": "}</span>
											<span>
												{option.selectedOptions[0].optionChoiceName}
											</span>
										</p>
									))
									: null}
							</div>
							<div>
								{addOnOptions.map((option) => (
									<p className="sub">
										<span className="opt">
											{listSelectedChoices(option.selectedOptions)
												? option.optionName + ": "
												: null}
										</span>
										<span className="lH">{listSelectedChoices(option.selectedOptions)}</span>
									</p>
								))}
							</div>
							{quantityBtn == false ? (
								<p className={"sub"}>
									<span className={"opt"}>{allStrings.Quantity}</span>
								</p>
							) : null}
							{instruction ? (
								<p className={"subIns"}>
									<span className={"opt"}>{"Instructions: "}</span>
									<span>{instruction}</span>
								</p>
							) : null}
						</div>
						{quantityBtn ? (
							<div className={"iconsSetting"}>
								<QuantityButton
									count={quantity}
									inc={() => increaseQuantity()}
									dec={() => decreaseQuantity()}
								/>
								<Link>
									<BsPencilSquare
										style={{ color: `#${primaryColor}` }}
										className={"pen"}
										onClick={() => modelOpens(vId)}
									/>
								</Link>
							</div>
						) : null}
					</div>
					{quantityBtn == false ? (
						<div className={"quantities"}>
							<p className={"totalRatewithQuantity"}>
								{"$" + price.toFixed(2)}
							</p>
						</div>
					) : (
						<div className={"quantities"}>
							<p className={"upperrate"}>{"$" + itemPrice.toFixed(2)}</p>
							<p className={"totalRate"}>{"$" + price.toFixed(2)}</p>
						</div>
					)}
					{quantityBtn == true ? (
						<img
							src={cros}
							className={"cross"}
							onClick={() => Confirmation(id, title, price, taxRate, vId)}
						/>
					) : null}
				</div>
			</div>
		</>
	);
};
