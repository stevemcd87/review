import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext, useRef } from "react";

export default function AnswerOption(props) {
  let {
      answerOption,
      setAnswer,
      answer,
      removeAnswerOption,
      updateAnswerOption
    } = props,
    [isAnswer, setIsAnswer] = useState(false),
    [klassName, setKlassName] = useState("");

  useEffect(() => {
    (answer && answer.id) === (answerOption && answerOption.id)
      ? setIsAnswer(true)
      : setIsAnswer(false);
  }, [answerOption, answer]);

  useEffect(() => {
    setKlassName(isAnswer ? "correct-answer" : "");
  }, [isAnswer]);

  return (
    <div className={`answer-option-div ${klassName}`}>
      {!setAnswer && <p>{answerOption.inputValue}</p>}
      {setAnswer && (
        <>
          <div className="edit-buttons">
            <button
              type="button"
              className={`select-answer ${klassName}`}
              onClick={() => setAnswer(answerOption)}
              title="Mark as correct answer"
            >
              <FontAwesomeIcon
                icon={faCheck}
                color={isAnswer ? "green" : "grey"}
              />
            </button>
            <button
              type="button"
              title="Delete answer option"
              onClick={() => removeAnswerOption(answerOption.id)}
            >
              <FontAwesomeIcon icon={faTrash} color="grey" />
            </button>
          </div>
          <textarea
            className="answer-option"
            defaultValue={answerOption.inputValue}
            placeholder="Answer Option"
            onChange={e => updateAnswerOption(answerOption.id, e.target.value)}
          />
        </>
      )}
    </div>
  );
}
