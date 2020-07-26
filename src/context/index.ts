import { createContext, Reducer } from "react";
import { AppState, AppReducerAction } from "../types";

export const INITIAL_STATE: AppState = {
  user: null,
  notes: [],
  selectedNote: null,
  mode: "view",

  isFetchingNotes: true,
  isMutatingNote: false,
  isDecrypting: false,
  isEncrypting: false,
};

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: (action: AppReducerAction) => void;
}>({ state: INITIAL_STATE, dispatch: () => {} });

export const appReducer: Reducer<AppState, AppReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "USER_AUTHENTICATED":
      return { ...state, user: action.payload.user };

    case "LOGOUT_SUCCEEDED": {
      return { ...state, user: null };
    }

    case "TOGGLE_MODE":
      return {
        ...state,
        mode: action.payload.mode,
        selectedNote: action.payload.note,
      };

    case "NOTE_SELECTED":
      return { ...state, selectedNote: action.payload.note };

    case "NOTE_CREATED":
      return {
        ...state,
        selectedNote: action.payload.note,
        mode: action.payload.mode,
        notes: [action.payload.note, ...state.notes],
      };

    case "NOTE_UPDATED":
      return {
        ...state,
        selectedNote: action.payload.note,
        mode: action.payload.mode,
        notes: state.notes.map((note) =>
          note.id === action.payload.note.id ? action.payload.note : note
        ),
      };

    case "NOTE_DELETED":
      return {
        ...state,
        mode: action.payload.mode,
        selectedNote: action.payload.selectedNote,
        notes: state.notes.filter((note) => note.id !== action.payload.note.id),
      };

    case "FETCHING_NOTES_STARTED":
      return { ...state, isFetchingNotes: true };

    case "FETCHING_NOTES_SUCCEEDED":
      return { ...state, notes: action.payload.notes, isFetchingNotes: false };

    case "MUTATING_NOTE_STARTED":
      return { ...state, isMutatingNote: true };

    case "MUTATING_NOTE_SUCCEEDED":
      return { ...state, isMutatingNote: false };

    case "DECRYPTION_STARTED":
      return { ...state, isDecrypting: true };

    case "DECRYPTION_SUCCEEDED":
      return { ...state, isDecrypting: false };

    case "ENCRYPTION_STARTED":
      return { ...state, isEncrypting: true };

    case "ENCRYPTION_SUCCEEDED":
      return { ...state, isEncrypting: false };

    default:
      return state;
  }
};
