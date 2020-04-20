import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "../Question";
import TestQuestion from "./TestQuestion";
import "../Styles/Questions.css";

export default function Test(props) {
  let [answeredCorrectly, setAnsweredCorrectly] = useState(0),
    { categoryQuestions } = useContext(CategoryContext),
    [questionIndex, setQuestionIndex] = useState(0),
    [score, setScore] = useState({ correct: 0, incorrect: 0 }),
    [showScore, setShowScore] = useState(false),
    [currentQuestion, setCurrentQuestion] = useState();
  useEffect(() => {
    console.log("categoryQuestions");
    console.log(categoryQuestions);
    setCurrentQuestion(categoryQuestions[questionIndex]);
  }, [categoryQuestions]);

  useEffect(() => {
    // console.log(score);
    // if (questionIndex === categoryQuestions.length - 1) setShowScore(true);
    // else setQuestionIndex(questionIndex + 1);
  }, [score]);

  return (
    <div className="test-component container">
      <TestQuestion questionObject={currentQuestion} {...{ updateScore }} />
    </div>
  );

  function updateScore(result) {
    let clone = { ...score };
    clone[result] += 1;
    console.log("clone");
    console.log(clone);
    setScore(clone);
  }
}
