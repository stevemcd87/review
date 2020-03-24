import React, { useState, useEffect, useContext } from "react";
import SubjectForm from "./SubjectForm";
import Subject from "./Subject";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import Loading from "../Loading";
function Subjects(props) {
  let { API, user } = useContext(ApiContext),
    [subjects, setSubjects] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getSubjects().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
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
    return await API.get("StuddieBuddie", "/subjects", { response: true })
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        alert("Unable to get Subjects");
      });
  }
}

export default Subjects;
