import React from "react";

const SubjectContext = React.createContext({
  subject: {},
  subjects: [],
  getSubjects: () => {},
  setSubjects: () => {}
});

export default SubjectContext;
