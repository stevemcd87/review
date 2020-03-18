import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "./Question";
import QuestionForm from "./QuestionForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import "./Styles/Questions.css";

export default function Questions(props) {
  let [answeredCorrectly, setAnsweredCorrectly] = useState(0),
    [questionIndex, setQuestionIndex] = useState(0),
    [displayForm, setDisplayForm] = useState(false),
    { categoryQuestions, getCategoryQuestions } = useContext(CategoryContext);

  useEffect(() => {
    console.log(categoryQuestions);
  }, [categoryQuestions]);

  return (
    <div className="questions-component">
      <div>
        {!displayForm && (
          <button type="button " onClick={() => setDisplayForm(!displayForm)}>
            Create Question
            <FontAwesomeIcon
              icon={faPlusCircle}
              size="2x"
              title="Create Question"
            />
          </button>
        )}
      </div>

      {displayForm && <QuestionForm />}
      {!displayForm && categoryQuestions[questionIndex] && (
        <div className="questions">
          <Question
            key={categoryQuestions[questionIndex].pathName}
            question={categoryQuestions[questionIndex]}
            nextQuestion={nextQuestion}
            incrementAnsweredCorrectly={incrementAnsweredCorrectly}
            lastQuestion={
              questionIndex === categoryQuestions.length - 1 ? true : false
            }
          />
        </div>
      )}
    </div>
  );
  // <div className="questions">
  // {categoryQuestions.map((question, ind) => {
  //   return (
  //     <Question
  //       key={question.pathName}
  //       question={question}
  //       nextQuestion={nextQuestion}
  //     />
  //   );
  // })}
  // </div>

  function incrementAnsweredCorrectly() {
    setAnsweredCorrectly(answeredCorrectly + 1);
  }
  function nextQuestion(direction) {
    console.log("nextQuestion");
    if (direction === 'next') {
      if (questionIndex < categoryQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        console.log("finished");
        alert('finished')
      }
    } else {
      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1);
      } else {
        console.log("First");
        alert('First')
      }
    }

  }
}
