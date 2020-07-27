import React, { useState, useEffect, useReducer, useContext } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import styled from "styled-components";
import { message } from "antd";
import checkUser from "./utils/checkUser";
import { MarkdownEditor, NoteList, Header } from "./components";
import { AppStateContext, appReducer, INITIAL_STATE } from "./context";
import useNotesApi from "./hooks/useNotesApi";
import { User } from "./types";

/**
 * TYPES
 */
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

  @media (max-width: 570px) {
    display: flex;
    flex-direction: column;
  }
`;

/**
 * COMPONENT
 */
function App(props: AppProps) {
  const { state, dispatch } = useContext(AppStateContext);
  const { fetchNotes } = useNotesApi();

  useEffect(() => {
    dispatch({ type: "USER_AUTHENTICATED", payload: { user: props.user } });
  }, [dispatch, props.user]);

  useEffect(() => {
    if (state.user) {
      fetchNotes((errorMessage) => {
        message.error(errorMessage);
      });
    }
  }, [state.user, fetchNotes]);

  return (
    <Container>
      <Content>
        <Header />
        <NoteList />
        <MarkdownEditor />
      </Content>
    </Container>
  );
}

/**
 * Wrapping the App with the AppStateContext so the App component and
 * all its children have access to the appState.
 */
function AppWrapper() {
  const [appState, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [user, updateUser] = useState<User | null | undefined>();

  useEffect(() => {
    checkUser(updateUser);
  }, []);

  if (!user) {
    // Will never render this as the withAuthenticator HOC takes over when there is
    // no user and renders the amplify-ui ready-made login page.
    return null;
  }

  return (
    <AppStateContext.Provider value={{ state: appState, dispatch: dispatch }}>
      <App user={user} />
    </AppStateContext.Provider>
  );
}

export { App };
export default withAuthenticator(AppWrapper);
