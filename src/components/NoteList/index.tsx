import React, { useContext } from "react";
import styled from "styled-components";
import { List, Tooltip } from "antd";
import { AppStateContext } from "../../context";
import { decrypt } from "../../services/cryptoService";
import { Note } from "../../types";

/**
 * TYPES
 */
type ListItemWrapperProps = {
  isHighlighted: boolean;
};

/**
 * STYLES
 */
const NoteListWrapper = styled.div`
  max-height: 80vh;
  overflow: scroll;
  border-right: 1px solid #ddd;
`;

const ListItemWrapper = styled.div<ListItemWrapperProps>`
  border-bottom: 1px solid #eee;
  background: ${(props) =>
    props.isHighlighted ? "rgb(145, 200, 255)" : "initial"};
`;

const ListItem = styled(List.Item)`
  padding: 12px;
  cursor: pointer;
  transition: background 150ms ease-in;

  &:hover {
    background: rgba(180, 180, 190, 0.2);
  }

  &.listItem--disabled {
    cursor: initial;

    &: hover {
      background: initial;
    }
  }

  .ant-list-item-meta-title {
    margin-bottom: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/**
 * DEFAULT PROPS
 */
NoteList.defaultProps = {
  notes: [],
};

/**
 * COMPONENT
 */
function NoteList() {
  const { state, dispatch } = useContext(AppStateContext);
  const isClickDisabled = state.mode === "edit";

  const onListItemClick = async (note: Note) => {
    if (isClickDisabled) return;

    // Here we set a temporary note (without the content) as the selectedNote for better UX.
    // This way it will both hightlight the selection and set the note's title in the Editor
    // while the user is waiting for the decryption to finish.
    dispatch({ type: "DECRYPTION_STARTED", payload: {} });
    const tempNote: Note = { ...note, content: "" };
    dispatch({
      type: "NOTE_SELECTED",
      payload: { note: tempNote },
    });

    try {
      const decryptedNote = await decrypt(note);
      dispatch({ type: "DECRYPTION_SUCCEEDED", payload: {} });
      dispatch({
        type: "NOTE_SELECTED",
        payload: { note: decryptedNote },
      });
    } catch (err) {
      // TODO: Handle decryption error
    }
  };

  return (
    <NoteListWrapper>
      <Tooltip
        title={isClickDisabled ? "Finish editing to enable navigation" : ""}
      >
        <List
          itemLayout="horizontal"
          dataSource={state.notes}
          loading={state.isFetchingNotes}
          renderItem={(item: Note) => (
            <ListItemWrapper isHighlighted={item.id === state.selectedNote?.id}>
              <ListItem
                className={isClickDisabled ? "listItem--disabled" : ""}
                onClick={() => onListItemClick(item)}
              >
                <List.Item.Meta title={item.title} />
              </ListItem>
            </ListItemWrapper>
          )}
        />
      </Tooltip>
    </NoteListWrapper>
  );
}

export default NoteList;
