import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext, useRef } from "react";
import './Test.css'
export default function AnswerOption(props) {
  let { answerOption, answer, userAnswer, setUserAnswer } = props,
    [klassName, setKlassName] = useState("");

  useEffect(() => {
    if (userAnswer && answerOption.id === answer.id)
      setKlassName("correct-answer");
  }, [userAnswer]);

  return (
    <div className={`answer-option-div`}>
      <button
        type="button"
        disabled={userAnswer}
        onClick={answerQuestion}
        className={klassName}
      >
        {answerOption.inputValue}
      </button>
    </div>
  );

  function answerQuestion() {
    if (answerOption.id !== answer.id) setKlassName("incorrect-answer");
    setUserAnswer(answerOption);
  }
}
