import React from "react";

const CategoryContext = React.createContext({
  categoryNotes: [],
  getCategortNotes: () => {},
  categoryQuestions: [],
  getCategortQuestions: () => {},
});

export default CategoryContext;
