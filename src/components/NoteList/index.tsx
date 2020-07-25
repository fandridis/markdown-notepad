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

  const handleClick = async (note: Note) => {
    if (!isClickDisabled) {
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
        // handle decryption error
      }
    }
  };

  return (
    <Tooltip
      title={isClickDisabled ? "FInish editing to enable navigation" : ""}
    >
      <List
        itemLayout="horizontal"
        dataSource={state.notes}
        loading={state.isFetchingNotes}
        renderItem={(item: Note) => (
          <ListItemWrapper isHighlighted={item.id === state.selectedNote?.id}>
            <ListItem
              className={isClickDisabled ? "listItem--disabled" : ""}
              onClick={() => handleClick(item)}
            >
              <List.Item.Meta title={item.title} />
            </ListItem>
          </ListItemWrapper>
        )}
      />
    </Tooltip>
  );
}

export default NoteList;
