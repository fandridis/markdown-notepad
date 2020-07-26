export type AppState = {
  user: User | null;
  notes: Note[];
  selectedNote: Note | null;
  mode: "view" | "edit";
  isFetchingNotes: boolean;
  isMutatingNote: boolean;
  isDecrypting: boolean;
  isEncrypting: boolean;
};

export type EditorMode = "view" | "edit";

export type Note = {
  id?: string;
  userRef?: string;
  title: string;
  content: string;
};

export type AppReducerAction = {
  type: string;
  payload: any;
};

export type User = {
  username: string;
  email: string;
  isAuthorized: boolean;
};
