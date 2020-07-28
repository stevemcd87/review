import React from "react";
import Subjects from "./Subjects/Subjects";
import SubjectDetail from "./SubjectDetail/SubjectDetail";
import Category from "./Category/Category";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./SubjectMain.css";
function SubjectMain() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <h1>hey</h1>
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

// <Route path="/:username/:subjectName/:categoryName">
//   <Category />
// </Route>
// <Route path="/:username/:subjectName">
//   <SubjectDetail />
// </Route>
// <Route exact path="/">
//   <Subjects />
// </Route>
//





export default SubjectMain;
