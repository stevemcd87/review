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

function SubjectDetail() {
  let { subjectName, username } = useParams(),
    { API, user, Auth } = useContext(ApiContext),
    [subject, setSubject] = useState({}),
    [isLoading, setIsLoading] = useState(true),
    [categories, setCategories] = useState([]),
    [displayCategoryForm, setDisplayCategoryForm] = useState(false);
  // { subject } = useContext(SubjectContext);
  useEffect(() => {
    getSubject().then(()=>setIsLoading(false));
  }, []);

  useEffect(() => {
    console.log(subject);
    setDisplayCategoryForm(false);
  }, [subject]);

  return (
    <div className="subject-detail-component">
      <button className="back-button">
        <Link to={`/`}>Back</Link>
      </button>
      {isLoading && <Loading />}

      <div className="subject-detail">
        <h2>{subject.navName}</h2>
        <h3>{subject.subjectDesc}</h3>
      </div>
      {checkUsername() && (
        <button
          className="create-button"
          type="button"
          onClick={() => setDisplayCategoryForm(!displayCategoryForm)}
        >
          {!displayCategoryForm ? "Create Category" : "Hide Form"}
        </button>
      )}
      {displayCategoryForm && <CategoryForm {...{ subject, getSubject }} />}
      <div className="categories">
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

  function checkUsername() {
    return user && user.username === subject.username ? true : false;
  }

  async function getSubject() {
    console.log("GET subject");
    return await API.get("StuddieBuddie", `/subjects/${subjectName}`, {
      queryStringParameters: {
        username: username
      }
    })
      .then(response => {
        console.log("res getSubject");
        console.log(response);
        setSubject(response[0]);
        let c = response.slice(1).map(v => {
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
        console.log("er");
        console.log(error);
      });
  }
}

export default SubjectDetail;
