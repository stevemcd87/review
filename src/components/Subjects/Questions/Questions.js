import React, { useContext } from "react";
//Components
import Question from "./Question";
// Contexts
import CategoryContext from "../../../contexts/CategoryContext";
// Styles
import "./Styles/Questions.css";
export default function Questions() {
  let { categoryQuestions } = useContext(CategoryContext);
  return (
    <div className="container">
      {categoryQuestions.map(q => {
        return <Question key={q.pathName} questionObject={q} />;
      })}
    </div>
  );
}
