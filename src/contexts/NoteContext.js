import React from "react";

const NoteContext = React.createContext({
  formDisplayed: "",
  questionNotes: [],
  setFormDisplayed: ()=>{}
});

export default NoteContext;
