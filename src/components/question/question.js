import { useEffect } from "react";
import "./style.scss";
import getSVG from "../../commons/svgs";
import { makeStyles } from "@material-ui/core/styles";
import { allStrings } from "../../commons/constants";
import { useContext, useState } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import moment from "moment";
import {
  getUserDetails,
  isUserLoggedIn,
} from "../../utills/helpers/AuthHelper";
import {
  getCustomerContestList,
  submitContestAnswer,
} from "../../utills/rest-apis/ApiHandeling";
import { colors } from "./../../commons/constants";
import CustomAlert from "../alert/customAlert";
import Modal from "../modal/Modal";
let validationCheck = { id: [], name: [] };
function Question() {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);
  const [selectedAnswer, setSelectedAnswer] = useState([
    { id: "", answer: "" },
  ]);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState(allStrings.modalScreens.login);
  const [alertData, setAlertData] = useState({});
  setPrimaryColor(getData(keys.primaryColor));

  useEffect(() => {
    getListContest();
  }, [isUserLoggedIn()]);
  // dependency array isUserLoggedIn when the user is redirected from the login modal after he sign in to show only the user's contests

  const getListContest = async () => {
    let venueId = getData(keys.venueId);
    const userId = getUserDetails(getData(keys.accessToken))?.userId;
    if (!venueId) {
      return;
    }
    try {
      let response = await getCustomerContestList(userId, venueId);
      if (response.success) {
        setData(response?.content);
      }
    } catch (error) {}
  };

  const clickOptionHandler = (name, id, e) => {
    console.log(isUserLoggedIn());
    if (!isUserLoggedIn()) {
      setModal(true);
    }
    if (validationCheck.id[id] !== id) {
      validationCheck.id[id] = id;
      validationCheck.name[id] = name;
      e.target.style.color = colors.white;
      e.target.style.backgroundColor = colors.primaryBlue;
      let update = {
        id: id,
        answer: name,
      };
      setSelectedAnswer([...selectedAnswer, update]);
    }
  };

  const HandleSubmit = async (contestId) => {
    const userId = getUserDetails(getData(keys.accessToken))?.userId;
    let venueId = getData(keys.venueId);
    console.log("contestId :: ", contestId);
    console.log("userId :: ", userId);
    console.log("venueId :: ", venueId);
    let selectedContestAnswer = selectedAnswer.filter(
      (answer) => answer?.id == contestId
    );
    let answer = selectedContestAnswer[0]?.answer;
    console.log("selected Answer ::: ", answer);
    if (!answer || !venueId || !userId || !contestId) {
      let updatedValue = {};
      updatedValue = {
        message: `Please select the answer`,
        type: allStrings.apiResponseType.error,
      };
      setAlertData({ ...alertData, ...updatedValue });
    }

    try {
      let response = await submitContestAnswer(
        userId,
        venueId,
        contestId,
        answer
      );
      console.log("Api Submit Response ::: ", response);
      Animate();
      let updatedValue = {};
      if (response.success) {
        updatedValue = {
          message: `${response?.content} Please visit the past contest panel to view the result!`,
          type: response.success
            ? allStrings.apiResponseType.success
            : allStrings.apiResponseType.error,
        };
        setAlertData({ ...alertData, ...updatedValue });
        getListContest();
      }
    } catch (error) {}
    console.log(userId);
  };

  const Animate = () => {
    setChecked((prev) => !prev);
    setTimeout(() => {
      setChecked(false);
    }, 10000);
  };
  const handleClose = () => {
    setChecked((prev) => !prev);
  };
  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      justifyContent: "center",
    },
  }));
  const classes = useStyles();
  const [updateTimer, setUpdateTimer] = useState(new Date());

  useEffect(() => {
    getListContest();
    const intervelval = setInterval(() => {
      setUpdateTimer(new Date());
    }, 1000);

    return () => {
      clearInterval(intervelval);
      getListContest();
    };
  }, [updateTimer]);

  const getTimeRemaining = (endtime) => {
    let newEndDate = moment.utc(endtime).local().format("YYYY-MM-DD HH:mm:ss");

    console.log("before moderation", newEndDate);
    let newstartDate = new Date();
    console.log(newstartDate, "newstartDate");
    const total = Date.parse(newEndDate) - Date.parse(newstartDate);
    console.log(total);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return (
      <>
        {days < 0 ? "0" : days}:{hours < 0 ? "0" : hours}:
        {minutes < 0 ? "0" : minutes}:{seconds < 0 ? "0" : seconds}
        {days > 0
          ? " DAYS LEFT"
          : hours > 0
          ? " HOURS LEFT"
          : minutes > 0
          ? " MINUTES LEFT"
          : seconds > 0
          ? " SECONDS LEFT"
          : null}
      </>
    );
  };

  return (
    <>
      {data?.map((val, index) => {
        let contestAnswer = val?.contestAnswer;
        let answer = val?.contestPossibleAnswers?.filter(
          (nameVal, index) => nameVal?.name == contestAnswer
        );

        return (
          <div className="questionContainer" key={val?.id}>
            <div className="question-details">
              <div className="contest-name">
                <img src={getSVG.trophy}></img>
                <span>{val?.contestName}</span>
              </div>

              <div className="win-points">
                <span>Win</span>
                <img src={getSVG?.coin}></img>
                <span className="points-quantity">
                  {answer ? answer[0]?.rewardPoints : null}
                </span>
              </div>
              {val?.contestEndDateTime && (
                <div className="time-badge">
                  {getTimeRemaining(val?.contestEndDateTime)}
                </div>
              )}
            </div>

            <div className="question">
              <span className="bold">{allStrings.question}</span>
              <span className="question-statement">{val?.contestQuestion}</span>
            </div>

            <div className="answer">
              <span className="bold">{allStrings.answer}</span>
              {val?.contestPossibleAnswers?.map((valAnswer, index) => (
                <ul className="answer-badges">
                  <li className="list-Style">
                    <input type="radio" name={val?.id}></input>
                    <label
                      onClick={(e) => {
                        clickOptionHandler(valAnswer?.name, val?.id, e);
                      }}
                    >
                      {valAnswer?.name}
                    </label>
                  </li>
                </ul>
              ))}
              <input
                onClick={() => {
                  HandleSubmit(val?.id);
                }}
                type="button"
                className="submitBtn"
                value={allStrings.submitAnswer}
                style={{ background: `#${primaryColor}` }}
              />
            </div>
          </div>
        );
      })}

      <div className={classes.wrapper}>
        <CustomAlert
          message={alertData.message}
          onClose={handleClose}
          type={alertData.type}
          checked={checked}
        />
      </div>

      {modal ? (
        <Modal
          openModal={setModal}
          changeModalScreen={setModalScreen}
          modalScreen={modalScreen}
          contestLogin={"1"}
        ></Modal>
      ) : null}
    </>
  );
}

export default Question;
