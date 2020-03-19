import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";
import CategoryListDetail from "./CategoryListDetail";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function SubjectDetail() {
  let { subjectName, username } = useParams(),
    { API, user, Auth } = useContext(ApiContext),
    [subject, setSubject] = useState({}),
    [categories, setCategories] = useState([]),
    [displayCategoryForm, setDisplayCategoryForm] = useState(false);
  // { subject } = useContext(SubjectContext);
  useEffect(() => {
    getSubject();
  }, []);

  useEffect(() => {
    console.log(subject);
    setDisplayCategoryForm(false);
  }, [subject]);

  // {categories.map(category => {
  //   return (
  //     <div key={category.pathName} className="category">
  //       <div className="category-content">
  //         {checkUsername() && (
  //           <div className="edit-buttons">
  //             <button
  //               type="button"
  //               onClick={() => updateCategory(category)}
  //             >
  //               <FontAwesomeIcon
  //                 icon={faEdit}
  //                 size="2x"
  //                 color="grey"
  //                 title="Edit Subject"
  //               />
  //             </button>
  //             <button
  //               type="button"
  //               onClick={() => deleteCategory(category)}
  //             >
  //               <FontAwesomeIcon
  //                 icon={faTrash}
  //                 size="2x"
  //                 color="grey"
  //                 title="Delete Subject"
  //               />
  //             </button>
  //           </div>
  //         )}
  //         <h3>
  //           <Link
  //             to={`/${subject.username}/${subject.pathName}/${category.urlName}`}
  //           >
  //             {category.name}
  //           </Link>
  //         </h3>
  //         <h4>{category.desc}</h4>
  //       </div>
  //     </div>
  //   );
  // })}


  return (
    <div className="subject-detail-component">
      <button className="back-button">
        <Link to={`/`}>Back</Link>
      </button>

      <div className="subject-detail">
        <h2>{subject.navName}</h2>
        <h3>{subject.subjectDesc}</h3>
      </div>
      <div className="categories">
        {categories.map((c)=><CategoryListDetail category={c} />)}
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
    </div>
  );

  function checkUsername() {
    return user && user.username === subject.username ? true : false;
  }

  function deleteCategory(c) {
    console.log("deleteCategory");
    API.del("StuddieBuddie", `/subjects/${subject.pathName}`, {
      body: JSON.stringify({
        username: username,
        pathName: c.pathName
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


  function getSubject() {
    console.log("GET subject");
    API.get("StuddieBuddie", `/subjects/${subjectName}`, {
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
