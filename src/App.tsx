import React, { useState, useEffect, useCallback, useReducer } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API } from "aws-amplify";
import { List } from "antd";
import styled from "styled-components";
import checkUser from "./utils/checkUser";
import "./App.css";

const Container = styled.div`
  min-height: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 6px solid tomato;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: auto 1fr;
  border: 4px solid green;
`;

const Header = styled.div`
  grid-column: span 3;
  padding: 16px;
  border: 3px solid #369;
`;

const Main = styled.div`
  flex: 1;
  padding: 20px;
`;

const Sidebar = styled.div`
  border: 3px solid #f90;
  padding: 20px;
`;

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: "", description: "" },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.notes, loading: false };
    case "ADD_NOTE":
      return { ...state, notes: [action.note, ...state.notes] };
    case "RESET_FORM":
      return { ...state, form: initialState.form };
    case "SET_INPUT":
      return { ...state, form: { ...state.form, [action.name]: action.value } };
    case "ERROR":
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, updateUser] = useState({});

  const getNotes = useCallback(async () => {
    const res = await API.get("notesapi", "/notes", null);
    console.log("res: ", res);
    dispatch({ type: "SET_NOTES", notes: res.data.Items, loading: false });
  }, []);

  useEffect(() => {
    getNotes();
    checkUser(updateUser);
  }, [getNotes]);

  async function deleteItem(id: string) {
    try {
      const notes = state.notes.filter((p: any) => p.id !== id);
      // setState({ ...state, notes });
      await API.del("notesapi", "/notes", { body: { id } });
      console.log("successfully deleted item");
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function addItem() {
    console.log("Adding an item");

    try {
      const data = {
        body: { title: "Title 1", content: "Content goes here" },
      };
      // updateItemInfo(initialState);
      await API.post("notesapi", "/notes", data);
    } catch (err) {
      console.log("error creating a note...");
    }
  }

  return (
    <Container>
      <Content>
        <Header>
          <Button onClick={addItem} type="primary" icon={<PlusOutlined />}>
            New note
          </Button>
        </Header>
        <Sidebar>
          <List
            itemLayout="horizontal"
            dataSource={state.notes}
            loading={state.loading}
            renderItem={(item: any) => (
              <List.Item
              // actions={
              //   user.isAuthorized
              //     ? [
              //         <p onClick={() => deleteItem(item.id)} key={item.id}>
              //           delete
              //         </p>,
              //       ]
              //     : null
              // }
              >
                <List.Item.Meta title={item.title} description={item.content} />
              </List.Item>
            )}
          />
        </Sidebar>
        <Main>
          <h1>Main</h1>
          <p>
            Vestibulum consectetur sit amet nisi ut consectetur. Praesent
            efficitur, nibh vitae fringilla scelerisque, est neque faucibus
            quam, in iaculis purus libero eget mauris. Curabitur et luctus
            sapien, ac gravida orci. Aliquam erat volutpat. In hac habitasse
            platea dictumst. Aenean commodo, arcu a commodo efficitur, libero
            dolor mollis turpis, non posuere orci leo eget enim. Curabitur sit
            amet elementum orci, pulvinar dignissim urna. Morbi id ex eu ex
            congue laoreet. Aenean tincidunt dolor justo, semper pretium libero
            luctus nec. Ut vulputate metus accumsan leo imperdiet tincidunt.
            Phasellus nec rutrum dolor. Cras imperdiet sollicitudin arcu, id
            interdum nibh fermentum in.
          </p>
        </Main>
      </Content>
    </Container>
  );
}

export default withAuthenticator(App);
