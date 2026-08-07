import * as Speech from "expo-speech";
import { transcribeAudio } from "../speech/elevenSTT";
import { askAI } from "./openrouter";

export interface VoiceAssistantResponse {
  userText: string;
  assistantText: string;
}

/**
 * Native Text-to-Speech Helper (expo-speech)
 * Speaks text using local device hardware without network/API costs.
 */
export function speakText(
  text: string,
  onDone?: () => void,
  onError?: (error: Error) => void,
): void {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 1.0,
      onDone,
      onError: (err: any) => {
        console.error("[Assistant] expo-speech execution error:", err);
        if (onError) onError(new Error("Speech playback failed"));
      },
    });
  } catch (error) {
    console.error("[Assistant] Error initiating speech:", error);
    if (onError) onError(error as Error);
  }
}

/**
 * Stops any ongoing native speech synthesis
 */
export function stopSpeech(): void {
  Speech.stop();
}

/**
 * End-to-end voice processing cycle:
 * Audio File -> ElevenLabs STT -> OpenRouter API -> Local Device TTS (expo-speech)
 */
export async function processVoiceInput(
  audioUri: string,
): Promise<VoiceAssistantResponse> {
  try {
    console.log("[Assistant] Processing recorded audio:", audioUri);

    // 1. Transcribe audio input using ElevenLabs Scribe STT
    const userText = await transcribeAudio(audioUri);
    console.log("[Assistant] User Said:", userText);

    if (!userText || !userText.trim()) {
      throw new Error("Empty transcription returned from STT.");
    }

    // 2. Pass text prompt to OpenRouter
    const assistantText = await askAI(userText);
    console.log("[Assistant] OpenRouter Reply:", assistantText);

    // 3. Play assistant text response locally via device native TTS
    speakText(assistantText);

    return {
      userText,
      assistantText,
    };
  } catch (error) {
    console.error("[Assistant] Error processing voice input pipeline:", error);
    throw error;
  }
}

/**
 * Text-only pipeline helper for chat input or non-voice triggers
 */
export async function generateReply(message: string): Promise<string> {
  return await askAI(message);
}
