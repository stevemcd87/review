import React, { useState, useEffect, useContext, useRef } from "react";
import AudioNote from "./AudioNote";
import NoteTable from "../Notes/NoteTable/NoteTable";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Markdown from "react-textarea-markdown";
function NoteForm(props) {
  let { subjectName, categoryName, username, setDisplayForm } = useParams(),
    { note } = props,
    imageInput = useRef(null),
    mainNoteDiv = useRef(null),
    [imageSrc, setImageSrc] = useState(),
    [imageFile, setImageFile] = useState(),
    [imageUpdated, setImageUpdated] = useState(false),
    [noteTable, setNoteTable] = useState(note ? note.noteTable : {}),
    [mainNote, setMainNote] = useState(note ? note.mainNote : ""),
    [audioBlob, setAudioBlob] = useState(),
    [audioNoteUpdated, setAudioNoteUpdated] = useState(false),
    [submitting, setSubmitting] = useState(false),
    noteArray = useRef(null),
    { getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {}, [imageFile]);

  useEffect(() => {
    let textarea = mainNoteDiv.current.getElementsByClassName(
        "markdown-textarea"
      )[0],
      scrollHeight = textarea.scrollHeight;
    if (scrollHeight > 100) textarea.style.height = `${scrollHeight}px`;
  }, [mainNote]);

  useEffect(() => {
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      setImageUpdated(true);
      setImageSrc(imageUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    if (note && note.image) getImage();
  }, []);

  function getImage() {
    Storage.get(note.image.replace("public/", ""))
      .then(setImageSrc)
      .catch(err => {
        alert(err);
        console.log(err);
      });
  }

  return (
    <div className="note-form-component form-component">
      <form className="note-form-content">
        <AudioNote
          {...{ note, audioBlob, setAudioBlob, setAudioNoteUpdated }}
        />
        <div className="image-input">
          <label className=" image-label form-label">
            Image
            <input
              type="file"
              onChange={e => setImageFile(e.target.files["0"])}
              ref={imageInput}
            />
          </label>
          {imageSrc && <img src={imageSrc} />}
        </div>
        <NoteTable
          setTableData={setNoteTable}
          tableData={note && note.noteTable ? note.noteTable : null}
        />
        <div className="main-note" ref={mainNoteDiv}>
          <Markdown
            textarea={true}
            callback={setMainNote}
            source={mainNote}
            customWidth={[90, 90]}
          />
        </div>

        <button type="button" onClick={prepNote} disabled={submitting}>
          {!submitting ? "Submit" : "Submitting"}
        </button>
      </form>
    </div>
  );

  function prepNote() {
    setSubmitting(true);
    let noteValues = {
      username: user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      noteTable: noteTable,
      audioNote: audioBlob ? true : false,
      image: imageFile ? true : false
    };
    if (note) noteValues.pathName = note.pathName;
    if (note && note.audioNote && !audioNoteUpdated)
      noteValues.audioNote = note.audioNote;

    if (note && note.image && !imageUpdated) noteValues.image = note.image;
    !note ? postNote(noteValues) : updateNote(noteValues);
  }

  function updateNote(n) {
    API.put(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`,
      {
        body: JSON.stringify(n)
      }
    )
      .then(response => {
        if (audioBlob && audioNoteUpdated) {
          Storage.put(response.audioNote, audioBlob)
            .then(res => {
              if (!imageFile && !imageUpdated)
                getCategoryNotes().then(() => setSubmitting(false));
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
        if (imageFile && imageUpdated) {
          Storage.put(response.image, imageFile)
            .then(res => {
              getCategoryNotes().then(() => setSubmitting(false));
            })
            .catch(err => {
              alert(err);
              console.log(err);
            });
        }
        if (!imageFile && !audioBlob) {
          getCategoryNotes().then(() => setSubmitting(false));
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function postNote(n) {
    API.post("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        if (audioBlob) {
          Storage.put(response.audioNote, audioBlob)
            .then(res => {
              // setTimeout(function() {
              if (!imageFile)
                getCategoryNotes().then(() => setSubmitting(false));
              // }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (imageFile) {
          Storage.put(response.image, imageFile)
            .then(res => {
              getCategoryNotes().then(() => setSubmitting(false));
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (!imageFile && !audioBlob) {
          getCategoryNotes().then(() => setSubmitting(false));
          setDisplayForm(false);
        }
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }
} // End of component

export default NoteForm;
