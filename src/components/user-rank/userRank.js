import getSVG from "../../commons/svgs";
import "./style.scss";
function UserRank({ rank, distinction, name, points }) {
	return (
		<div className="positionContainer">
			{distinction ? (
				<img className="rank" src={getSVG[rank]}></img>
			) : (
				<span className="rank">{`#${rank}`}</span>
			)}

			<span className="user-name">{name}</span>

			<div className="points-badge">
				<img src={getSVG.coin}></img>
				<span className="amount">{points}</span>
			</div>
		</div>
	);
}

export default UserRank;
