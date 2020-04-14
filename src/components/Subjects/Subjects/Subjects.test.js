import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Subjects from "./Subjects";
import ApiContext from "../../../contexts/ApiContext";
import Amplify, { Auth, API, Storage } from "aws-amplify";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders subjects data", async () => {
  const fakeSubjects = [{
    navName: "Math",
    pathName: "Math",
    subjectDesc: "first grade",
    username: "stevemcd87"
  }, {
    navName: "Science",
    pathName: "Science",
    subjectDesc: "secong grade",
    username: "jen"
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeSubjects)
    })
  );
  // Use the asynchronous version of act to apply resolved promises
await act(async () => {
  render( <Subjects {...{API}} />, container);
});

expect(container.querySelector(".subjects").children.length).toBe(2);
  // expect(container.querySelector("strong").textContent).toBe(fakeSubjects.age);
  // expect(container.textContent).toContain(fakeSubjects.address);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
})
