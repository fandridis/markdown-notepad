import React from "react";
import { render } from "@testing-library/react";
import Header from "./index";
import { AppStateContext, INITIAL_STATE } from "../../context";
import { EditorMode } from "../../types";

const userMock = {
  username: "George",
  email: "george@email.com",
  isAuthorized: true,
};

const dispatchMock = jest.fn();

test("Shows the username of the current user", () => {
  let stateMock = { ...INITIAL_STATE, user: userMock };

  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <Header />
    </AppStateContext.Provider>
  );
  const greetingElement = getByText(/George/i);

  expect(greetingElement).toBeInTheDocument();
});

test("Add new note button is disabled when on edit mode", () => {
  let stateMock = {
    ...INITIAL_STATE,
    user: userMock,
    mode: "edit" as EditorMode,
  };

  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <Header />
    </AppStateContext.Provider>
  );

  expect(getByText("New note")).toBeInTheDocument();
  expect(getByText("New note").closest("button")).toHaveAttribute("disabled");
});

test("Add new note button is active when on view mode", () => {
  let stateMock = {
    ...INITIAL_STATE,
    user: userMock,
    mode: "view" as EditorMode,
  };

  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <Header />
    </AppStateContext.Provider>
  );

  expect(getByText("New note")).toBeInTheDocument();
  expect(
    getByText("New note").closest("button").getAttribute("disabled")
  ).toBeNull();
});
