import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import {
  FileMarkdownOutlined,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import EditorContent from "./EditorContent";
import { AppStateContext } from "../../context";
import useNotesApi from "../../hooks/useNotesApi";
import { Note } from "../../types";

/**
 * STYLES
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  overflow: scroll;
  padding: 5px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 22px;
  font-weight: 700;
  border-bottom: 1px solid #eee;

  span {
    font-size: 24px;
  }

  input {
    width: 100%;
    max-width: 280px;
    font-size: 18px;
    font-weight: 600;
  }
`;

const Content = styled.div`
  overflow: scroll;
  flex: 1;
  height: calc(80vh - 110px);
  padding: 16px 8px 8px 16px;
`;

const Footer = styled.div`
  padding: 4px 16px 16px 16px;
  display: flex;
  align-items: center;
`;

/**
 * COMPONENT
 */
function MarkdownEditor() {
  const { state, dispatch } = useContext(AppStateContext);
  const { createNote, updateNote, deleteNote } = useNotesApi();
  const [note, setNote] = useState<Note>({ id: "", title: "", content: "" });
  const isOnEditMode = state.mode === "edit";

  // If coming from editing an existing note, populate the fields with its data
  useEffect(() => {
    if (state.selectedNote) {
      setNote({ ...state.selectedNote });
    }
  }, [state.selectedNote]);

  const handleInputChange = (e: any) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    if (note.id) {
      updateNote(note);
    } else {
      createNote(note);
    }
  };

  const onDelete = () => {
    deleteNote(note);
  };

  const onCancel = () => {
    if (state.selectedNote) {
      setNote({ ...state.selectedNote });
    }

    handleToggleMode();
  };

  const handleToggleMode = () => {
    const mode = state.mode === "view" ? "edit" : "view";
    dispatch({
      type: "TOGGLE_MODE",
      payload: {
        mode,
        note: state.selectedNote?.id ? state.selectedNote : null,
      },
    });
  };

  if (!state.selectedNote) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FileMarkdownOutlined style={{ fontSize: "80px" }} />
        <h2 style={{ margin: "24px 0px 4px 0px" }}>Nothing to see here.</h2>
        <p>Select a note from the list or create a new one.</p>
      </div>
    );
  }

  return (
    <Container>
      <Header>
        {state.mode === "view" ? (
          <span>{note.title}</span>
        ) : (
          <Input
            placeholder="Add a title"
            value={note.title || ""}
            name="title"
            onChange={handleInputChange}
          />
        )}
      </Header>
      <Content>
        <EditorContent
          content={note.content}
          name="content"
          onContentChange={handleInputChange}
        />
      </Content>
      <Footer>
        {isOnEditMode ? (
          <>
            <div style={{ flex: 1 }}>
              <Button disabled={state.isMutatingNote} onClick={onCancel}>
                Cancel
              </Button>
            </div>
            <div>
              {note.id && (
                <Button
                  style={{ marginRight: "8px" }}
                  type="primary"
                  danger
                  disabled={state.isMutatingNote}
                  onClick={onDelete}
                >
                  <DeleteOutlined style={{ fontSize: "16px" }} />
                  Delete
                </Button>
              )}
              <Button
                type="primary"
                disabled={state.isMutatingNote}
                onClick={onSave}
              >
                <SaveOutlined style={{ fontSize: "16px" }} />
                Save
              </Button>
            </div>
          </>
        ) : (
          <Button
            disabled={state.isMutatingNote || state.isDecrypting}
            onClick={handleToggleMode}
          >
            <EditOutlined style={{ fontSize: "16px" }} />
            Edit
          </Button>
        )}
      </Footer>
    </Container>
  );
}

export default MarkdownEditor;

/**
 * HELPERS
 */
