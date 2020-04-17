import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
import NoteForm from "./NoteForm";
import QuestionForm from "../Questions/QuestionForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCreator from "../customHooks/useCreator";

function Notes(props) {
  let { username } = useParams(),
    [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    [displayQuestionForm, setDisplayQuestionForm] = useState(false),
    { categoryNotes } = useContext(CategoryContext),
    { user } = useContext(ApiContext),
    isCreator = useCreator(user, username);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
  }, [autoPlay]);

  useEffect(()=>{
    if (displayNoteForm && displayQuestionForm) setDisplayQuestionForm(false)
  },[displayNoteForm])

  useEffect(()=>{
    if (displayQuestionForm && displayNoteForm) setDisplayNoteForm(false)
  },[displayQuestionForm])

  useEffect(() => {
    setDisplayNoteForm(false);
    setDisplayQuestionForm(false);
  }, [categoryNotes]);

  return (
    <div className="notes-component component">
        {isCreator && (
            <>
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
            </>

        )}
      {isCreator && displayNoteForm && <NoteForm />}
      {isCreator && displayQuestionForm && <QuestionForm />}

      <div className="container">
        {categoryNotes.map((note, ind) => {
          return (
            <Note
              key={note.pathName}
              note={note}
              active={autoPlayIndex === ind ? true : false}
              nextAutoPlayIndex={nextAutoPlayIndex}
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
}

export default Notes;
