import React, { useContext } from "react";
import { Auth } from "aws-amplify";
import styled from "styled-components";
import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AppStateContext } from "../../context";

/**
 * STYLES
 */
const Container = styled.div`
  overflow: scroll;
  grid-column: span 2;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: rgb(24, 144, 255);
  }
`;

/**
 * DEFAULT PROPS
 */
Header.defaultProps = {
  notes: [],
};

/**
 * COMPONENT
 */
function Header() {
  const { state, dispatch } = useContext(AppStateContext);

  const onAddNewNote = () => {
    const note = {
      title: "",
      content: "",
    };
    dispatch({
      type: "TOGGLE_MODE",
      payload: { mode: "edit", note },
    });
  };

  const onLogout = () => {
    Auth.signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(() => console.log("error signing out: "));
  };

  return (
    <Container>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: "8px" }}>Account: {state.user?.username}</h3>
        <Button size="small" onClick={onLogout}>
          Logout
        </Button>
      </div>

      <Tooltip title={state.mode === "edit" ? "Finish editing to enable" : ""}>
        <Button
          onClick={onAddNewNote}
          disabled={state.mode === "edit"}
          type="primary"
          icon={<PlusOutlined />}
        >
          New note
        </Button>
      </Tooltip>
    </Container>
  );
}

export default Header;
