import React from "react";

export const OptionsDept = ({ catName, optionArray }) => {
	return (
		<div className="cat">
			<span className={"optOne"}>{"(" + catName + ")"}</span>
			{optionArray.map((item) => (
				<spac className="selectName">{item.optionChoiceName}</spac>
			))}
		</div>
	);
};
