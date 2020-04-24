import React, { useState, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";

export default function SubjectForm(props) {
  let { API, user, Auth } = useContext(ApiContext),
    { getSubjects } = useContext(SubjectContext),
    // Signifies update if subject is passed via props
    { subject } = props,
    nameValue = subject ? subject.navName : "",
    descValue = subject ? subject.subjectDesc : "",
    [name, setName] = useState(nameValue),
    [desc, setDesc] = useState(descValue),
    [submitting, setSubmitting] = useState(false);

  return (
    <div className="form-component">
      <form>
        <label>
          <span>Subject's Name</span>
          <textarea
            type="text"
            className="form-textarea"
            onChange={e => setName(e.target.value)}
            value={name}
            disabled={nameValue ? true : false}
            placeholder="Subject's Name"
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
        <button type="button" disabled={submitting} onClick={submitForm}>
          {!submitting ? "Submit" : "Submitting"}
        </button>
      </form>
    </div>
  );
  function startWithLetter(str) {
    // Returns True if arg starts with a letter
    return str
      .trim()
      .toLowerCase()
      .match(/^[a-z]/)
      ? true
      : false;
  }
  async function submitForm() {
    // initially assumes user is creating subject
    let apiMethod = "post",
      // path for backend api
      resourcePath = `/users/${user.username}/subjects`;
    // subject being passed via props signifies update
    if (subject) {
      // Updates api method to update
      apiMethod = "put";
      // Appends pathName for updates
      resourcePath += `/${subject.pathName}`;
    }
    console.log(resourcePath);
    // Validates form inputs
    if (!startWithLetter(name) || !startWithLetter(desc))
      return alert("Name and Description must begin with a letter");
    // Confirms user is signed in
    if (!user || !user.username) return alert("Must Sign In");
    // Disables submit button
    setSubmitting(true);
    return await API[apiMethod]("StuddieBuddie", resourcePath, {
      body: JSON.stringify({
        subjectName: name.trim(),
        subjectDesc: desc.trim()
      }),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      },
      response: true
    })
      .then(response => {
        getSubjects().then(() => setSubmitting(false));
      })
      .catch(error => {
        setSubmitting(false);
        alert(error.response);
        console.log('error');
        console.log(error.response);
      });
  }
}
