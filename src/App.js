import React, { useState, useEffect } from "react";
import "./App.css";
import AmpConfig from "./Amplify/AmpConfig";
import Bug from "./components/Bug";
import SubjectMain from "./components/Subjects/SubjectMain";
import ApiContext from "./contexts/ApiContext";
import Amplify, { Auth, API, Storage } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { Authenticator } from "aws-amplify-react";
Amplify.configure(AmpConfig);
Storage.configure({ level: "public" });
function App() {
  let [user, setUser] = useState(Auth.user),
    [authState, setAuthState] = useState(),
    [hideDefault, setHideDefault] = useState(true),
    [displayBugComponent, setDisplayBugComponent] = useState(false),
    [bugs, setBugs] = useState(),
    myTheme = {
      nav: {
        backgroundColor: "inherit",
        color: "white"
      },
      navBar: {
        backgroundColor: "inherit",
        border: 0
      },
      navRight: {
        textAlign: "center"
      },
      navButton: {
        backgroundColor: "green"
      },
      formSection: {
        backgroundColor: "lightgreen"
      },
      button: {
        backgroundColor: "green"
      },
      a: {
        color: "green"
      }
    };

  useEffect(() => {
    setUser(Auth.user);
    // Checks authState whether or not to hide the greeting
    let hd =
      authState === "signedIn" ||
      authState === "signUp" ||
      authState === "confirmSignUp" ||
      authState === "signedUp" ||
      authState === "signIn" ||
      authState === "forgotPassword"
        ? false
        : true;
    // if hd is true Hides all Authenticator components(SignIn,SignOut, etc...)
    setHideDefault(hd);
  }, [authState]);

  // useEffect(() => {
  //   getRepoIssues();
  // }, []);

  return (
    <div className="App">
      {!user && (
        <button
          className="hide-cog-button"
          onClick={() => setHideDefault(!hideDefault)}
        >
          {hideDefault ? "Show Sign In Form" : "Hide Sign In Form"}
        </button>
      )}
      <Authenticator
        onStateChange={as => setAuthState(as)}
        hideDefault={hideDefault}
        theme={myTheme}
      >
        <ApiContext.Provider value={{ API, Storage, user, Auth }}>
          <SubjectMain />
        </ApiContext.Provider>
      </Authenticator>
    </div>
  );

  //
  async function getRepoIssues() {
    const repoURL = "https://api.github.com/users/stevemcd87/repos",
      issuesURL = "https://api.github.com/repos/stevemcd87/review/issues",
      labelsURL = "https://api.github.com/repos/stevemcd87/review/labels";
    fetch(issuesURL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        splitByLabels(data);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  }

  function splitByLabels(data) {
    let finishedData = {};
    data.forEach(issue => {
      issue.labels.forEach(label => {
        if (!finishedData[label.name]) finishedData[label.name] = [];
        finishedData[label.name].push([issue.title]);
      });
    });
    setBugs(finishedData);
  }
}

// export default withAuthenticator(App, {
//   // Render a sign out button once logged in
//   includeGreetings: true
//   // // Show only certain components
//   // authenticatorComponents: [MyComponents],
//   // // display federation/social provider buttons
//   // federated: { myFederatedConfig },
//   // // customize the UI/styling
//   // theme: { myCustomTheme }
// });
export default App;
