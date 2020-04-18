import React, { useState, useEffect, useContext, useRef } from "react";
import NoteForm from "./NoteForm";
import NoteTable from "../Notes/NoteTable/NoteTable";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTrash,
  faEdit,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading";
import useCreator from "../customHooks/useCreator";
import Markdown from "react-textarea-markdown";
function Note(props) {
  let {
      note,
      isActive,
      nextAutoPlayIndex,
      updateQuestionNote,
      displayQuestionForm
    } = props,
    { API, Storage, user } = useContext(ApiContext),
    { subjectName, categoryName, username } = useParams(),
    noteDiv = useRef(),
    [imageSrc, setImageSrc] = useState(),
    [klassName, setKlassName] = useState(),
    [displayForm, setDisplayForm] = useState(false),
    { categoryNotes, getCategoryNotes } = useContext(CategoryContext),
    isCreator = useCreator(user, username);

  // for Note Image
  useEffect(() => {
    if (note.image) getImage();
  }, []);

  useEffect(() => {
    setDisplayForm(false);
    if (note.image) getImage();
    // .then(() => setImageLoading(false))
  }, [categoryNotes]);

  // for isActive prop
  useEffect(() => {
    // if (isActive) {
    //   playAudio();
    //   noteDiv.current.classList.add("isActive");
    // } else {
    //   noteDiv.current.classList.remove("isActive");
    // }
  }, [isActive]);

  function getImage() {
    Storage.get(note.image)
      .then(res => setImageSrc(res))
      .catch(err => console.log(err));
  }

  function playAudio() {
    // if (!user) return alert("Must sign in to listen to audio notes")
    if (note && note.audioNote) {
      Storage.get(`${note.audioNote}`)
        .then(res => {
          let a = new Audio(res);
          a.play();
          a.addEventListener("ended", function() {
            if (isActive) {
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
      if (isActive) {
        setTimeout(() => {
          nextAutoPlayIndex();
        }, 1500);
      } else {
        alert("no Audio Note");
      }
    }
  }

  return (
    <div className=" item" ref={noteDiv}>
      <div className="item-content">
        {isCreator && (
          <div className="edit-buttons">
            <button
              className="edit-button "
              onClick={() => setDisplayForm(!displayForm)}
            >
              <FontAwesomeIcon
                icon={faEdit}
                size="2x"
                title="Edit Note"
                color="grey"
              />
            </button>
            {displayQuestionForm && (
              <button
                type="button"
                title="Bind note to question"
                className="add-qn-button"
                onClick={()=>updateQuestionNote(note, isActive)}
              >
                <FontAwesomeIcon icon={isActive ? faMinus : faPlus} size="3x" />
              </button>
            )}
            <button
              className="delete-button "
              onClick={() =>
                window.confirm("Are you sure you'd like to delete this note?")
                  ? deleteNote(note)
                  : false
              }
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                title="Delete Note"
                color="grey"
              />
            </button>
          </div>
        )}
        {isCreator && displayForm && <NoteForm {...{ note }} />}
        {!displayForm && (
          <div className="note">
            {note.audioNote && (
              <div className="audio-note-div">
                <button onClick={() => playAudio()}>
                  <FontAwesomeIcon
                    icon={faPlay}
                    title="Play Audio Note"
                    size="2x"
                    color="grey"
                  />
                </button>
              </div>
            )}
            {note.noteTable && <NoteTable tableData={note.noteTable} />}
            {note.image && <img src={imageSrc} />}
            <Markdown
              textarea={false}
              source={note.mainNote}
              customWidth={[98, 98]}
            />
          </div>
        )}
      </div>
    </div>
  );

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
