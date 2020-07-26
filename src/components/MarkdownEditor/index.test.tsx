import React from "react";
import { render } from "@testing-library/react";
import NoteList from "./index";
import { AppStateContext, INITIAL_STATE } from "../../context";
import { EditorMode } from "../../types";

const notesMock = [
  {
    id: "1",
    userRef: "user1",
    title: "Note 1",
    content: "content 1",
  },
  {
    id: "2",
    userRef: "user1",
    title: "Note 2",
    content: "content 2",
  },
];

const dispatchMock = jest.fn();

test("Renders a placeholder when no note is selected", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "view" as EditorMode,
    notes: notesMock,
    selectedNote: null,
  };

  const { getByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  expect(getByText(/Nothing to see here/i)).toBeInTheDocument();
});

test("Renders the selected note and an edit button", () => {
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
  expect(getByText(/content 1/i)).toBeInTheDocument();
  expect(getByText(/Edit/i)).toBeInTheDocument();
});

test("Cancel, Delete and Save buttons are visible on edit mode", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "edit" as EditorMode,
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

  expect(getByText(/Cancel/i)).toBeInTheDocument();
  expect(getByText(/Delete/i)).toBeInTheDocument();
  expect(getByText(/Save/i)).toBeInTheDocument();
});

test("Delete button is not visible when creating a new note", () => {
  const stateMock = {
    ...INITIAL_STATE,
    mode: "edit" as EditorMode,
    notes: notesMock,
    selectedNote: { title: "", content: "" },
  };

  const { queryByText } = render(
    <AppStateContext.Provider
      value={{ state: stateMock, dispatch: dispatchMock }}
    >
      <NoteList />
    </AppStateContext.Provider>
  );

  expect(queryByText(/Delete/i)).toBeNull();
});
