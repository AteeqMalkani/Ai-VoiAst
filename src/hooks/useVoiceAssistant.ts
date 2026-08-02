import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { generateReply, transcribeAudio } from "@/services/ai/assistant";
import {
  shouldStopRecording,
  startRecorder,
  stopRecorder,
} from "@/services/speech/recorder";
import { speak, stopSpeaking } from "@/services/speech/speaker";
import { useVoiceStore } from "@/store/voiceStore";

export function useVoiceAssistant() {
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const { state, transcript, setState, setTranscript } = useVoiceStore();

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
      stopSpeaking();
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Monitor audio levels for Silence Auto-Detection
  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording) return;

    shouldStopRecording(status.metering ?? -160, stopRecordingAndProcess);
  };

  // 1. Start Voice Recording with Silence Detection (VAD)
  async function startRecording() {
    try {
      stopSpeaking();

      const newRecording = await startRecorder(
        permissionResponse,
        requestPermission,
        onRecordingStatusUpdate,
      );

      setRecording(newRecording);
      setTranscript("");
      setAssistantReply(null);
      setState("listening");
    } catch (err) {
      console.error(err);
      Alert.alert("Microphone", "Please allow microphone permission.");
    }
  }

  // 2. Stop Voice Recording & Generate Voice Reply
  async function stopRecordingAndProcess() {
    if (!recording) return;

    setState("thinking");
    const currentRecording = recording;
    setRecording(null);

    try {
      const uri = await stopRecorder(currentRecording);

      // Convert recorded audio file to text using assistant service
      const recognizedText = uri ? await transcribeAudio(uri) : "Hello";

      processSpeechInteraction(recognizedText);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setState("idle");
    }
  }

  // 3. Conversational Pipeline with Voice Output
  const processSpeechInteraction = (userSpeech: string) => {
    clearAllTimers();
    setTranscript(userSpeech);

    const t1 = setTimeout(async () => {
      const reply = await generateReply(userSpeech);

      setAssistantReply(reply);

      await speak(
        reply,
        () => setState("speaking"),
        () => setState("idle"),
        () => setState("idle"),
      );
    }, 800);

    timerRefs.current.push(t1);
  };

  const handleVoicePress = () => {
    if (state === "idle") {
      startRecording();
    } else if (state === "listening") {
      // Allow manual override stop if user taps early
      stopRecordingAndProcess();
    } else if (state === "speaking") {
      // Tap while speaking stops the voice reply immediately
      stopSpeaking();
      setState("idle");
    }
  };

  return {
    state,
    transcript,
    assistantReply,
    recording,
    handleVoicePress,
    processSpeechInteraction,
  };
}
