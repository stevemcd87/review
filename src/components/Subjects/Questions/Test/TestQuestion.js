import React, { useState, useEffect } from "react";
import TestAnswerOption from "./TestAnswerOption";
// import { useParams } from "react-router-dom";
// import ApiContext from "../../../contexts/ApiContext";
// import CategoryContext from "../../../contexts/CategoryContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTrash,
//   faEdit,
//   faCheck,
//   faTimes
// } from "@fortawesome/free-solid-svg-icons";

export default function TestQuestion(props) {
  let { questionObject, updateScore } = props,
    [userAnswer, setUserAnswer] = useState();
  useEffect(() => {
    console.log(questionObject);
  }, [questionObject]);
  return (
    <div className="test-question-component item">
      <div className="item-content">
        {questionObject && (
          <div>
            <h3>{questionObject.question}</h3>
            <div className="answer-options-div">
              {questionObject.answerOptions.map(ao => {
                return (
                  <TestAnswerOption
                    key={ao.id}
                    answerOption={ao}
                    answer={questionObject.answer}
                    {...{ userAnswer, setUserAnswer }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
