import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export interface Memory {
  id: string;
  content: string;
  category?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Backward compatibility alias
export type VoiAstMemory = Memory;

/**
 * Saves a new persistent fact or user preference to Firestore.
 * Path: users/{userId}/memories
 */
export async function saveMemory(
  userId: string,
  content: string,
  category: string = "General",
): Promise<string> {
  if (!userId) {
    throw new Error("User ID is required to save a memory.");
  }

  if (!content || !content.trim()) {
    throw new Error("Memory content cannot be empty.");
  }

  try {
    const memoryRef = collection(db, "users", userId, "memories");

    const docRef = await addDoc(memoryRef, {
      content: content.trim(),
      category: category.trim() || "General",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("[Memory Saved]:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[saveMemory Error]:", error);
    throw error;
  }
}

/**
 * Get all memories belonging to a user (most recent first).
 */
export async function getMemories(
  userId: string,
  maxResults: number = 20,
): Promise<Memory[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch memories.");
  }

  try {
    const memoriesRef = collection(db, "users", userId, "memories");
    const memoriesQuery = query(
      memoriesRef,
      orderBy("createdAt", "desc"),
      limit(maxResults),
    );

    const snapshot = await getDocs(memoriesQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Memory, "id">),
    }));
  } catch (error) {
    console.error("[getMemories Error]:", error);
    throw error;
  }
}

/**
 * Delete an existing memory.
 */
export async function deleteMemory(
  userId: string,
  memoryId: string,
): Promise<void> {
  if (!userId || !memoryId) {
    throw new Error("User ID and Memory ID are required to delete a memory.");
  }

  try {
    const memoryRef = doc(db, "users", userId, "memories", memoryId);
    await deleteDoc(memoryRef);
    console.log("[Memory Deleted]:", memoryId);
  } catch (error) {
    console.error("[deleteMemory Error]:", error);
    throw error;
  }
}
