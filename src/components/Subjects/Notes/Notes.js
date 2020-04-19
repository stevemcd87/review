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
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    [displayQuestionForm, setDisplayQuestionForm] = useState(false),
    { categoryNotes, categoryQuestions } = useContext(CategoryContext),
    { user } = useContext(ApiContext),
    isCreator = useCreator(user, username);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
  }, [autoPlay]);

  // Hides the Question Form if user clicks for the Note form
  useEffect(() => {
    if (displayNoteForm && displayQuestionForm) setDisplayQuestionForm(false);
  }, [displayNoteForm]);

  // Hides the Note Form if user clicks for the question form
  useEffect(() => {
    if (displayQuestionForm && displayNoteForm) setDisplayNoteForm(false);
  }, [displayQuestionForm]);

  // Hides all forms when any note have been updated
  useEffect(() => {
    setDisplayNoteForm(false);
    setDisplayQuestionForm(false);
  }, [categoryNotes]);

  return (
    <div className="notes-component component">
      {isCreator && (
        <div>
          <button
            className="create-button"
            type="button"
            onClick={() => setDisplayNoteForm(!displayNoteForm)}
          >
            {!displayNoteForm ? "Create Note" : "Hide Note Form"}
          </button>
          <button
            className="create-button"
            type="button"
            onClick={() => setDisplayQuestionForm(!displayQuestionForm)}
          >
            {!displayQuestionForm ? "Create Question" : "Hide Question Form"}
          </button>
        </div>
      )}
      {isCreator && displayNoteForm && <NoteForm />}
      {isCreator && displayQuestionForm && (
        <QuestionForm {...{ questionNotes }} />
      )}
      {isCreator && <Questions questions={categoryQuestions} />}
      <div className="container">
        {categoryNotes.map((note, ind) => {
          return (
            <Note
              key={note.pathName}
              {...{
                note,
                updateQuestionNote,
                displayQuestionForm,
                nextAutoPlayIndex
              }}
              isActive={
                autoPlayIndex === ind || isInQuestionNote(note) ? true : false
              }
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

  function isInQuestionNote(n) {
    return questionNotes.findIndex(v => v.pathName === n.pathName) >= 0
      ? true
      : false;
  }

  function updateQuestionNote(n, isNoteActive) {
    let val = !isNoteActive
      ? [...questionNotes, n]
      : questionNotes.filter(v => v.pathName !== n.pathName);
    setQuestionNotes(val);
  }
}

export default Notes;
