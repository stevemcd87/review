import React from "react";
import {  render,unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import SubjectMain from "../SubjectMain";
import ApiContext from "../../../contexts/ApiContext";
import Amplify, { Auth, API, Storage } from "aws-amplify";
import { shallow, mount } from 'enzyme';
let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

test("with ReactDOM", () => {
    act(() => {
        mount((
          <ApiContext.Provider value={{ API, Storage, Auth }}>
            <SubjectMain />
          </ApiContext.Provider>
        ), container);
    });
console.log(container);
    // expect(container.textContent).toBe("Provided Value");
});
// })
