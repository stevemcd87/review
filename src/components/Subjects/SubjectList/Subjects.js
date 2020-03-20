import React, { useState, useEffect, useContext } from "react";
import SubjectForm from "./SubjectForm";
import Subject from "./Subject";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import Loading from "../Loading"
function Subjects(props) {
  let { API, user } = useContext(ApiContext),
    [subjects, setSubjects] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [showForm, setShowForm] = useState(false);

  console.log(props);

  useEffect(() => {
    getSubjects().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    console.log("isLoading");
    console.log(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setShowForm(false);
  }, [subjects]);
  return (
    <div className="subjects-component">

      {user && (
        <button
          type="button"
          className="create-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Create Subject"}
        </button>
      )}

      {isLoading && <Loading />}
      {user && showForm && (
        <SubjectContext.Provider value={{ getSubjects }}>
          <SubjectForm />
        </SubjectContext.Provider>
      )}
      <div className="subjects model">
        {subjects.map(s => {
          return (
            <SubjectContext.Provider
              key={s.pathName}
              value={{ subject: s, getSubjects }}
            >
              <Subject />
            </SubjectContext.Provider>
          );
        })}
      </div>
    </div>
  );

  async function getSubjects() {
    console.log("GET subjects");
    return await API.get("StuddieBuddie", "/subjects", { response: true })
      .then(response => {
        console.log("res");
        console.log(response);
        setSubjects(response.data);
      })
      .catch(error => {
        alert("Unable to get Subjects");
        console.log("er");
        console.log(error);
      });
  }
} // end of component

// function useLoadingStatus(prom){
//   [isLoading, setIsLoading] = useState(true),
// }

export default Subjects;
