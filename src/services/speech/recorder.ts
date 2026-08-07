import { Audio } from "expo-av";

export const SILENCE_THRESHOLD_DB = -35;
export const SILENCE_DURATION_MS = 1500;

let lastSpokenTime = Date.now();
let isStopping = false;

export function resetVoiceDetection() {
  lastSpokenTime = Date.now();
  isStopping = false;
}

export function shouldStopRecording(metering: number, onSilence: () => void) {
  if (isStopping) return;

  if (metering > SILENCE_THRESHOLD_DB) {
    lastSpokenTime = Date.now();
    return;
  }

  const silence = Date.now() - lastSpokenTime;

  if (silence > SILENCE_DURATION_MS) {
    isStopping = true;
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

  const { recording } = await Audio.Recording.createAsync(
    {
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    },
    onStatus,
    100,
  );

  return recording;
}

export async function stopRecorder(
  recording: Audio.Recording,
): Promise<string | null> {
  await recording.stopAndUnloadAsync();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  return recording.getURI();
}
