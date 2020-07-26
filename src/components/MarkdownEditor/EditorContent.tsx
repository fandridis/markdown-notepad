import React, { useContext } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { AppStateContext } from "../../context";
import { Spinner } from "../../components";

/**
 * TYPES
 */
type EditorContentProps = {
  content: string;
  name: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

/**
 * STYLES
 */
const Container = styled.div`
  position: relative;
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
  content: "",
};

/**
 * COMPONENT
 */
function EditorContent(props: EditorContentProps) {
  const { state } = useContext(AppStateContext);
  const showLoading = state.isEncrypting || state.isDecrypting;

  return (
    <Container>
      {state.mode === "view" ? (
        <ViewArea>
          <ReactMarkdown source={props.content} />
        </ViewArea>
      ) : (
        <EditArea
          value={props.content}
          name={props.name}
          placeholder="Add your markdown text here..."
          onChange={props.onContentChange}
        />
      )}

      {showLoading && (
        <div style={{ position: "absolute", top: "48%", left: "48%" }}>
          <Spinner />
        </div>
      )}
    </Container>
  );
}

export default EditorContent;
