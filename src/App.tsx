import React, { useState, useEffect, useCallback, useReducer } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API } from "aws-amplify";
import styled from "styled-components";
import checkUser from "./utils/checkUser";
import { MarkdownEditor, NoteList } from "./components";
import { AppState, Note, ReducerAction } from "./types";
import "./App.css";

/**
 * STYLES
 */
const Container = styled.div`
  min-height: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  min-height: 88vh;
  width: 100%;
  max-width: 800px;
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: auto 1fr;
  border: 1px solid #eee;
  box-shadow: 1px 1px 8px rgba(10, 10, 10, 0.1);
`;

const Header = styled.div`
  grid-column: span 2;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: end;
`;

const Main = styled.div`
  flex: 1;
  overflow: scroll;
`;

const Sidebar = styled.div`
  max-height: 80vh;
  overflow: scroll;
  border-right: 1px solid #ddd;
`;

/**
 * GLOBAL APP STATE
 */
const initialState: AppState = {
  notes: [],
  notesLoading: true,
  selectedNote: null,
  mode: "view",
};

/**
 * GLOBAL APP STATE REDUCER
 */
function reducer(state: AppState, action: ReducerAction) {
  switch (action.type) {
    case "NOTES_RECEIVED":
      return { ...state, notes: action.payload.notes, notesLoading: false };
    case "NOTE_CREATED":
      return {
        ...state,
        selectedNote: action.payload.note,
        mode: action.payload.mode,
        notes: [action.payload.note, ...state.notes],
      };
    case "NOTE_UPDATED":
      return {
        ...state,
        selectedNote: action.payload.note,
        mode: action.payload.mode,
        notes: state.notes.map((note) =>
          note.id === action.payload.note.id ? action.payload.note : note
        ),
      };
    case "NOTE_DELETED":
      return {
        ...state,
        mode: action.payload.mode,
        selectedNote: action.payload.selectedNote,
        notes: state.notes.filter((note) => note.id !== action.payload.note.id),
      };
    case "TOGGLE_MODE":
      return { ...state, mode: action.payload.mode };
    case "NOTE_SELECTED":
      return { ...state, selectedNote: action.payload.note };
    case "ERROR":
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

/**
 * COMPONENT
 */
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, updateUser] = useState({});

  const getNotes = useCallback(async () => {
    const res = await API.get("notesapi", "/notes", null);
    console.log("res: ", res);
    dispatch({
      type: "NOTES_RECEIVED",
      payload: { notes: res.data.Items },
    });
  }, []);

  useEffect(() => {
    getNotes();
    checkUser(updateUser);
  }, [getNotes]);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  const onAddNewNote = () => {
    const note = {
      title: "",
      content: "",
    };
    dispatch({
      type: "NOTE_SELECTED",
      payload: { note },
    });
    dispatch({
      type: "TOGGLE_MODE",
      payload: { mode: "edit" },
    });
  };

  const onNoteSave = (note: Note) => {
    if (note.id) {
      console.log("Updating existing note: ", note);
      handleUpdateNote(note);
    } else {
      console.log("Creating new note: ", note);
      handleCreateNote(note);
    }
  };

  const onNoteDelete = async (note: Note) => {
    try {
      const data = {
        body: { id: note.id },
      };
      await API.del("notesapi", `/notes`, data);
      dispatch({
        type: "NOTE_DELETED",
        payload: { note, selectedNote: null, mode: "view" },
      });
    } catch (err) {
      console.log("error deleting a note...");
    }
  };

  const handleUpdateNote = async (note: Note) => {
    try {
      const data = {
        body: { title: note.title, content: note.content, id: note.id },
      };
      const res = await API.put("notesapi", "/notes", data);
      console.log("res: ", res);
      dispatch({
        type: "NOTE_UPDATED",
        payload: { note, mode: "view" },
      });
    } catch (err) {
      console.log("error creating a note...");
    }
  };

  const handleCreateNote = async (note: Note) => {
    try {
      const data = {
        body: { title: note.title, content: note.content },
      };
      const res = await API.post("notesapi", "/notes", data);
      dispatch({
        type: "NOTE_CREATED",
        payload: { note: res.note, mode: "view" },
      });
    } catch (err) {
      console.log("error creating a note...");
    }
  };

  const handleModeToggle = () => {
    const mode = state.mode === "view" ? "edit" : "view";
    dispatch({
      type: "TOGGLE_MODE",
      payload: { mode },
    });
  };

  const handleNoteSelect = (note: Note) => {
    console.log("selecting: ", note);
    dispatch({
      type: "NOTE_SELECTED",
      payload: { note },
    });
  };

  return (
    <Container>
      <Content>
        <Header>
          <Tooltip
            title={state.mode === "edit" ? "Finish editing to enable" : ""}
          >
            <Button
              onClick={onAddNewNote}
              disabled={state.mode === "edit"}
              type="primary"
              icon={<PlusOutlined />}
            >
              New note
            </Button>
          </Tooltip>
        </Header>
        <Sidebar>
          <NoteList
            notes={state.notes}
            notesLoading={state.notesLoading}
            onNoteSelect={handleNoteSelect}
            isClickDisabled={state.mode === "edit"}
          />
        </Sidebar>
        <Main>
          <MarkdownEditor
            mode={state.mode}
            selectedNote={state.selectedNote}
            onModeToggle={handleModeToggle}
            onNoteSave={onNoteSave}
            onNoteDelete={onNoteDelete}
          />
        </Main>
      </Content>
    </Container>
  );
}

export default withAuthenticator(App);
