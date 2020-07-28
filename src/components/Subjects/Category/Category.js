import React, { useState, useEffect, useContext } from "react";

// Components
import Test from "../Questions/Test/Test";
import Loading from "../Loading";
import Notes from "../Notes/Notes";
import Questions from "../Questions/Questions";
// Contexts
import CategoryContext from "../../../contexts/CategoryContext";
import ApiContext from "../../../contexts/ApiContext";
// Styles
import "./Category.css";

import {
  // BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

export default function Category() {
  let { path, url } = useRouteMatch(),
    { username, subjectName, categoryName } = useParams(),
    [categoryNotes, setCategoryNotes] = useState([]),
    [categoryQuestions, setCategoryQuestions] = useState([]),
    [testKey, setTestKey] = useState(0),
    [isLoading, setIsLoading] = useState(true),
    { API } = useContext(ApiContext);
  useEffect(() => {
    getCategoryNotes().then(() => setIsLoading(false));
    // getCategoryQuestions();
  }, []);

  useEffect(() => {
    console.log(categoryNotes);
    console.log(categoryQuestions);
  }, [categoryNotes, categoryQuestions]);

  return (
    <div className="component">
      <button type="button" className="back-button">
        <Link to={`/${username}/${subjectName}/`}>Back</Link>
      </button>
      <h2>{categoryName.replace(/-/g, " ")}</h2>
      {categoryQuestions.length > 0 && (
        <nav className="item category-nav">
          <ul className=" item-content">
            <li>
              <Link to={`${url}/notes`}>Review Notes</Link>
            </li>
            <li>
              <Link to={`${url}/test`}>Test</Link>
            </li>
          </ul>
        </nav>
      )}

      {isLoading && <Loading />}
      <Switch>
        <Route exact path={path}>
          <h1>hey</h1>
        </Route>
        <Route path={`${path}/notes`}>
          <h1>hey</h1>
        </Route>
        <Route path={`${path}/test`}>
          <h1>hey</h1>
        </Route>
      </Switch>

    </div>
  );
  // <Route exact path={path}>
  //   <CategoryContext.Provider
  //     value={{ categoryNotes, getCategoryNotes, categoryQuestions }}
  //   >
  //     <Notes />
  //   </CategoryContext.Provider>
  // </Route>
  // <Route path={`${path}/notes`}>
  //   <CategoryContext.Provider
  //     value={{ categoryNotes, getCategoryNotes, categoryQuestions }}
  //   >
  //     <Notes />
  //   </CategoryContext.Provider>
  // </Route>
  // <Route path={`${path}/test`}>
  //   <CategoryContext.Provider value={{ categoryQuestions }}>
  //     <Test key={testKey} {...{ retakeTest }} />
  //   </CategoryContext.Provider>
  // </Route>



  function retakeTest() {
    setTestKey(testKey + 1);
  }

  async function getCategoryNotes() {
    return await API.get(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}`,
      {
        queryStringParameters: {
          username: username
        }
      }
    )
      .then(res => {
        setCategoryNotes(res.filter(v => !v.pathName.includes("question")));
        setCategoryQuestions(res.filter(v => v.pathName.includes("question")));
      })
      .catch(alert);
  }
} // end of component
