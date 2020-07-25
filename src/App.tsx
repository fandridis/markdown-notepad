import React, { useState, useEffect, useReducer, useContext } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import checkUser from "./utils/checkUser";
import { MarkdownEditor, NoteList } from "./components";
import { AppStateContext, appReducer, INITIAL_STATE } from "./context";
import useNotesApi from "./hooks/useNotesApi";
import { User } from "./types";
import "./App.css";

type AppProps = {
  user: User;
};

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
  max-width: 1000px;
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: auto 1fr;
  border: 1px solid #eee;
  box-shadow: 1px 1px 8px rgba(10, 10, 10, 0.1);
`;

const Header = styled.div`
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
 * COMPONENT
 */
function App(props: AppProps) {
  const { state, dispatch } = useContext(AppStateContext);
  const { fetchNotes } = useNotesApi();

  useEffect(() => {
    dispatch({ type: "USER_AUTHENTICATED", payload: { user: props.user } });
  }, []);

  useEffect(() => {
    if (state.user) {
      fetchNotes();
    }
  }, [state.user]);

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

  const handleLogout = () => {
    Auth.signOut()
      .then(() => {
        dispatch({ type: "LOGOUT_SUCCEEDED", payload: {} });
        window.location.reload();
      })
      .catch(() => console.log("error signing out: "));
  };

  return (
    <Container>
      <Content>
        <Header>
          <div style={{ display: "flex" }}>
            <h3 style={{ marginRight: "8px" }}>
              Account: {props.user.username}
            </h3>
            <Button onClick={handleLogout}>Logout</Button>
          </div>

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
          <NoteList />
        </Sidebar>
        <Main>
          <MarkdownEditor />
        </Main>
      </Content>
    </Container>
  );
}

/**
 * Wrapping the App with the AppStateContext so the main App component and
 * all its children have access to the appState.
 */
function AppWrapper() {
  const [appState, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [user, updateUser] = useState<User | null | undefined>();

  useEffect(() => {
    checkUser(updateUser);
  }, []);

  if (!user) {
    return <div>Loading</div>;
  }

  return (
    <AppStateContext.Provider value={{ state: appState, dispatch: dispatch }}>
      <App user={user} />
    </AppStateContext.Provider>
  );
}

export default withAuthenticator(AppWrapper);
