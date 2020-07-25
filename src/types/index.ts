export type AppState = {
  notes: Note[];
  notesLoading: boolean;
  selectedNote: Note | null;
  mode: EditorMode;
};

export type Note = {
  id?: string;
  title: string;
  content: string;
};

export type EditorMode = "view" | "edit";

export type ReducerAction = {
  type: string;
  payload: any;
};
