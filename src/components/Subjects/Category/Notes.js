import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Notes(props) {
  let { username } = useParams(),
    [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    { categoryNotes } = useContext(CategoryContext),
    { user } = useContext(ApiContext);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
    console.log(autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    setDisplayNoteForm(false);
  }, [categoryNotes]);
  return (
    <div className="notes-component">
      <div className="notes-component-buttons">
        {checkForUsername() && (
          <button
            className="create-button"
            type="button"
            onClick={() => setDisplayNoteForm(!displayNoteForm)}
          >
            {!displayNoteForm ? "Create Note" : "Hide Form"}
          </button>
        )}
        <button
          className="create-button"
          type="button"
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? "Stop AutoPlay" : "Auto Play Notes"}
        </button>
      </div>

      {displayNoteForm && <NoteForm  />}
      <div className="notes">
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

  function checkForUsername() {
    return user && user.username === username ? true : false;
  }

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
