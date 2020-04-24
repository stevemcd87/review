
import React, { useState, useEffect } from "react";
import './Test.css'
export default function AnswerOption(props) {
  let { answerOption, answer, userAnswer, setUserAnswer } = props,
    [klassName, setKlassName] = useState("");

  useEffect(() => {
    if (userAnswer && answerOption.id === answer.id)
      setKlassName("correct-answer");
  }, [userAnswer, answerOption, answer]);

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
