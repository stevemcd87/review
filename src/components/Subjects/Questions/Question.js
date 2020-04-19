import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import QuestionForm from "./QuestionForm";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import useCreator from "../customHooks/useCreator";
import AnswerOption from "./AnswerOption";
export default function Question(props) {
  let { questionObject } = props,
    { subjectName, categoryName, username } = useParams(),
    [displayForm, setDisplayForm] = useState(false),
    { API, Storage, user } = useContext(ApiContext),
    { getCategoryQuestions } = useContext(CategoryContext),
    isCreator = useCreator(user, username);
  useEffect(() => {
    console.log(questionObject);
  }, []);
  return (
    <div className="question-component item">
      {isCreator && (
        <div className="item-content">
          {displayForm && (
            <QuestionForm
              {...{ questionObject }}
              questionNotes={questionObject.questionNotes}
            />
          )}
          {!displayForm && (
            <div>
              <div className="edit-buttons">
                <span
                  className="edit-question-button"
                  onClick={() => setDisplayForm(!displayForm)}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="2x"
                    title="Edit Question"
                    color="grey"
                  />
                </span>
                <span
                  className="delete-question-button"
                  onClick={() => deleteQuestion(questionObject)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="2x"
                    title="Delete Question"
                    color="grey"
                  />
                </span>
              </div>
              <h3>{questionObject.question}</h3>
              <div className="answer-options-div">
                {questionObject.answerOptions.map(ao => {
                  return (
                    <AnswerOption
                      key={ao.id}
                      answerOption={ao}
                      answer={questionObject.answer}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
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
