import "./style.scss";
import { useRef, useState, useContext } from "react";
import { allStrings } from "../../commons";
import Toast from "../toast/toast";
import ApplicationContext from "../../utills/context-api/context";
import { keys } from "../../utills/local-storage/keys";
import { getData } from "../../utills/local-storage";
function FeedbackForm() {
	const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);

	setPrimaryColor(getData(keys.primaryColor));

	const optionsList = useRef();
	const selectRef = useRef();

	const [value, setValue] = useState("Select Options");
	const [toast, setToast] = useState(false);

	const showOptions = (ref) => {
		ref.current.style.visibility = "visible";
		ref.current.style.opacity = "1";
	};

	const hideOptions = (ref) => {
		ref.current.style.visibility = "hidden";
		ref.current.style.opacity = "0";
	};

	const handleClick = (e) => {
		if (e.target.children.length) {
			setValue("Select Option");
			showOptions(optionsList);
		} else {
			setValue(e.target.textContent);
			hideOptions(optionsList);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setToast(true);
	};

	return (
		<form className="modalForm" onSubmit={handleSubmit}>
			<div className="text">
				<div className="login-text">{allStrings.feedbackText}</div>
			</div>

			<div className="input-container">
				<ul
					className="selectOptions"
					style={{ borderColor: `#${primaryColor}` }}
				>
					<li onClick={handleClick} ref={selectRef}>
						{value}
						<svg
							width="12"
							height="5"
							viewBox="0 0 12 5"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M5.99778 3.31167L11.1826 0.00580786L12 1.17217L5.99658 5L-5.09372e-08 1.16531L0.819087 -4.88733e-07L5.99778 3.31167Z"
								fill="#AFAFAF"
							/>
						</svg>

						<ul className="selectOptions" ref={optionsList}>
							<li>{allStrings.eventFeedback}</li>
							<li>{allStrings.appFeedback}</li>
						</ul>
					</li>
				</ul>
			</div>

			<div
				className="input-container"
				style={{ borderColor: `#${primaryColor}` }}
			>
				<input
					style={{ borderColor: `#${primaryColor}` }}
					type="email"
					placeholder={allStrings.emailPlaceholder}
					className="feedbackInput"
				></input>
			</div>

			<div className="input-container">
				<textarea
					style={{ borderColor: `#${primaryColor}` }}
					placeholder={allStrings.textareaPlaceholder}
					className="feedbackInput"
					rows={6}
				></textarea>
			</div>

			<input
				type="submit"
				value={allStrings.submit.toUpperCase()}
				className="submitBtn"
				style={{ background: `#${primaryColor}` }}
			></input>
			{toast ? <Toast /> : null}
		</form>
	);
}

export default FeedbackForm;
