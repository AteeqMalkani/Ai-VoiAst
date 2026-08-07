import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_KEY = "@voiast_notes";

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export async function saveNote(content: string): Promise<Note> {
  const existingNotesRaw = await AsyncStorage.getItem(NOTES_KEY);
  const existingNotes: Note[] = existingNotesRaw
    ? JSON.parse(existingNotesRaw)
    : [];

  const newNote: Note = {
    id: Date.now().toString(),
    content,
    createdAt: new Date().toLocaleTimeString(),
  };

  const updatedNotes = [newNote, ...existingNotes];
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
  return newNote;
}

export async function getNotes(): Promise<Note[]> {
  const notesRaw = await AsyncStorage.getItem(NOTES_KEY);
  return notesRaw ? JSON.parse(notesRaw) : [];
}
