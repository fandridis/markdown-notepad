import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

/**
 * TYPES
 */
type EditorContentProps = {
  mode: "view" | "edit";
  content: string;
  onContentChange: (e: any) => void;
};

/**
 * STYLES
 */
const Container = styled.div`
  height: 100%;
`;

const EditArea = styled.textarea`
  overflow: scroll;
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  font-size: 18px;
`;

const ViewArea = styled.div`
  overflow: scroll;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 18px;
`;

/**
 * DEFAULT PROPS
 */
EditorContent.defaultProps = {
  mode: "view",
  content: "",
};

/**
 * COMPONENT
 */
function EditorContent(props: EditorContentProps) {
  return (
    <Container>
      {props.mode === "view" ? (
        <ViewArea>
          <ReactMarkdown source={props.content} />
        </ViewArea>
      ) : (
        <EditArea
          value={props.content}
          placeholder="Add your markdown text here..."
          onChange={props.onContentChange}
        />
      )}
    </Container>
  );
}

export default EditorContent;
