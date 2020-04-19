import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Question from "./Question";
import QuestionForm from "./QuestionForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ApiContext from "../../../contexts/ApiContext";

// import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { useParams } from "react-router-dom";
import "./Styles/Questions.css";

export default function Questions(props) {
  let {questions} = props;
  return (
    <div className="question-component">
      {questions.map(q=>{
        return <Question key={q.pathName} questionObject={q} />
      })}
    </div>
  )
}
