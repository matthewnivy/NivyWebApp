import "./style.scss";
const RewardBox = ({ reward, name, onClick }) => {
  const handleSelect = () => {
    console.log("hhh");
  }
  return (
    <>
      <label className="container11">
        <div className={`rectangle ${reward}`}>
          <div className={`rewardWriting ${reward}`}>{reward}</div>
        </div>
        <input type="radio" checked name={name} onClick={onClick} />
        <span className={`checkmark ${reward}`} onClick={handleSelect}></span>
      </label>
    </>
  );
};

export default RewardBox;
