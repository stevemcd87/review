import React, { useState, useEffect } from "react";
// Components
import Notes from "../../Notes/Notes";
import TestAnswerOption from "./TestAnswerOption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function TestQuestion(props) {
  let { questionObject, updateScore } = props,
    [userAnswer, setUserAnswer] = useState(),
    [isUserCorrect, setIsUserCorrect] = useState(false);
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
            </div>
          )}
          {userAnswer && <button type="button">Next Question</button>}
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
