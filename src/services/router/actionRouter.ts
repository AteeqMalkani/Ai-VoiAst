// src/services/router/actionRouter.ts

import { Platform } from "react-native";

import { NotePayload, NoteStorageProvider } from "../../types/storage";

import { FirebaseStorageProvider } from "../storage/FirebaseStorageProvider";
import { LocalFileSystemProvider } from "../storage/LocalFileSystemProvider";

export class ActionRouter {
  private noteProvider: NoteStorageProvider;

  constructor(storageDestination: "local" | "firebase", userId?: string) {
    /*
     * ---------------------------------------------------------
     * Firebase Storage
     * ---------------------------------------------------------
     */

    if (storageDestination === "firebase") {
      if (!userId) {
        throw new Error(
          "userId is required when using FirebaseStorageProvider.",
        );
      }

      this.noteProvider = new FirebaseStorageProvider(userId);

      return;
    }

    /*
     * ---------------------------------------------------------
     * Local File System
     * ---------------------------------------------------------
     *
     * LocalFileSystemProvider only works on native
     * platforms. It must never be created on Web.
     */

    if (Platform.OS === "web") {
      throw new Error("LocalFileSystemProvider cannot be used on Web.");
    }

    this.noteProvider = new LocalFileSystemProvider();
  }

  /*
   * ---------------------------------------------------------
   * Handle Intent
   * ---------------------------------------------------------
   */

  async handleIntent(intentData: {
    intent: string;
    title?: string;
    content?: string;
  }) {
    if (intentData.intent === "note") {
      const note: NotePayload = {
        id: Date.now().toString(),

        title: intentData.title?.trim() || "Untitled Note",

        content: intentData.content?.trim() || "",

        createdAt: new Date(),
      };

      return await this.noteProvider.saveNote(note);
    }

    /*
     * Other intents can be added here later:
     *
     * calendar
     * memory
     * reminders
     * email
     * etc.
     */

    return {
      success: false,
      pathOrId: "",
    };
  }
}
