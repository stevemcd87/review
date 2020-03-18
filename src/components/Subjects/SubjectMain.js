import React, { useEffect } from "react";
import Subjects from "./SubjectList/Subjects";
import SubjectDetail from "./SubjectList/SubjectDetail";
import Category from "./Category/Category";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function SubjectMain() {
  useEffect(() => {
    console.log("subjectMain");
  }, []);
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/subjects/:username/:subjectName/:categoryName">
            <Category />
          </Route>
          <Route path="/subjects/:username/:subjectName">
            <SubjectDetail />
          </Route>
          <Route path="/subjects">
            <Subjects />
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
