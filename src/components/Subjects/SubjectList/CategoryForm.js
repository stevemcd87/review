import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import { useParams } from "react-router-dom";

export default function CategoryForm(props) {
  let { subject, getSubject, category } = props,
    { API, Auth, user } = useContext(ApiContext),
    { subjectName, username } = useParams(),
    nameValue = category ? category.name : "",
    descValue = category ? category.desc : "",
    [categoryName, setCategoryName] = useState(nameValue),
    [categoryDesc, setCategoryDesc] = useState(descValue);
  return (
    <div className="category-form-component form-component">
      <form className="category-form ">
        <label>
          <span>Category Name</span>
          <textarea
            type="text"
            onChange={e => setCategoryName(e.target.value)}
            defaultValue={categoryName}
            placeholder="Category Name"
            disabled={category && category.name ? true : false}
          />
        </label>

      <label>
        <span>Category Description</span>
        <textarea
          onChange={e => setCategoryDesc(e.target.value)}
          defaultValue={categoryDesc}
          placeholder="Category Description"
        />
      </label>

        <button
          type="button"
          onClick={() => (!category ? postCategory() : updateCategory())}
        >
          {!category ? "Create" : "Update"}
        </button>
      </form>
    </div>
  );
  async function postCategory() {
    return await API.post("StuddieBuddie", `/subjects/${subjectName}`, {
      body: JSON.stringify({
        categoryName: categoryName.trim(),
        categoryDesc: categoryDesc.trim(),
        username: user.username
        // pathName: subject.pathName
      }),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      }
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

  async function updateCategory(c) {
    console.log("updateCategory");
    return API.put("StuddieBuddie", `/subjects/${subjectName}`, {
      body: JSON.stringify({
        username: username,
        pathName: category.pathName,
        categoryDesc: categoryDesc.trim()
      }),
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      }
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
