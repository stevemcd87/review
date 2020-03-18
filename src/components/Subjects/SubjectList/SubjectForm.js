import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";

function SubjectForm(props) {
  let { API, user, Auth } = useContext(ApiContext),
    { getSubjects } = useContext(SubjectContext),
    { subject } = props,
    nameValue = subject ? subject.navName : "",
    descValue = subject ? subject.subjectDesc : "",
    [name, setName] = useState(nameValue),
    [desc, setDesc] = useState(descValue);
  useEffect(() => {
    if (user) {
      Auth.currentSession().then(v => {
        console.log("currentSession");
        console.log(v);
      });
    }
  }, []);
  return (
    <div className="subject-form-component form-component">
      <h3>Create Subject to Study</h3>
      <form id="subject-form">
        <textarea
          type="text"
          onChange={e => setName(e.target.value)}
          value={name}
          disabled={nameValue ? true : false}
          placeholder="Subject's Name or Book Title"
        />
        <textarea
          type="text"
          onChange={e => setDesc(e.target.value)}
          defaultValue={desc}
          placeholder="Brief Description"
        />
        <button type="button" onClick={!subject ? submitForm : updateForm}>
          {!subject ? "submitForm" : "updateForm"}
        </button>
      </form>
    </div>
  );
  async function submitForm() {
    return await API.post("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        subjectName: name.trim(),
        subjectDesc: desc.trim(),
        username: user.username
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
        console.log(error.response);
      });
  }

  function updateForm() {
    API.put("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        username: user.username,
        pathName: subject.pathName,
        subjectDesc: desc
      })
    })
      .then(response => {
        console.log(response);
        getSubjects();
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default SubjectForm;
