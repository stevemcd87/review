import React, { useState, useEffect, useContext, useRef } from "react";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

function Note(props) {
  let { note, active, nextAutoPlayIndex } = props,
    { API, Storage, user } = useContext(ApiContext),
    { subjectName, categoryName, username } = useParams(),
    noteDiv = useRef(),
    [userIsCreator, setUserIsCreator] = useState(checkForUsername()),
    [imageSrc, setImageSrc] = useState(),
    [displayForm, setDisplayForm] = useState(false),
    { categoryNotes, getCategoryNotes } = useContext(CategoryContext);

  // for Note Image
  useEffect(() => {
    if (note.image) getImage();
  }, []);

  useEffect(() => {
    setDisplayForm(false);
    if (note.image) getImage();
  }, [categoryNotes]);

  useEffect(() => {
    setUserIsCreator(checkForUsername());
  }, [user]);

  // for active prop
  useEffect(() => {
    if (active) {
      playAudio();
      noteDiv.current.classList.add("active");
    } else {
      noteDiv.current.classList.remove("active");
    }
  }, [active]);

  function getImage() {
    Storage.get(note.image)
      .then(res => setImageSrc(res))
      .catch(err => console.log(err));
  }

  function playAudio() {
    if (note && note.audioNote) {
      Storage.get(`${note.audioNote}`)
        .then(res => {
          let a = new Audio(res);
          a.play();
          a.addEventListener("ended", function() {
            if (active) {
              setTimeout(() => {
                nextAutoPlayIndex();
              }, 1500);
            }
            console.log("ended");
            a.removeEventListener("ended", () => {});
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      if (active) {
        setTimeout(() => {
          nextAutoPlayIndex();
        }, 1500);
      } else {
        alert("no Audio Note");
      }
    }
  }

  return (
    <div className="note-component" ref={noteDiv}>
      {userIsCreator && (
        <div className="request-buttons">
          <button
            className="edit-button "
            onClick={() => setDisplayForm(!displayForm)}
          >
            <FontAwesomeIcon icon={faEdit} size="2x" title="Edit Note" />
          </button>
          <button
            className="delete-button "
            onClick={() =>
              window.confirm("Are you sure you'd like to delete this note?")
                ? deleteNote(note)
                : false
            }
          >
            <FontAwesomeIcon icon={faTrash} size="2x" title="Delete Note" />
          </button>
        </div>
      )}
      {displayForm && <NoteForm {...{ note }} />}
      {!displayForm && (
        <div className="note">
          {note.audioNote && (
            <div className="audio-note-siv">
              <button onClick={() => playAudio()}>
                <FontAwesomeIcon
                  icon={faPlay}
                  title="Play Audio Note"
                  size="2x"
                />
              </button>
            </div>
          )}
          {note.image && <img src={imageSrc} />}
          {note.mainNote && <h5>{note.mainNote}</h5>}
          <div className="subnotes">
            {note.subnotes &&
              note.subnotes.map((n, i) => (
                <p className="subnote" key={n + i}>
                  <span className="subnote-dash">-</span>
                  {n}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  function checkForUsername() {
    return user && user.username === username ? true : false;
  }

  function deleteNote(n) {
    console.log("deleteNote");
    API.del(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`,
      {
        body: JSON.stringify({
          username: user.username,
          pathName: n.pathName
        })
      }
    )
      .then(response => {
        console.log("delete note response");
        console.log(response);
        getCategoryNotes();
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default Note;
