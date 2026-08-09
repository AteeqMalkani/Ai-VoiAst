import {
  BuiltInKeywords,
  PorcupineManager,
} from "@picovoice/porcupine-react-native";

let porcupineManager: PorcupineManager | null = null;

export async function initWakeWordDetection(
  onWakeWordDetected: () => void,
  accessKey: string,
) {
  try {
    // Listens locally for default built-in keywords like JARVIS, ALEXA, COMPUTER, etc.
    porcupineManager = await PorcupineManager.fromBuiltInKeywords(
      accessKey,
      [BuiltInKeywords.JARVIS], // Select built-in wake word keyword
      () => {
        console.log("[WakeWord]: Wake word detected!");
        onWakeWordDetected();
      },
    );

    await porcupineManager.start();
    console.log("[WakeWord]: Listening for wake word...");
  } catch (error) {
    console.error(
      "[WakeWord Error]: Failed to initialize wake word engine",
      error,
    );
  }
}

export async function stopWakeWordDetection() {
  if (porcupineManager) {
    await porcupineManager.stop();
    await porcupineManager.delete();
    porcupineManager = null;
  }
}
