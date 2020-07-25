import { useContext, useCallback } from "react";
import { API } from "aws-amplify";
import { Note } from "../types";
import { AppStateContext } from "../context";
import { encrypt } from "../services/cryptoService";

const API_NAME = "notesapi";

function useNotesApi() {
  const { dispatch } = useContext(AppStateContext);

  const fetchNotes = useCallback(async () => {
    dispatch({ type: "FETCHING_NOTES_STARTED", payload: {} });
    try {
      // Fetch the notes from db
      const res = await API.get(API_NAME, "/notes", {});

      // Update the state with the notes
      dispatch({
        type: "FETCHING_NOTES_SUCCEEDED",
        payload: { notes: res.data.Items },
      });
    } catch (err) {
      console.log("error fetching notes.");
      // TODO: Handle the error
    }
  }, [dispatch]);

  const createNote = useCallback(
    async (note: Note) => {
      dispatch({ type: "MUTATING_NOTE_STARTED", payload: {} });
      try {
        // First encrypt the note contents
        const encryptedNote = await encrypt(note);
        const data = { body: { ...encryptedNote } };

        // Save the note in db
        const res = await API.post("notesapi", "/notes", data);

        // Update the app state with the new note
        dispatch({ type: "MUTATING_NOTE_SUCCEEDED", payload: {} });
        dispatch({
          type: "NOTE_CREATED",
          payload: { note: res.note, mode: "view" },
        });
      } catch (err) {
        console.log("error creating a note.");
      }
    },
    [dispatch]
  );

  const updateNote = useCallback(
    async (note: Note) => {
      dispatch({ type: "MUTATING_NOTE_STARTED", payload: {} });
      dispatch({ type: "ENCRYPTION_STARTED", payload: {} });
      try {
        // First encrypt the notes contents
        const encryptedNote = await encrypt(note);
        const data = { body: { ...encryptedNote } };

        // Update the note in db
        await API.put("notesapi", "/notes", data);

        // Update the app state with the updated note and change to view mode
        dispatch({ type: "ENCRYPTION_SUCCEEDED", payload: {} });
        dispatch({ type: "MUTATING_NOTE_SUCCEEDED", payload: {} });
        dispatch({
          type: "NOTE_UPDATED",
          payload: { note, mode: "view" },
        });
      } catch (err) {
        console.log("error creating a note.");
      }
    },
    [dispatch]
  );

  const deleteNote = useCallback(
    async (note: Note) => {
      dispatch({ type: "MUTATING_NOTE_STARTED", payload: {} });
      try {
        const data = {
          body: { id: note.id },
        };
        // Delete the note from db
        await API.del("notesapi", `/notes`, data);

        // Remove the note from the app state and change to view mode
        dispatch({ type: "MUTATING_NOTE_SUCCEEDED", payload: {} });
        dispatch({
          type: "NOTE_DELETED",
          payload: { note, selectedNote: null, mode: "view" },
        });
      } catch (err) {
        console.log("error deleting a note.");
      }
    },
    [dispatch]
  );

  return {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}

export default useNotesApi;
