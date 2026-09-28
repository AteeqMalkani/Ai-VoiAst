// src/services/storage/LocalFileSystemProvider.ts
import * as FileSystem from "expo-file-system/legacy";
import { NotePayload, NoteStorageProvider } from "../../types/storage";

export class LocalFileSystemProvider implements NoteStorageProvider {
  name = "Local File System";
  private targetDir: string;

  constructor() {
    const baseUri = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

    if (!baseUri) {
      throw new Error("No writable file-system directory is available.");
    }

    this.targetDir = `${baseUri}VoiAstNotes/`;
  }

  private async ensureDirectoryExists(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.targetDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.targetDir, {
        intermediates: true,
      });
    }
  }

  async saveNote(note: NotePayload): Promise<{
    success: boolean;
    pathOrId: string;
  }> {
    try {
      await this.ensureDirectoryExists();

      const safeTitle = note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const filePath = `${this.targetDir}${safeTitle}_${note.id}.md`;

      const markdownContent =
        `# ${note.title}\n\n` +
        `*Created: ${note.createdAt.toISOString()}*\n\n` +
        note.content;

      await FileSystem.writeAsStringAsync(filePath, markdownContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("[VoiAst] Note written to local path:", filePath);

      return {
        success: true,
        pathOrId: filePath,
      };
    } catch (error) {
      console.error("[VoiAst] Failed to save note locally:", error);

      return {
        success: false,
        pathOrId: "",
      };
    }
  }

  async getNotes(): Promise<NotePayload[]> {
    try {
      await this.ensureDirectoryExists();

      const fileNames = await FileSystem.readDirectoryAsync(this.targetDir);
      const markdownFiles = fileNames.filter((file) => file.endsWith(".md"));

      const notes = await Promise.all(
        markdownFiles.map(async (fileName) => {
          const filePath = `${this.targetDir}${fileName}`;
          const rawContent = await FileSystem.readAsStringAsync(filePath);

          // Extract title from first line (# Title) or fallback to filename
          const titleMatch = rawContent.match(/^#\s+(.*)/);
          const title = titleMatch
            ? titleMatch[1]
            : fileName.replace(/\.md$/, "");
          const createdAtMatch = rawContent.match(
            /^\*Created:\s*(.*?)\*$/m,
          );
          const createdAt = createdAtMatch
            ? new Date(createdAtMatch[1])
            : new Date();

          return {
            id: fileName.replace(/\.md$/, ""),
            title,
            content: rawContent,
            createdAt,
          };
        }),
      );

      return notes;
    } catch (error) {
      console.error("[VoiAst] Failed to read local notes:", error);
      return [];
    }
  }

  async deleteNote(filePath: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      return true;
    } catch (error) {
      console.error("[VoiAst] Failed to delete local note:", error);
      return false;
    }
  }
}
