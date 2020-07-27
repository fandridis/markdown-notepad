import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Button, Input, Popconfirm, message } from "antd";
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
 * TYPES
 */
type InputChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

/**
 * STYLES
 */

const MarkdownEditorWrapper = styled.div`
  flex: 1;
  overflow: scroll;
`;

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

const EmptyStateContainer = styled.div`
  opacity: 0.7;
  height: 100%;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > span {
    font-size: 32px;
  }

  @media (min-width: 768px) {
    & > span {
      font-size: 72px;
    }
  }
`;

/**
 * COMPONENT
 */
function MarkdownEditor() {
  const { state, dispatch } = useContext(AppStateContext);
  const { createNote, updateNote, deleteNote } = useNotesApi();
  const [note, setNote] = useState<Note>({ title: "", content: "" });

  useEffect(() => {
    if (state.selectedNote) {
      setNote({ ...state.selectedNote });
    }
  }, [state.selectedNote]);

  const onInputChange = (e: InputChange) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    if (note.title === "") return message.warn("Please add a title first.");
    if (note.id) {
      updateNote(note, (errorMessage) => message.error(errorMessage));
    } else {
      createNote(note, (errorMessage) => message.error(errorMessage));
    }
  };

  const onDelete = () => {
    deleteNote(note, (errorMessage) => message.error(errorMessage));
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
      <EmptyStateContainer>
        <FileMarkdownOutlined />
        <h2 style={{ margin: "24px 0px 4px 0px" }}>Nothing to see here.</h2>
        <p>Select a note from the list or create a new one.</p>
      </EmptyStateContainer>
    );
  }

  return (
    <MarkdownEditorWrapper>
      <Container>
        <Header>
          {state.mode === "view" ? (
            <span>{note.title}</span>
          ) : (
            <Input
              placeholder="Add a title"
              value={note.title || ""}
              name="title"
              onChange={onInputChange}
            />
          )}
        </Header>
        <Content>
          <EditorContent
            content={note.content}
            name="content"
            onContentChange={onInputChange}
          />
        </Content>
        <Footer>
          {state.mode === "edit" ? (
            <>
              <div style={{ flex: 1 }}>
                <Button disabled={state.isMutatingNote} onClick={onCancel}>
                  Cancel
                </Button>
              </div>
              <div>
                {note.id && (
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={onDelete}
                    disabled={state.isMutatingNote}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      style={{ marginRight: "8px" }}
                      type="primary"
                      danger
                      disabled={state.isMutatingNote}
                      icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                )}
                <Button
                  type="primary"
                  disabled={state.isMutatingNote}
                  icon={<SaveOutlined style={{ fontSize: "16px" }} />}
                  onClick={onSave}
                >
                  {note.id ? "Save" : "Create"}
                </Button>
              </div>
            </>
          ) : (
            <Button
              disabled={state.isMutatingNote || state.isDecrypting}
              icon={<EditOutlined style={{ fontSize: "16px" }} />}
              onClick={handleToggleMode}
            >
              Edit
            </Button>
          )}
        </Footer>
      </Container>
    </MarkdownEditorWrapper>
  );
}

export default MarkdownEditor;
