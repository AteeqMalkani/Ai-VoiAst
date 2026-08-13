// src/services/apps/notes.ts

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
} from "firebase/firestore";

import { db } from "@/firebase/config";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Create a new note for the authenticated user.
 */
export async function saveNote(
  userId: string,
  title: string,
  content: string,
): Promise<Note> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  const notesRef = collection(db, "users", userId, "notes");

  const noteData = {
    title: title.trim() || "VoiAst Note",
    content: content.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const noteRef = await addDoc(notesRef, noteData);

  return {
    id: noteRef.id,
    title: noteData.title,
    content: noteData.content,
  };
}

/**
 * Get all notes belonging to a user.
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
 * Update an existing note.
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
    title: title.trim() || "VoiAst Note",
    content: content.trim(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an existing note.
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
}
