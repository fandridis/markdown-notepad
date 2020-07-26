import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteList from "./index";
import { AppStateContext, INITIAL_STATE } from "../../context";
import { EditorMode } from "../../types";

const notesMock = [
  {
    id: "1",
    userRef: "user1",
    title: "Note 1",
    content: "content",
  },
  {
    id: "2",
    userRef: "user1",
    title: "Note 2",
    content: "content",
  },
];

const dispatchMock = jest.fn();
const dispatchMockOnEdit = jest.fn();

test("Renders a list of notes", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "view" as EditorMode,
    notes: notesMock,
    selectedNote: notesMock[0],
  };

  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  expect(getByText(/Note 1/i)).toBeInTheDocument();
  expect(getByText(/Note 2/i)).toBeInTheDocument();
});

test("Highlight selected note", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "view" as EditorMode,
    notes: notesMock,
    selectedNote: notesMock[0],
  };

  const { getByTestId } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  expect(getByTestId(`list-item-wrapper-${1}`)).toHaveStyle(
    "background: rgb(145, 200, 255)"
  );
});

test("Clicking a note dispatches an action", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "view" as EditorMode,
    notes: notesMock,
    selectedNote: notesMock[0],
  };

  const { getByTestId } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  const listItemElement = getByTestId(`list-item-${1}`);

  userEvent.click(listItemElement);

  expect(dispatchMock).toHaveBeenCalled();
});

test("Clicking a note while in edit mode does not dispatch an action", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "edit" as EditorMode,
    notes: notesMock,
    selectedNote: notesMock[0],
  };

  const { getByTestId } = render(
    <AppStateContext.Provider
      value={{
        state: stateMock,
        dispatch: dispatchMockOnEdit,
      }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  const listItemElement = getByTestId(`list-item-${1}`);

  userEvent.click(listItemElement);

  expect(dispatchMockOnEdit).toHaveBeenCalledTimes(0);
});
