import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import SubjectForm from "./SubjectForm";
import "./Subjects.css";
function Subject(props) {
  let { API, user, Auth } = useContext(ApiContext),
    { subject, getSubjects } = useContext(SubjectContext),
    [displayUpdateForm, setDisplayUpdateForm] = useState(false);
  // [displayDesc, setDisplayDesc] = useState(false);

  useEffect(() => {
    setDisplayUpdateForm(false);
  }, [subject]);
  // <button type="button" onClick={() => setDisplayDesc(!displayDesc)}>
  //   {!displayDesc && <FontAwesomeIcon icon={faArrowDown} />}
  //   {displayDesc && <FontAwesomeIcon icon={faArrowUp} />}
  // </button>
  return (
    <div className="subject-component">
      <div className="subject">
        {checkUsername() && (
          <div className="subject-edit-buttons">
            <button
              type="button"
              onClick={() => setDisplayUpdateForm(!displayUpdateForm)}
            >
              <FontAwesomeIcon icon={faEdit} size="2x" />
            </button>
            <button type="button" onClick={deleteSubject}>
              <FontAwesomeIcon icon={faTrash} size="2x" />
            </button>
          </div>
        )}
        <h3>
          <Link to={`/subjects/${subject.username}/${subject.pathName}`}>{subject.navName}</Link>
      </h3>
        <h4>{subject.subjectDesc}</h4>
      </div>
      {displayUpdateForm && <SubjectForm {...{ subject }} />}
    </div>
  );

  function checkUsername() {
    return user && user.username === subject.username ? true : false;
  }

  async function deleteSubject() {
    // TODO: delete all items for subject
    console.log("deleteSubject");
    return await API.del("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        username: user.username,
        pathName: subject.pathName
      }),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      },
      response: true
    })
      .then(response => {
        console.log(response);
        getSubjects();
      })
      .catch(error => {
        console.log(error);
      });
  }
} // End of Component

export default Subject;
