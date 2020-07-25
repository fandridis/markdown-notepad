import React, { useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Button } from "antd";

/**
 * TYPES & DEFAULTS
 */
type EditorFooterProps = {
  mode: "view" | "edit";
};

EditorFooter.defaultProps = {
  mode: "view",
};

/**
 * STYLES
 */
const Container = styled.div`
  height: 100%;
`;

/**
 * COMPONENT
 */
function EditorFooter(props: React.PropsWithChildren<EditorFooterProps>) {
  return (
    <Container>
      <Button>Save</Button>
    </Container>
  );
}

export default EditorFooter;

/**
 * HELPERS
 */
