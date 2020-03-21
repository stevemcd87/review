import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRecordVinyl,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
export default function AudioNote(props) {
  let { audioBlob, setAudioBlob, setAudioNoteUpdated, note } = props,
    [mediaRecorder, setMediaRecorder] = useState(),
    // [audioBlob, setAudioBlob] = useState(),
    // [audioNote, setAudioNote] = useState(),
    [audio, setAudio] = useState(),
    [recording, setRecording] = useState(false),
    { Storage, user } = useContext(ApiContext);

  // useEffect(() => {
  //   console.log(imageSrc);
  //   if (note && note.audioNote) getAudioNote();
  // }, []);
  //
  // function getAudioNote() {
  //   Storage.get(note.audioNote.replace("public/", ""))
  //     .then(res => {
  //       setAudioNote(res);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
  // for Audio Note componentDidMount
  useEffect(() => {
    let mr, s;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      mr = new MediaRecorder(stream);
      s = stream;
      setMediaRecorder(mr);
    });
    return () => {
      if (s) {
        s.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    };
  }, []);
  useEffect(() => {
    if (mediaRecorder)
      return () => {
        mediaRecorder.removeEventListener("dataavailable", () => {});
        mediaRecorder.removeEventListener("stop", () => {});
      };
  }, [mediaRecorder]);

  useEffect(() => {
    if (audioBlob) {
      console.log(URL);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(new Audio(audioUrl));
    } else {
      setAudio(null);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (recording && mediaRecorder) {
      mediaRecorder.start();
      let audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        console.log(event);
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        setAudioBlob(new Blob(audioChunks));
      });
      console.log("recording");
    }
  }, [recording]);

  return (
    <div className="audio-note-component">
      {note && note.audioNote && (
        <div>
          <button type="button" onClick={() => playAudio(note.audioNote)}>
            Play Saved Audio Note
          </button>
        </div>
      )}
      <button type="button" disabled={recording} onClick={startRecord}>
        <FontAwesomeIcon
          icon={faRecordVinyl}
          title="Start Recording"
          size="2x"
        />
      </button>
      <button
        type="button"
        disabled={!recording}
        onClick={() => {
          mediaRecorder.stop();
          setRecording(false);
        }}
      >
        <FontAwesomeIcon icon={faStop} title="Stop Recording" size="2x" />
      </button>

      <button
        type="button"
        className="play-audio-button"
        onClick={playNewAudio}
        disabled={!audio}
      >
        <FontAwesomeIcon icon={faPlay} title="Play Recording" size="2x" />
      </button>
      <button
        type="button"
        className="delete-audio-button"
        onClick={() => setAudioBlob(null)}
        disabled={!audio}
      >
        <FontAwesomeIcon icon={faTrash} title="Delete Recording" size="2x" />
      </button>
    </div>
  );

  function playAudio(s3Key) {
    console.log(user);
    // if (!user) alert("Must sign in to listen to audio notes")
    console.log(s3Key);
    Storage.get(s3Key.replace("public/", ""))
      .then(res => {
        console.log("play audio res");
        console.log(typeof res);
        // setAudioBlob(res);
        new Audio(res).play();
      })
      .catch(err => {
        console.log(err);
      });
  }

  function startRecord() {
    if (!mediaRecorder) return alert("No Access to microphone");
    let confirmed = true;
    if (note && note.audioNote) {
      confirmed = window.confirm(
        "Recording will override your previous Audio Note, would you like to continue?"
      );
    }
    if (confirmed && mediaRecorder) {
      setRecording(true);
      setAudioNoteUpdated(true);
    }
  }

  function playNewAudio() {
    console.log("playnew audio");
    audio.play();
  }
} // end of component
