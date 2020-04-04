import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
import NoteForm from "./NoteForm";
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
    { categoryNotes } = useContext(CategoryContext),
    { user } = useContext(ApiContext),
    isCreator = useCreator(user, username);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
    console.log(autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    setDisplayNoteForm(false);
  }, [categoryNotes]);

  //         <button
  //   className="create-button"
  //   type="button"
  //   onClick={() => setAutoPlay(!autoPlay)}
  // >
  //   {autoPlay ? "Stop AutoPlay" : "Auto Play Notes"}
  // </button>

  return (
    <div className="notes-component component">
        {isCreator && (
            <button
              className="create-button"
              type="button"
              onClick={() => setDisplayNoteForm(!displayNoteForm)}
            >
              {!displayNoteForm ? "Create Note" : "Hide Form"}
            </button>
        )}
      {isCreator && displayNoteForm && <NoteForm />}

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

  // function checkForUsername() {
  //   return user && user.username === username ? true : false;
  // }

  function nextAutoPlayIndex() {
    console.log("nextautoPlay");
    if (autoPlayIndex < categoryNotes.length - 1) {
      setAutoPlayIndex(autoPlayIndex + 1);
    } else {
      setAutoPlayIndex(null);
      console.log("finished");
    }
  }
}

export default Notes;
