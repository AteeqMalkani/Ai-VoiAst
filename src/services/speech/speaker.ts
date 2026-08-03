import * as Speech from "expo-speech";

interface SpeakOptions {
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Synthesizes text to speech with status callbacks.
 */
export function speak(text?: string | null, options?: SpeakOptions): boolean {
  if (!text || text.trim().length === 0) {
    console.log("[Speaker] No text provided to speak.");
    options?.onDone?.();
    return false;
  }

  try {
    // Interrupt any active speech before playing new audio
    Speech.stop();

    Speech.speak(text.trim(), {
      language: "en-US",
      pitch: 1.0,
      rate: 0.95,
      onStart: () => {
        options?.onStart?.();
      },
      onDone: () => {
        options?.onDone?.();
      },
      onError: (err) => {
        console.error("[Speaker] Playback Error:", err);
        options?.onError?.(err);
      },
    });

    return true;
  } catch (error) {
    console.error("[Speaker] Failed to initialize speech:", error);
    options?.onError?.(error);
    return false;
  }
}

/**
 * Immediately stops any ongoing speech output.
 */
export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch (error) {
    console.error("[Speaker] Error stopping speech:", error);
  }
}
