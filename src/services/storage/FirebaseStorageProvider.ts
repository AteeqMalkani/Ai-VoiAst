// services/storage/FirebaseStorageProvider.ts
import { NotePayload, NoteStorageProvider } from "../../types/storage";
import { saveNote } from "../firestore/notes"; // Updated path and function import

export class FirebaseStorageProvider implements NoteStorageProvider {
  name = "Firebase Firestore";
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async saveNote(
    note: NotePayload,
  ): Promise<{ success: boolean; pathOrId: string }> {
    try {
      const createdNote = await saveNote(this.userId, note.title, note.content);

      return { success: true, pathOrId: createdNote.id };
    } catch (error) {
      console.error("Failed to save note to Firebase:", error);
      return { success: false, pathOrId: "" };
    }
  }
}
