import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";
import "./Subjects.css";
export default function CategoryListDetail(props) {
  let {category} = props,
    { API, user, Auth } = useContext(ApiContext),
    {  getSubjects } = useContext(SubjectContext),
    { subjectName, username } = useParams(),
    [displayUpdateForm, setDisplayUpdateForm] = useState(false);
  // [displayDesc, setDisplayDesc] = useState(false);


  // name: urlName.replace(/-/g, " "),
  // desc: v.categoryDesc,
  // pathName: v.pathName,
  // urlName: urlName

  useEffect(() => {
    console.log('category');
    console.log(category);
    setDisplayUpdateForm(false);
  }, [category]);
  return (
    <div className="category-component">
      <div className="category">
      <div>
      {checkUsername() && (
        <div className="category-edit-buttons edit-buttons">
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
          <button type="button" onClick={deleteCategory}>
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
          <h3>
            <Link to={`/${category.username}/${subjectName}/${category.urlName}`}>
              {category.name}
            </Link>
          </h3>
          <h4>{category.desc}</h4>
        </>
      )}
      {displayUpdateForm && <CategoryForm {...{ category }} />}
      </div>

      </div>

    </div>
  );

  function checkUsername() {
    return true
    // return user && user.username === category.username ? true : false;
  }

  async function deleteCategory() {
    // TODO: delete all items for category
    console.log("deleteSubject");
    return await API.del("StuddieBuddie", "/categorys", {
      body: JSON.stringify({
        username: user.username,
        pathName: category.pathName
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
