import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import { act } from "react-dom/test-utils";
// import TestHook from '../test_hook.js';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor,  cleanup, sreen } from '@testing-library/react';


afterEach(cleanup);

it("Shows 'Don't Sign In' button first then 'Sign In' after clicked", async () => {
  const { getByText } = render(<App />);

  expect(getByText(/Show/i).textContent).toBe("Show Sign In Form");

  fireEvent.click(getByText("Show Sign In Form"));

  expect(getByText(/Hide/i).textContent).toBe("Hide Sign In Form");
});


it("should have links to sugn up and sign in ", async  () => {
  const { container, getByText, getByPlaceholderText } = render(<App />);

  fireEvent.click(getByText("Show Sign In Form"));
  await waitFor(() => getByPlaceholderText("Enter your username"))

  expect(getByText("Create account")).toBeTruthy();

  expect(getByPlaceholderText("Enter your username").value).toBe("")

  expect(getByPlaceholderText("Enter your password").value).toBe("")

  fireEvent.click(getByText("Sign In"));
});
