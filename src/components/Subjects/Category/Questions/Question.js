import React, { useState, useEffect, useContext, useRef } from "react";
import QuestionForm from "./QuestionForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../../contexts/ApiContext";
import CategoryContext from "../../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCheck,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function Question(props) {
  let { question, nextQuestion, incrementAnsweredCorrectly , last} = props,
    { subjectName, categoryName } = useParams(),
    answerOptionsDiv = useRef(),
    [imageSrc, setImageSrc] = useState(),
    [displayForm, setDisplayForm] = useState(false),
    [selectedAnswer, setSelectedAnswer] = useState(),
    // [answeredCorrect, setSelectedAnsweredCorrect] = useState(),
    { categoryQuestions, getCategoryQuestions } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
    setDisplayForm(false);
  }, [categoryQuestions]);

  // checks if answer is correct or not
  useEffect(() => {
    let isCorrect = selectedAnswer === question.answer ? true : false;
    if (isCorrect) incrementAnsweredCorrectly()
    if (selectedAnswer)
      [...answerOptionsDiv.current.children].forEach(v => {
        v.disabled = true;
        // if user was correct
        if (isCorrect && v.value === selectedAnswer) v.classList.add("correct");
        // if user was incorrect
        if (!isCorrect && v.value === selectedAnswer)
          v.classList.add("incorrect");
        if (!isCorrect && v.value === question.answer)
          v.classList.add("correct-option");
      });
  }, [selectedAnswer]);

  // for Question Image
  useEffect(() => {
    if (question.image) getImage();
  }, []);

  return (
    <div className="question-component">
      <button onClick={()=>nextQuestion('prev')}>Prev</button>
      <button onClick={()=>nextQuestion('next')}>{!last ? "Next" : "Test Results"}</button>
      {displayForm && <QuestionForm questionObject={question} />}
      {!displayForm && (
        <div className="question-content">
          <div className="question-request-buttons">
            <span
              className="edit-question-button"
              onClick={() => setDisplayForm(!displayForm)}
            >
              <FontAwesomeIcon icon={faEdit} size="2x" title="Edit Question" />
            </span>
            <span
              className="delete-question-button"
              onClick={() => deleteQuestion(question)}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                title="Delete Question"
              />
            </span>
          </div>

          <div className="question-detail">
            {selectedAnswer && (
              <AnswerStatus
                answeredCorrect={
                  selectedAnswer === question.answer ? true : false
                }
              />
            )}
            {question.image && <img src={imageSrc} />}
            <p>{question.question}</p>
            <div className="answer-options" ref={answerOptionsDiv}>
              {question.answerOptions.map((v, i) => (
                <button
                  key={question.pathName + v + i}
                  className="answer-option"
                  value={v}
                  onClick={e => setSelectedAnswer(e.target.value)}
                >
                  {v}
                </button>
              ))}
            </div>
            <span
              className="edit-question desktop"
              onClick={() => setDisplayForm(!displayForm)}
            >
              Edit Question
            </span>
          </div>
        </div>
      )}
    </div>
  );

  function checkAnswer(e) {
    e.persist();
    console.log(e);
    console.log(e.target.value);
  }

  function getImage() {
    Storage.get(question.image.replace("public/", ""))
      .then(res => {
        console.log("image res");
        console.log(res);
        setImageSrc(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  function deleteQuestion(q) {
    console.log("deleteQuestion");
    API.del(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/questions/`,
      {
        body: JSON.stringify({
          username: user.user.username,
          pathName: q.pathName
        })
      }
    )
      .then(response => {
        console.log("delete note response");
        console.log(response);
        getCategoryQuestions();
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

function AnswerStatus(props) {
  let { answeredCorrect } = props;
  return (
    <div className="answer-status-component">
      {answeredCorrect ? (
        <FontAwesomeIcon
          icon={faCheck}
          size="3x"
          title="Correct"
          color="green"
        />
      ) : (
        <FontAwesomeIcon
          icon={faTimes}
          size="4x"
          title="Incorrect"
          color="red"
        />
      )}
    </div>
  );
}

function answerOptions() {}
