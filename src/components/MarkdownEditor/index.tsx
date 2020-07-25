import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FileMarkdownOutlined } from "@ant-design/icons";
import EditorContent from "./EditorContent";
import EditorFooter from "./EditorFooter";
import { Button, Input } from "antd";
import { Note, EditorMode } from "../../types";

/**
 * TYPES & DEFAULTS
 */
type MarkdownEditorProps = {
  mode: EditorMode;
  source: string | null;
  selectedNote: Note | null;
  onNoteSave: (note: Note) => void;
  onNoteDelete: (note: Note) => void;
  onModeToggle: () => void;
};

MarkdownEditor.defaultProps = {
  source: null,
};

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
  padding: 8px 16px;
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
function MarkdownEditor(props: MarkdownEditorProps) {
  const [title, setTitle] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const isOnEditMode = props.mode === "edit";

  useEffect(() => {
    console.log("Selected note: ", props.selectedNote);
    if (props.selectedNote) {
      setMarkdownText(props.selectedNote.content);
      setTitle(props.selectedNote.title);
    }
  }, [props.selectedNote]);

  const handleContentChange = (e: any) => {
    setMarkdownText(e.target.value);
  };

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const onSave = () => {
    console.log("--- onSave ---");
    const note = {
      title: title,
      content: markdownText,
      id: props.selectedNote?.id,
    };
    props.onNoteSave(note);
  };

  const onDelete = () => {
    console.log("--- onDelete ---");
    const note = {
      title: title,
      content: markdownText,
      id: props.selectedNote?.id,
    };
    props.onNoteDelete(note);
  };

  if (!props.selectedNote) {
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
        {props.mode === "view" ? (
          <span>{props.selectedNote.title}</span>
        ) : (
          <Input
            placeholder="Add a title"
            value={title || ""}
            onChange={handleTitleChange}
          />
        )}
      </Header>
      <Content>
        <EditorContent
          mode={props.mode}
          content={markdownText} // {props.selectedNote.content}
          onContentChange={handleContentChange}
        />
      </Content>
      <Footer>
        {isOnEditMode ? (
          <>
            <div style={{ flex: 1 }}>
              <Button onClick={props.onModeToggle}>Cancel</Button>
            </div>
            <div>
              {props.selectedNote?.id && (
                <Button
                  style={{ marginRight: "8px" }}
                  type="primary"
                  danger
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
              <Button type="primary" onClick={onSave}>
                Save
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={props.onModeToggle}>Edit</Button>
        )}
      </Footer>
    </Container>
  );
}

export default MarkdownEditor;

/**
 * HELPERS
 */
