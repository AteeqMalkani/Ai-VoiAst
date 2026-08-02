import * as Speech from "expo-speech";

export async function speak(
  text: string,
  onStart?: () => void,
  onDone?: () => void,
  onError?: () => void,
) {
  return new Promise<void>((resolve) => {
    onStart?.();

    Speech.speak(text, {
      language: "en-US",
      pitch: 1,
      rate: 0.95,

      onDone: () => {
        onDone?.();
        resolve();
      },

      onStopped: () => {
        onDone?.();
        resolve();
      },

      onError: () => {
        onError?.();
        resolve();
      },
    });
  });
}

export function stopSpeaking() {
  Speech.stop();
}
