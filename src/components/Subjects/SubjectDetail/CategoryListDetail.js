import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";
// import "./Subjects.css";
import useCreator from "../customHooks/useCreator";
export default function CategoryListDetail(props) {
  let { category, subject, getSubject } = props,
    { API, user, Auth } = useContext(ApiContext),
    // { getSubjects } = useContext(SubjectContext),
    { subjectName, username } = useParams(),
    isCreator = useCreator(user, username),
    [displayUpdateForm, setDisplayUpdateForm] = useState(false);
  useEffect(() => {
    // console.log(subject);
    setDisplayUpdateForm(false);
  }, [subject, category]);
  // [displayDesc, setDisplayDesc] = useState(false);

  // name: urlName.replace(/-/g, " "),
  // desc: v.categoryDesc,
  // pathName: v.pathName,
  // urlName: urlName

  // useEffect(() => {
  //   setDisplayUpdateForm(false);
  // }, []);

  return (
    <div className="component item">
      <div className="category model item-content">
        {isCreator && (
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
            <button
              type="button"
              onClick={() =>
                window.confirm("Are you sure you'd like to delete?")
                  ? deleteCategory()
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
            <h3>
              <Link
                to={`/${category.username}/${subjectName}/${category.urlName}`}
              >
                {category.name}
              </Link>
            </h3>
            <h4>{category.desc}</h4>
          </>
        )}
        {isCreator && displayUpdateForm && (
          <CategoryForm {...{ category, getSubject }} />
        )}
      </div>
    </div>
  );

  // function checkUsername() {
  //   return user && user.username === category.username ? true : false;
  // }

  async function deleteCategory() {
    return await API.del(
      "StuddieBuddie",
      `/users/${username}/subjects/${subjectName}/categories/${category.name}`,
      {
        body: JSON.stringify({
          pathName: category.pathName
        }),
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`
        },
        response: true
      }
    )
      .then(response => {
        getSubject();
      })
      .catch(error => {
        alert(error);
        console.error(error.response);
      });
  }
} // End of Component
