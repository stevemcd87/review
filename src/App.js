import React, { useState, useEffect } from "react";
import "./App.css";
import AmpConfig from "./Amplify/AmpConfig";
import SubjectMain from "./components/Subjects/SubjectMain";
import ApiContext from "./contexts/ApiContext";
import Amplify, { Auth, API, Storage } from "aws-amplify";
import { Authenticator } from "aws-amplify-react";
Amplify.configure(AmpConfig);
Storage.configure({ level: "public" });
function App() {
  let [user, setUser] = useState(Auth.user),
    [authState, setAuthState] = useState(),
    [hideDefault, setHideDefault] = useState(true),
    myTheme = {
      nav:{
        backgroundColor: "inherit",
        color:"white"
      },
      navBar:{
        backgroundColor: "inherit",
        border:0
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
    console.log("authstate");
    console.log(authState);
    setUser(Auth.user);
    let hd =
      authState === "signedIn" ||
      authState === "signUp" ||
      authState === "confirmSignUp"
        ? false
        : true;
    setHideDefault(hd);
  }, [authState]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="App">
      {(authState === "signIn" || authState === "signUp") && (
        <header>
          <button
            onClick={() => setHideDefault(!hideDefault)}
          >
            {hideDefault
              ? "Sign In"
              : "Don't Sign In"}
          </button>
        </header>
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
