import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// Components
import Notes from "../../Notes/Notes";
import TestAnswerOption from "./TestAnswerOption";

export default function TestQuestion(props) {
  let { questionObject, updateScore, nextQuestion } = props,
    [userAnswer, setUserAnswer] = useState();
  useEffect(() => {
    console.log(questionObject);
  }, [questionObject]);

  useEffect(() => {
    // Updates Test Score when user answers question
    if (userAnswer) {
      let result = isCorrect() ? "correct" : "incorrect";
      updateScore(result);
    }
  }, [userAnswer]);

  return (
    <>
      <div className="test-question-component item">
        <div className="item-content">
          {questionObject && (
            <div>
              {userAnswer && (
                <FontAwesomeIcon
                  icon={isCorrect() ? faCheck : faTimes}
                  size="3x"
                  color={isCorrect() ? "green" : "red"}
                />
              )}
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
              {userAnswer && (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="next-question create-button"
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {userAnswer && !isCorrect() && (
        <Notes passedNotesFromTest={questionObject.questionNotes} />
      )}
    </>
  );
  function isCorrect() {
    return userAnswer && userAnswer.id === questionObject.answer.id
      ? true
      : false;
  }
}
