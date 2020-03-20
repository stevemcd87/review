import React, { useState, useEffect, useContext } from "react";
import Notes from "./Notes";
import CategoryContext from "../../../contexts/CategoryContext";
import ApiContext from "../../../contexts/ApiContext";
import Questions from "./Questions/Questions";
import "./Category.css";
import Loading from "../Loading"

import {
  BrowserRouter as Router,
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
    [isLoading, setIsLoading] = useState(true),
    { API, user } = useContext(ApiContext);
  useEffect(() => {
    getCategoryNotes().then(()=>setIsLoading(false));
    // getCategoryQuestions();
  }, []);

  // <ul className="category-nav">
  //   <li>
  //     <Link to={`${url}/notes`}>Review Notes</Link>
  //   </li>
  //   <li>
  //     <Link to={`${url}/test`}>Test</Link>
  //   </li>
  // </ul>

  return (
    <div className="category-component">
      <button type="button" className="back-button">
        <Link to={`/${username}/${subjectName}/`}>Back</Link>
      </button>
      <h2>{categoryName.replace(/-/g, " ")}</h2>

      {isLoading && <Loading />}

      <Switch>
        <Route exact path={path}>
          <CategoryContext.Provider value={{ categoryNotes, getCategoryNotes }}>
            <Notes />
          </CategoryContext.Provider>
        </Route>
        <Route path={`${path}/notes`}>
          <CategoryContext.Provider value={{ categoryNotes, getCategoryNotes }}>
            <Notes />
          </CategoryContext.Provider>
        </Route>
        <Route path={`${path}/test`}>
          <CategoryContext.Provider
            value={{ categoryQuestions, getCategoryQuestions }}
          >
            <Questions />
          </CategoryContext.Provider>
        </Route>
      </Switch>
    </div>
  );

  async function getCategoryNotes() {
    console.log("GET Subjectcategory");
    return await API.get(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}`,
      {
        queryStringParameters: {
          username: username
        }
      }
    )
      .then(response => {
        console.log("GET Category response");
        console.log(response);
        setCategoryNotes(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getCategoryQuestions() {
    console.log("GET getCategoryQuestions");
    API.get(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/questions`,
      {
        queryStringParameters: {
          username: username
        }
      }
    )
      .then(response => {
        console.log("GET Category question response");
        console.log(response);
        setCategoryQuestions(response);
      })
      .catch(error => {
        console.error(error);
      });
  }
} // end of component
