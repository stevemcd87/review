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
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/:username/:subjectName/:categoryName">
            <Category />
          </Route>
          <Route path="/:username/:subjectName">
            <SubjectDetail />
          </Route>
          <Route exact path="/">
            <Subjects />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// <nav>
//   <ul>
//     <li>
//       <Link to="/">Home</Link>
//     </li>
//     <li>
//       <Link to="/about">About</Link>
//     </li>
//     <li>
//       <Link to="/users">Users</Link>
//     </li>
//   </ul>
// </nav>

export default SubjectMain;
