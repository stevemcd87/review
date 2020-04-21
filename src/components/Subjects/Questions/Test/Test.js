import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "../Question";
import TestQuestion from "./TestQuestion";
import "../Styles/Questions.css";

export default function Test(props) {
  let { retakeTest } = props,
    [answeredCorrectly, setAnsweredCorrectly] = useState(0),
    { categoryQuestions } = useContext(CategoryContext),
    [questionIndex, setQuestionIndex] = useState(0),
    [score, setScore] = useState({
      correct: 0,
      incorrect: 0,
      answeredQuestions: 0
    }),
    [showScore, setShowScore] = useState(false),
    [showButton, setShowButton] = useState(false),
    [currentQuestion, setCurrentQuestion] = useState();
  useEffect(() => {
    console.log("categoryQuestions");
    console.log(categoryQuestions);
    setCurrentQuestion(categoryQuestions[questionIndex]);
  }, [categoryQuestions]);

  // useEffect(() => {
  //   console.log(score);
  //   // if Test is Finished
  //   if (questionIndex === categoryQuestions.length - 1) setShowScore(true);
  //   else if (categoryQuestions.length !== 0)setQuestionIndex(questionIndex + 1);
  // }, [score]);

  useEffect(() => {
    setShowButton(questionIndex + 1 === score.answeredQuestions ? true : false);
    setCurrentQuestion(categoryQuestions[questionIndex]);
  }, [questionIndex]);

  return (
    <div className="test-component container">
      {!showScore && (
        <TestQuestion
          key={currentQuestion && currentQuestion.pathName}
          questionObject={currentQuestion}
          {...{ updateScore, nextQuestion }}
        />
      )}
      {showScore && (
        <div className="item score">
          <h3>{getScore()}</h3>
          <button type="button" onClick={retakeTest}>
            Retake Test
          </button>
        </div>
      )}
    </div>
  );

  function getScore() {
    return `Answered ${score.correct} out of ${
      score.answeredQuestions
    } correctly - ${Math.round(
      (score.correct / score.answeredQuestions) * 100
    )}%`;
  }

  function updateScore(result) {
    // result will be either "correct" or "incorrect"
    let clone = { ...score };
    clone[result] += 1;
    clone.answeredQuestions += 1;
    setScore(clone);
  }

  function nextQuestion() {
    if (questionIndex !== categoryQuestions.length - 1)
      setQuestionIndex(questionIndex + 1);
    else setShowScore(true);
  }

  // {showButton && <button type="button">Next Question</button>}

  function showButtonFunc() {}
}
