import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
import NoteForm from "./NoteForm";
import QuestionForm from "../Questions/QuestionForm";
import Questions from "../Questions/Questions";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCreator from "../customHooks/useCreator";
import "./Notes.css";
function Notes(props) {
  let { username } = useParams(),
    [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    [questionNotes, setQuestionNotes] = useState([]),
    // Options for displayForm ar 'note' , 'question' or question.pathName
    [displayForm, setDisplayForm] = useState(),
    [isUpdatingQuestion, setIsUpdatingQuestion] = useState(),
    { categoryNotes, categoryQuestions } = useContext(CategoryContext),
    { user } = useContext(ApiContext),
    isCreator = useCreator(user, username);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
  }, [autoPlay]);

  // Hides all forms when any note have been updated
  useEffect(() => {
    setQuestionNotes([]);
    setDisplayForm(null);
  }, [categoryNotes]);

  useEffect(() => {}, []);

  return (
    <div className="notes-component component">
      {isCreator && (
        <div>
          <button
            className="create-button"
            type="button"
            onClick={() =>
              setDisplayForm(displayForm !== "note" ? "note" : null)
            }
          >
            {displayForm !== "note" ? "Create Note" : "Hide Note Form"}
          </button>
          <button
            className="create-button"
            type="button"
            onClick={() =>
              setDisplayForm(displayForm !== "question" ? "question" : null)
            }
          >
            {displayForm !== "question"
              ? "Create Question"
              : "Hide Question Form"}
          </button>
        </div>
      )}
      {isCreator && displayForm === "note" && <NoteForm />}
      {isCreator && displayForm === "question" && (
        <QuestionForm {...{ questionNotes }} />
      )}
      {isCreator && (
        <Questions
          questions={categoryQuestions}
          {...{ setIsUpdatingQuestion }}
        />
      )}
      <div className="container">
        {categoryNotes.map((note, ind) => {
          return (
            <Note
              key={note.pathName}
              parentDisplayForm={displayForm}
              {...{
                note,
                updateQuestionNote,
                nextAutoPlayIndex,
                questionNotes
              }}
            />
          );
        })}
      </div>
    </div>
  );

  function nextAutoPlayIndex() {
    if (autoPlayIndex < categoryNotes.length - 1) {
      setAutoPlayIndex(autoPlayIndex + 1);
    } else {
      setAutoPlayIndex(null);
    }
  }

  function updateQuestionNote(n, isNoteActive) {
    let val = !isNoteActive
      ? [...questionNotes, n]
      : questionNotes.filter(v => v.pathName !== n.pathName);
    setQuestionNotes(val);
  }
}

export default Notes;
