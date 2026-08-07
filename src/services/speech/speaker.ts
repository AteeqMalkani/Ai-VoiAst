import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Paths, File } from "expo-file-system";

export interface SpeakOptions {
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
}

let currentSound: Audio.Sound | null = null;

export async function stopSpeaking(): Promise<void> {
  try {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
  } catch (error) {
    console.error("[Speaker] Error stopping audio:", error);
  }
}

export async function playAudioBuffer(
  audioBuffer: ArrayBuffer,
  options?: SpeakOptions,
): Promise<boolean> {
  try {
    await stopSpeaking();

    // Use modern Expo FileSystem Paths & File API
    const outputFile = new File(Paths.cache, "elevenlabs_output.mp3");

    // Ensure directory exists and write Uint8Array directly
    const uint8Array = new Uint8Array(audioBuffer);
    outputFile.write(uint8Array);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: outputFile.uri },
      { shouldPlay: true },
    );

    currentSound = sound;
    options?.onStart?.();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      if (status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
        options?.onDone?.();
      }
    });

    return true;
  } catch (error) {
    // Fallback implementation if new API is disabled/unlinked in runtime
    return await playAudioBufferLegacy(audioBuffer, options);
  }
}

async function playAudioBufferLegacy(
  audioBuffer: ArrayBuffer,
  options?: SpeakOptions,
): Promise<boolean> {
  try {
    const legacyCacheDir = (FileSystem as Record<string, any>).cacheDirectory;
    if (!legacyCacheDir) {
      throw new Error("Unable to resolve local cache directory.");
    }

    const fileUri = `${legacyCacheDir}elevenlabs_output.mp3`;
    const base64Audio = arrayBufferToBase64(audioBuffer);

    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true },
    );

    currentSound = sound;
    options?.onStart?.();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      if (status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
        options?.onDone?.();
      }
    });

    return true;
  } catch (err) {
    console.error("[Speaker] Legacy Playback Error:", err);
    options?.onError?.(err);
    return false;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
