import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";
import CategoryListDetail from "./CategoryListDetail";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading";
import useCreator from "../customHooks/useCreator";
import Notes from "../Notes/Notes";

function SubjectDetail() {
  let { subjectName, username } = useParams(),
    { API, user, Auth } = useContext(ApiContext),
    [subject, setSubject] = useState({}),
    [isLoading, setIsLoading] = useState(true),
    [categories, setCategories] = useState([]),
    isCreator = useCreator(user, username),
    [displayCategoryForm, setDisplayCategoryForm] = useState(false);
  // { subject } = useContext(SubjectContext);
  useEffect(() => {
    // let isSubsribed = true;
    getSubject().then(res => {
      // if (isSubsribed) {
      // setSubject(res[0]);
      // let c = res.slice(1).map(v => {
      //   let urlName = v.pathName.split("#")[1].split("_")[1];
      //   return {
      //     name: urlName.replace(/-/g, " "),
      //     desc: v.categoryDesc,
      //     pathName: v.pathName,
      //     urlName: urlName,
      //     username: v.username
      //   };
      // });
      // setCategories(c);
      setIsLoading(false);
      // }
    });
    // return () => (isSubsribed = false);
  }, []);

  useEffect(() => {
    setDisplayCategoryForm(false);
  }, [subject]);

  return (
    <div className="component">
      <button className="back-button">
        <Link to={`/`}>Back</Link>
      </button>
      {isLoading && <Loading />}
      <div className="subject-detail">
        <h2>{subject.navName}</h2>
        <h3>{subject.subjectDesc}</h3>
      </div>
      {isCreator && (
        <>
          <button
            className="create-button"
            type="button"
            onClick={() => setDisplayCategoryForm(!displayCategoryForm)}
          >
            {!displayCategoryForm ? "Create Category" : "Hide Form"}
          </button>
          {displayCategoryForm && <CategoryForm {...{ subject, getSubject }} />}
        </>
      )}
      <div className="categories container">
        {categories.map(c => {
          return (
            <CategoryListDetail
              key={c.pathName}
              category={c}
              getSubject={getSubject}
              subject={subject}
            />
          );
        })}
      </div>
    </div>
  );

  async function getSubject() {
    return await API.get(
      "StuddieBuddie",
      `/users/${username}/subjects/${subjectName}`
    )
      .then(res => {
        setSubject(res[0]);
        let c = res.slice(1).map(v => {
          let urlName = v.pathName.split("#")[1].split("_")[1];
          return {
            name: urlName.replace(/-/g, " "),
            desc: v.categoryDesc,
            pathName: v.pathName,
            urlName: urlName,
            username: v.username
          };
        });
        setCategories(c);
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  }
}

export default SubjectDetail;
