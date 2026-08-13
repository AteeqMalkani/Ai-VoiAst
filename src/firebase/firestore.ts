import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/firebase/config";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

/**
 * Create a new note
 */
export async function createNote(
  userId: string,
  title: string,
  content: string,
): Promise<string> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  const notesRef = collection(db, "users", userId, "notes");

  const note = await addDoc(notesRef, {
    title: title.trim(),
    content: content.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log("[Notes] Created:", note.id);

  return note.id;
}

/**
 * Get all notes belonging to a user
 */
export async function getNotes(userId: string): Promise<Note[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const notesRef = collection(db, "users", userId, "notes");

  const notesQuery = query(notesRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(notesQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Note, "id">),
  }));
}

/**
 * Update an existing note
 */
export async function updateNote(
  userId: string,
  noteId: string,
  title: string,
  content: string,
): Promise<void> {
  if (!userId || !noteId) {
    throw new Error("User ID and Note ID are required");
  }

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  const noteRef = doc(db, "users", userId, "notes", noteId);

  await updateDoc(noteRef, {
    title: title.trim(),
    content: content.trim(),
    updatedAt: serverTimestamp(),
  });

  console.log("[Notes] Updated:", noteId);
}

/**
 * Delete a note
 */
export async function deleteNote(
  userId: string,
  noteId: string,
): Promise<void> {
  if (!userId || !noteId) {
    throw new Error("User ID and Note ID are required");
  }

  const noteRef = doc(db, "users", userId, "notes", noteId);

  await deleteDoc(noteRef);

  console.log("[Notes] Deleted:", noteId);
}
