// types/storage.ts

export interface NotePayload {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
}

export interface NoteStorageProvider {
  name: string;
  saveNote(note: NotePayload): Promise<{ success: boolean; pathOrId: string }>;
  getNotes?(): Promise<NotePayload[]>;
}
