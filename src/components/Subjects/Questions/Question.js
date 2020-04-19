import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
// Components
import QuestionForm from "./QuestionForm";
import AnswerOption from "./AnswerOption";
// Contexts
import ApiContext from "../../../contexts/ApiContext";
import NoteContext from "../../../contexts/NoteContext";
import CategoryContext from "../../../contexts/CategoryContext";
// Custom Hooks
import useCreator from "../customHooks/useCreator";

export default function Question(props) {
  let { questionObject } = props,
    { subjectName, categoryName, username } = useParams(),
    [isFormDisplayed, setIsFormDisplayed] = useState(false),
    { API, Auth, user } = useContext(ApiContext),
    { getCategoryNotes } = useContext(CategoryContext),
    { questionNotes, formDisplayed, setFormDisplayed } = useContext(
      NoteContext
    ),
    isCreator = useCreator(user, username);

  useEffect(() => {
    setIsFormDisplayed(shouldFormDisplay());
  }, [formDisplayed]);
  return (
    <div className="question-component item">
      {isCreator && (
        <div className="item-content">
          <div className="edit-buttons">
            <button
              className="edit-question-button"
              onClick={() =>
                setFormDisplayed(
                  formDisplayed !== questionObject.pathName
                    ? questionObject.pathName
                    : ""
                )
              }
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
          {isFormDisplayed && (
            <QuestionForm
              {...{ questionObject }}
              questionNotes={questionNotes}
            />
          )}
          {!isFormDisplayed && (
            <div>
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

  function shouldFormDisplay() {
    // for Creating Question
    if (!questionObject && formDisplayed === "question") return true;
    // for Updating Question
    if (questionObject && questionObject.pathName === formDisplayed)
      return true;

    return false;
  }

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
