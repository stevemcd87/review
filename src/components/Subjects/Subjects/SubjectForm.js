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
    [desc, setDesc] = useState(descValue),
    [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (user) {
      Auth.currentSession().then(v => {
        console.log("currentSession");
        console.log(v);
      });
    }
  }, []);

  // <h3>Create Subject to Study</h3>
  return (
    <div className="form-component">
      <form >
        <label>
          <span>Subject's Name</span>

          <textarea
            type="text"
            className="form-textarea"
            onChange={e => setName(e.target.value)}
            value={name}
            disabled={nameValue ? true : false}
            placeholder="Subject's Name or Book Title"
          />
        </label>
        <label>
          <span>Subject's Description</span>
          <textarea
            type="text"
            className="form-textarea"
            onChange={e => setDesc(e.target.value)}
            defaultValue={desc}
            placeholder="Brief Description"
          />
        </label>
        <button
          type="button"
          disabled={submitting}
          onClick={!subject ? submitForm : updateForm}
        >
          {!submitting ? "submit" : "submitting"}
        </button>
      </form>
    </div>
  );
  function startWithLetter(str) {
    return str
      .trim()
      .toLowerCase()
      .match(/^[a-z]/)
      ? true
      : false;
  }
  async function submitForm() {
    if (!startWithLetter(name) || !startWithLetter(desc))
      return alert("Name and Description must begin with a letter");
    setSubmitting(true);

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

        getSubjects().then(() => setSubmitting(false));
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
      });
  }

  function updateForm() {
    if (!startWithLetter(name) || !startWithLetter(desc))
      return alert("Name and Description must begin with a letter");
    setSubmitting(true);
    API.put("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        username: user.username,
        pathName: subject.pathName,
        subjectDesc: desc
      })
    })
      .then(response => {
        console.log(response);
        getSubjects().then(() => setSubmitting(false));
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default SubjectForm;
