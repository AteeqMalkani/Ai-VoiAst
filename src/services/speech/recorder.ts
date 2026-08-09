import { Audio } from "expo-av";

// -42 dB is a safer baseline for quiet environments/mobile microphones
export const SILENCE_THRESHOLD_DB = -42;
export const SILENCE_DURATION_MS = 1500;

let lastSpokenTime = Date.now();
let isStopping = false;

export function resetVoiceDetection() {
  lastSpokenTime = Date.now();
  isStopping = false;
}

export function shouldStopRecording(metering: number, onSilence: () => void) {
  if (isStopping) return;

  // Metering values range from -160 (silence) to 0 (max volume)
  if (metering > SILENCE_THRESHOLD_DB) {
    lastSpokenTime = Date.now();
    return;
  }

  const silenceDuration = Date.now() - lastSpokenTime;

  if (silenceDuration >= SILENCE_DURATION_MS) {
    isStopping = true;
    console.log(
      "[Recorder]: Silence threshold reached. Auto-stopping recording...",
    );
    onSilence();
  }
}

export async function startRecorder(
  permissionResponse: Audio.PermissionResponse | null,
  requestPermission: () => Promise<Audio.PermissionResponse>,
  onStatus: (status: Audio.RecordingStatus) => void,
) {
  if (permissionResponse?.status !== "granted") {
    const permission = await requestPermission();

    if (!permission.granted) {
      throw new Error("Microphone permission denied.");
    }
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  resetVoiceDetection();

  // Explicit preset config ensuring platform-specific metering is enabled
  const recordingOptions: Audio.RecordingOptions = {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
    android: {
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
      // Android metering enabled option is handled by top-level isMeteringEnabled
    },
    ios: {
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
      // iOS RecordingOptionsIOS has no meteringEnabled property; use isMeteringEnabled
    },
  };

  const { recording } = await Audio.Recording.createAsync(
    recordingOptions,
    onStatus,
    100, // Status callback interval in ms
  );

  return recording;
}

export async function stopRecorder(
  recording: Audio.Recording,
): Promise<string | null> {
  try {
    await recording.stopAndUnloadAsync();
  } catch (error) {
    console.warn("[Recorder]: Error stopping recording:", error);
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  return recording.getURI();
}
