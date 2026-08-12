// src/services/apps/notes.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_KEY = "@voiast_notes";

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export async function saveNote(content: string): Promise<Note> {
  try {
    const existingNotesRaw = await AsyncStorage.getItem(NOTES_KEY);
    const existingNotes: Note[] = existingNotesRaw
      ? JSON.parse(existingNotesRaw)
      : [];

    const newNote: Note = {
      id: Date.now().toString(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...existingNotes];
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return newNote;
  } catch (error) {
    console.error("[Notes Service Error]:", error);
    throw error;
  }
}

export async function getNotes(): Promise<Note[]> {
  try {
    const notesRaw = await AsyncStorage.getItem(NOTES_KEY);
    return notesRaw ? JSON.parse(notesRaw) : [];
  } catch (error) {
    console.error("[Notes Service Error]:", error);
    return [];
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const notes = await getNotes();
    const filtered = notes.filter((note) => note.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("[Notes Service Error]:", error);
  }
}
