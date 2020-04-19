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
    { API, Storage, Auth, user } = useContext(ApiContext),
    { getCategoryNotes } = useContext(CategoryContext),
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
                <button
                  className="edit-question-button"
                  onClick={() => setDisplayForm(!displayForm)}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="2x"
                    title="Edit Question"
                    color="grey"
                  />
                </button>
                <button
                  className="delete-question-button"
                  onClick={() => deleteQuestion(questionObject)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="2x"
                    title="Delete Question"
                    color="grey"
                  />
                </button>
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
  async function deleteQuestion(q) {
    let isConfirmed = window.confirm(
      "Are you sure you'd like to delete this question?"
    );
    if (isConfirmed) {
      return API.del(
        "StuddieBuddie",
        `/users/${user.username}/subjects/${subjectName}/categories/${categoryName}/questions/`,
        {
          body: JSON.stringify({
            pathName: q.pathName
          }),
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`
          }
        }
      )
        .then(response => {
          getCategoryNotes();
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
}
