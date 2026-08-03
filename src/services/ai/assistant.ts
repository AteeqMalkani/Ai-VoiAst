import * as FileSystem from "expo-file-system/legacy";
import { askGemini } from "./gemini";

/**
 * Reads local audio file and transcribes it using Gemini Audio API
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  try {
    console.log("Processing audio file at:", audioUri);

    // 1. Convert local audio file into Base64 format using the legacy FileSystem API
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!base64Audio) {
      throw new Error("Failed to convert audio file to base64");
    }

    // 2. Prepare inline audio payload & text prompt parts for Gemini
    const audioPart = {
      inlineData: {
        mimeType: "audio/m4a", // Expo AV default recording format
        data: base64Audio,
      },
    };

    const textPart = {
      text: "Transcribe the user's spoken audio accurately. Output ONLY the exact transcribed text without any quotes, extra punctuation, or comments.",
    };

    // 3. Request transcription from Gemini by passing array of parts
    const transcribedText = await askGemini([audioPart, textPart]);
    const cleanedText =
      typeof transcribedText === "string" ? transcribedText.trim() : "";

    console.log("Recognized Speech:", cleanedText);
    return cleanedText;
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    return "";
  }
}

export async function generateReply(message: string): Promise<string> {
  return await askGemini(message);
}
