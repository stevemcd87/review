import React, { useState, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import { useParams } from "react-router-dom";

export default function CategoryForm(props) {
  let { subject, getSubject, category } = props,
    { API, user } = useContext(ApiContext),
    { subjectName, username } = useParams(),
    nameValue = category ? category.name : "",
    descValue = category ? category.desc : "",
    [categoryName, setCategoryName] = useState(nameValue),
    [categoryDesc, setCategoryDesc] = useState(descValue);
  return (
    <div className="category-form-component form-component">
    <form className="category-form ">
      <textarea
        type="text"
        onChange={e => setCategoryName(e.target.value)}
        defaultValue={categoryName}
        placeholder="Category Name"
      />
    <textarea
        onChange={e => setCategoryDesc(e.target.value)}
        defaultValue={categoryDesc}
        placeholder="Category Description"
      />
    <button type="button" onClick={()=>(!category) ? postCategory() : updateCategory() }>
        Create Category
      </button>
    </form>
  </div>
  );
  function postCategory() {
    API.post("StuddieBuddie", `/subjects/${subject.pathName}`, {
      body: JSON.stringify({
        categoryName: categoryName.trim(),
        categoryDesc: categoryDesc.trim(),
        username: user.username
        // pathName: subject.pathName
      })
    })
      .then(response => {
        console.log("response postCategory");
        console.log(response);
        getSubject();
      })
      .catch(error => {
        console.log("err postCategory");
        console.log(error.response);
      });
  }

  function updateCategory(c) {
    console.log("updateCategory");
    API.put("StuddieBuddie", `/subjects/${subject.pathName}`, {
      body: JSON.stringify({
        username: username,
        pathName: c.pathName,
        categoryDesc: categoryDesc.trim()
      })
    })
      .then(response => {
        console.log("response");
        console.log(response);
        getSubject();
      })
      .catch(error => {
        console.error(error.response);
      });
  }

}
