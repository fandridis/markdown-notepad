import React from "react";
import styled from "styled-components";
import { List, Tooltip } from "antd";
import { Note } from "../../types";

/**
 * TYPES
 */
type NoteListProps = {
  notes: Note[];
  notesLoading: boolean;
  isClickDisabled: boolean;
  onNoteSelect: (note: Note) => void;
};

/**
 * STYLES
 */
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

  .ant-list-item-meta-description,
  .ant-list-item-meta-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
//  cursor: ${(props) => (props.isclickdisabled ? "initial" : "pointer")};
//     background: ${(props) =>
// props.isclickdisabled ? "initial" : "rgba(180, 180, 190, 0.2)"};

/**
 * DEFAULT PROPS
 */
NoteList.defaultProps = {
  notes: [],
};

/**
 * COMPONENT
 */
function NoteList(props: NoteListProps) {
  const handleClick = (item: Note) => {
    if (!props.isClickDisabled) {
      props.onNoteSelect(item);
    }
  };

  return (
    <Tooltip
      title={props.isClickDisabled ? "FInish editing to enable navigation" : ""}
    >
      <List
        itemLayout="horizontal"
        dataSource={props.notes}
        loading={props.notesLoading}
        renderItem={(item: Note) => (
          <ListItem
            // isclickdisabled={props.isClickDisabled}
            className={props.isClickDisabled ? "listItem--disabled" : ""}
            onClick={() => handleClick(item)}
          >
            <List.Item.Meta title={item.title} description={item.content} />
          </ListItem>
        )}
      />
    </Tooltip>
  );
}

export default NoteList;
