import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
//Components
import Note from "./Note";
import NoteForm from "./NoteForm";
import Questions from "../Questions/Questions";
import QuestionForm from "../Questions/QuestionForm";
// Contexts
import ApiContext from "../../../contexts/ApiContext";
import NoteContext from "../../../contexts/NoteContext";
import CategoryContext from "../../../contexts/CategoryContext";
// Custom Hooks
import useCreator from "../customHooks/useCreator";
//Styles
import "./Notes.css";
function Notes(props) {
  let { username } = useParams(),
    [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    [questionNotes, setQuestionNotes] = useState([]),
    // Options for formDisplayed ar 'note' , 'question' or question.pathName
    [formDisplayed, setFormDisplayed] = useState(""),
    // [formDisplayed, setFormDisplayed] = useState(""),
    // [isUpdatingQuestion, setIsUpdatingQuestion] = useState(),
    { categoryNotes, categoryQuestions } = useContext(CategoryContext),
    { user } = useContext(ApiContext),
    isCreator = useCreator(user, username),
    { passedNotesFromTest } = props,
    [displayedNotes, setDisplayedNotes] = useState([]);

  // When Question Notes are passed via props for test
  useEffect(() => {
    let n = passedNotesFromTest ? passedNotesFromTest : categoryNotes;
     setDisplayedNotes(n);
  }, [passedNotesFromTest, categoryNotes]);
  // For future enhancement
  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
  }, [autoPlay]);

  // When notes questions are updated
  useEffect(() => {
    // Clear question notes
    setQuestionNotes([]);
    // Hides all forms
    setFormDisplayed("");
  }, [categoryNotes, categoryQuestions]);

  // When the displayed form changes
  useEffect(() => {
    // if Question is being updated
    if (formDisplayed.includes("#question")) {
      // Find Question being updated
      let q = categoryQuestions.find(v => v.pathName === formDisplayed);
      // Set questionNotes to be question's notes
      setQuestionNotes(q && q.questionNotes ? q.questionNotes : [] );
    }
    // if there are no forms being displayed
    if (formDisplayed === "") {
      // Clear questionNotes
      setQuestionNotes([]);
    }
  }, [formDisplayed]);

  return (
    <div className="notes-component component">
      {isCreator && !passedNotesFromTest && (
        <>
          <div>
            <button
              className="create-button"
              type="button"
              onClick={() => setFormDisplayed(updateDisplayedForm("note"))}
            >
              {formDisplayed !== "note" ? "Create Note" : "Hide Note Form"}
            </button>
            <button
              className="create-button"
              type="button"
              onClick={() => setFormDisplayed(updateDisplayedForm("question"))}
            >
              {formDisplayed !== "question"
                ? "Create Question"
                : "Hide Question Form"}
            </button>
          </div>
          {formDisplayed === "note" && <NoteForm />}

        </>
      )}

    </div>
  );
  // LINE 91
  // <div className="container">
  //   {displayedNotes.map((note, ind) => {
  //     return (
  //       <Note
  //         key={note.pathName}
  //         {...{
  //           note,
  //           formDisplayed,
  //           updateQuestionNote,
  //           nextAutoPlayIndex,
  //           questionNotes
  //         }}
  //       />
  //     );
  //   })}
  // </div>
  // LINE 88
  // {formDisplayed === "question" && (
  //   <NoteContext.Provider value={{ questionNotes }}>
  //     <QuestionForm />
  //   </NoteContext.Provider>
  // )}
  // <NoteContext.Provider
  //   value={{ questionNotes, formDisplayed, setFormDisplayed }}
  // >
  //   <Questions />
  // </NoteContext.Provider>

  function updateDisplayedForm(str) {
    return formDisplayed !== str ? str : "";
  }

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
