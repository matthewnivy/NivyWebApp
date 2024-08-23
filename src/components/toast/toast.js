import "./style.scss";
import { ImCross } from "react-icons/im";
import { allStrings } from "../../commons/constants";

import getSVG from "../../commons/svgs";
function Toast() {
	return (
		<div className="toast">
			<img src={getSVG.success} alt="success" />
			<div className="toast-text">
				<p className="status">{allStrings.successToast.status}</p>
				<span>{allStrings.successToast.message}</span>
			</div>
			<ImCross className="cross-icon exit" />
		</div>
	);
}

export default Toast;
