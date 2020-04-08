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
    [mainNote, setMainNote] = useState(note ? note.mainNote : ""),
    [audioBlob, setAudioBlob] = useState(),
    [audioNoteUpdated, setAudioNoteUpdated] = useState(false),
    [subnotes, setSubnotes] = useState([]),
    [submitting, setSubmitting] = useState(false),
    noteArray = useRef(null),
    { getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
  }, [imageFile]);

  useEffect(()=>{
    let textarea = mainNoteDiv.current.getElementsByClassName("markdown-textarea")[0],
      scrollHeight = textarea.scrollHeight;
    if (scrollHeight > 100) textarea.style.height = `${scrollHeight}px`;
  },[mainNote])




  // for SubNotes if updating note
  useEffect(() => {
    if (note && note.subnotes) {
      setSubnotes(note.subnotes);
    }
  }, []);

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
          <p className=" image-label form-label">Image</p>
          <input
            type="file"
            onChange={e => setImageFile(e.target.files["0"])}
            ref={imageInput}
          />
          {imageSrc && <img src={imageSrc} />}
        </div>
        <NoteTable />
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

  //

  //====== OLD VERSION ========
  // <textarea
  //   className="note-mainNote form-textarea"
  //   defaultValue={mainNote}
  //   onChange={e => setMainNote(e.target.value)}
  //   placeholder="Title of Note or Note"
  // />
  // <div className="sub-note-array" ref={noteArray}>
  //   {subnotes.map((sn, ind) => (
  //     <Subnote key={sn + ind} subnote={sn} {...{ removeSubnote, ind }} />
  //   ))}
  // </div>
  // <button type="button" onClick={addSubnote} className="add-subnote">
  //   <FontAwesomeIcon icon={faPlus} title="Add Subnote" />
  // </button>

  function prepNote() {
    setSubmitting(true);
    let noteValues = {
      username: user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      // subnotes: [],
      audioNote: audioBlob ? true : false,
      image: imageFile ? true : false
    };
    if (note) noteValues.pathName = note.pathName;
    if (note && note.audioNote && !audioNoteUpdated)
      noteValues.audioNote = note.audioNote;

    if (note && note.image && !imageUpdated) noteValues.image = note.image;
    // for subNotes
    // console.log("noteValues");
    // console.log(noteValues);
    // [...noteArray.current.querySelectorAll(".subnote-input")].forEach(
    //   noteElement => {
    //     noteValues.subnotes.push(noteElement.value);
    //   }
    // );
    // console.log(note);
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
              console.log("err");
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
    console.log("n");
    console.log(n);
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

  function addSubnote() {
    let sn = subnotes.slice();
    sn.push("");
    setSubnotes(sn);
  }

  function removeSubnote(ind) {
    let sn = subnotes.slice();
    sn.splice(ind, 1);
    setSubnotes(sn);
  }
} // End of component
function Subnote(props) {
  let { subnote, ind, removeSubnote } = props;
  return (
    <div className="subnote">
      <span className="subnote-dash">-</span>
      <textarea
        className="subnote-input"
        placeholder="Subnote"
        defaultValue={subnote ? subnote : ""}
      />
      <button
        type="button"
        className="remove-subnote"
        onClick={() => removeSubnote(ind)}
      >
        <FontAwesomeIcon icon={faTrash} color="grey" title="Remove Subnote" />
      </button>
    </div>
  );
}
// function displayNotes(subnotesArray, setSubnotes) {
//   setSubnotes(subnotesArray.map((n, i) => <Subnote key={i} note={n} />));
// }

export default NoteForm;
