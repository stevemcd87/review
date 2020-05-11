import React, { useState, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import { useParams } from "react-router-dom";

export default function CategoryForm(props) {
  let {  getSubject, category } = props,
    { API, Auth, user } = useContext(ApiContext),
    { subjectName } = useParams(),
    nameValue = category ? category.name : "",
    descValue = category ? category.desc : "",
    [categoryName, setCategoryName] = useState(nameValue),
    [categoryDesc, setCategoryDesc] = useState(descValue),
    [submitting, setSubmitting] = useState(false);
  return (
    <div className="form-component">
      <form>
        <label>
          <span>Category Name</span>
          <textarea
            type="text"
            className="form-textarea"
            onChange={e => setCategoryName(e.target.value)}
            defaultValue={categoryName}
            placeholder="Category Name"
            disabled={category && category.name ? true : false}
          />
        </label>
        <label>
          <span>Category Description</span>
          <textarea
            className="form-textarea"
            onChange={e => setCategoryDesc(e.target.value)}
            defaultValue={categoryDesc}
            placeholder="Category Description"
          />
        </label>
        <button disabled={submitting} type="button" onClick={submitForm}>
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
    // initially assumes user is creating subject
    let apiMethod = "post",
      // path for backend api
      resourcePath = `/users/${user.username}/subjects/${subjectName}/categories`;
    // subject being passed via props signifies update
    if (category) {
      // Updates api method to update
      apiMethod = "put";
      // Appends pathName for updates
      // NOTE: Must supply pathName, not name, when updating category
      resourcePath += `/${categoryName}`; //
    }
    // Validates form inputs
    if (!startWithLetter(categoryName) || !startWithLetter(categoryDesc))
      return alert("Name and Description must begin with a letter");
    // Confirms user is signed in
    if (!user || !user.username) return alert("Must Sign In");
    // Disables submit button
    setSubmitting(true);
    return await API[apiMethod]("StuddieBuddie", resourcePath, {
      body: JSON.stringify({
        categoryName: categoryName.trim(),
        categoryDesc: categoryDesc.trim(),
        pathName: category ? category.pathName : ""
      }),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      },
      response: true
    })
      .then(response => {
        getSubject();
      })
      .catch(error => {
        setSubmitting(false);
        alert(error.response);
        console.log("error");
        console.log(error.response);
      });
  }
}
