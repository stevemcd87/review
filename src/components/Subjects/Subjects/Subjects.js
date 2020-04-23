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
    [displayForm, setDisplayForm] = useState(false),
    [displayFormText, setDisplayFormText] = useState("Create Subject");

  useEffect(() => {
    getSubjects().then(res => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setDisplayFormText(displayForm ? "Hide Subject Form" : "Create Subject");
  }, [displayForm]);

  useEffect(() => {
    setDisplayForm(false);
  }, [subjects]);

  if (isLoading) return <Loading />;
  return (
    <div className="component">
      {/*<h1>Subjects</h1> is part of test*/}
      <h1>Subjects</h1>
      {user && (
        <>
          <button
            type="button"
            className="display-button create-button"
            onClick={() => setDisplayForm(!displayForm)}
            aria-label={displayFormText}
            aria-pressed={displayForm}
          >
            {displayFormText}
          </button>
          {displayForm && (
            <SubjectContext.Provider value={{ getSubjects }}>
              <SubjectForm />
            </SubjectContext.Provider>
          )}
        </>
      )}

      <div className="subjects model container">
        {subjects.map(s => {
          return (
            <SubjectContext.Provider
              key={s.pathName}
              value={{ subject: s, getSubjects }}
            >
              <Subject key={s.pathName} />
            </SubjectContext.Provider>
          );
        })}
      </div>
    </div>
  );

  async function getSubjects() {
    return await API.get("StuddieBuddie", "/subjects")
      .then(res => {
        setSubjects(res);
      })
      .catch(error => {
        alert("Unable to get Subjects");
      });
  }
}

export default Subjects;
