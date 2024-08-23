import "./style.scss";
import { useEffect, useState } from "react";
import getSVG from "../../commons/svgs";
import { allStrings } from "../../commons/constants";
import { useContext } from "react";
import ApplicationContext from "../../utills/context-api/context";
import { getData } from "../../utills/local-storage";
import { keys } from "../../utills/local-storage/keys";
import {
  getUserDetails,
  isUserLoggedIn,
} from "../../utills/helpers/AuthHelper";
import { getCustomerPastContestList } from "../../utills/rest-apis/ApiHandeling";

function PastQuestions() {
  const { primaryColor, setPrimaryColor } = useContext(ApplicationContext);
  setPrimaryColor(getData(keys.primaryColor));
  const [data, setData] = useState([]);

  useEffect(() => {
    getListContest();
  }, []);

  const getListContest = async () => {
    let venueId = getData(keys.venueId);
    const userId = getUserDetails(getData(keys.accessToken)).userId;
    if (!userId || !venueId) {
      return;
    }
    try {
      let response = await getCustomerPastContestList(userId, venueId);
      if (response.success) {
        setData(response?.content);
      }
    } catch (error) {}
  };

  return (
    <>
      {data?.slice(0)
            .reverse()
            .map((val, index) => {
        return (
          <div className="questionContainer" key={val?.id}>
            <div className="question-details">
              <div className="contest-name">
                <img src={getSVG.trophy}></img>
                <span>{val?.contestName}</span>
              </div>

              <div className="win-points">
                <span>Win</span>
                <img src={getSVG.coin}></img>
                <span className="points-quantity">
                  {val?.contestPossibleAnswers[0]?.rewardPoints}
                </span>
              </div>

              <div className="time-badge">{allStrings.completed}</div>
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
                    {val.customerSelectedAnswer == valAnswer?.name ? (
                      <div className="option" id="customerSelectedAnswer">
                        {valAnswer?.name}
                      </div>
                    ) : val.contestAnswer == valAnswer?.name ? (
                      <div className="option" id="correctAnswer">
                        {valAnswer?.name}
                      </div>
                    ) : (
                      <div className="option">{valAnswer?.name}</div>
                    )}
                  </li>
                </ul>
              ))}
              <input
                type="button"
                className="submitBtn disbaled"
                value={allStrings.submitAnswer}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default PastQuestions;
