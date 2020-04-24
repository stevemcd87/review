import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import SubjectForm from "./SubjectForm";
import useCreator from "../customHooks/useCreator";
function Subject(props) {
  let { API, user, Auth } = useContext(ApiContext),
    { subject, getSubjects } = useContext(SubjectContext),
    [displayUpdateForm, setDisplayUpdateForm] = useState(false),
    isCreator = useCreator(user, subject.username);

  useEffect(() => {
    if (displayUpdateForm) setDisplayUpdateForm(false);
  }, [subject]);

  return (
    <div className="subject-component item">
      <div className="subject item-content">
        {isCreator && (
          <div className="subject-edit-buttons edit-buttons">
            <button
              type="button"
              onClick={() => setDisplayUpdateForm(!displayUpdateForm)}
            >
              <FontAwesomeIcon
                icon={faEdit}
                size="2x"
                color="grey"
                title="Edit Subject"
              />
            </button>
            <button
              type="button"
              onClick={() =>
                window.confirm("Are you sure you'd like to delete?")
                  ? deleteSubject()
                  : false
              }
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                color="grey"
                title="Delete Subject"
              />
            </button>
          </div>
        )}
        {!displayUpdateForm && (
          <>
            <h4>{subject.username}</h4>
            <h3>
              <Link to={`/${subject.username}/${subject.pathName}`}>
                {subject.navName}
              </Link>
            </h3>
            <h4>{subject.subjectDesc}</h4>
          </>
        )}
        {isCreator && displayUpdateForm && <SubjectForm {...{ subject }} />}
      </div>
    </div>
  );

  async function deleteSubject() {
    // Confirms user is signed in
    if (!user || !user.username) return alert("Must Sign In");
    // Confirms user deleting is the creator of data
    if (!isCreator) return alert("Not Authorized to delete this data");
    return await API.del(
      "StuddieBuddie",
      `/users/${user.username}/subjects/${subject.pathName}`,
      {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`
        },
        response: true
      }
    )
      .then(response => {
        getSubjects();
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  }
} // End of Component

export default Subject;
