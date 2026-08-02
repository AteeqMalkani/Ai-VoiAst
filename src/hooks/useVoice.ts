import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAssistantReply } from "../services/ai/assistant";
import {
  createRecording,
  finishRecording,
  requestMicrophonePermission,
} from "../services/speech/recorder";
import { speak, stopSpeaking } from "../services/speech/speaker";
import { transcribeAudio } from "../services/speech/transcriber";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

interface UseVoiceOptions {
  vadThresholdDb?: number; // Default: -35dB
  silenceDurationMs?: number; // Default: 1500ms
}

export function useVoice(options?: UseVoiceOptions) {
  const { vadThresholdDb = -35, silenceDurationMs = 1500 } = options || {};

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const recordingRef = useRef<Audio.Recording | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear silence detection timer safely
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Process the full pipeline once speech/silence ends
  const stopAndProcess = useCallback(async () => {
    clearSilenceTimer();

    if (!recordingRef.current) return;

    setState("thinking");

    // 1. Unload recording and obtain URI
    const recordingInstance = recordingRef.current;
    recordingRef.current = null;
    const uri = await finishRecording(recordingInstance);

    if (!uri) {
      setState("idle");
      return;
    }

    try {
      // 2. Transcribe Audio
      const userText = await transcribeAudio(uri);
      setTranscript(userText);

      // 3. Get AI Response
      const aiReply = await getAssistantReply(userText);
      setReply(aiReply);

      // 4. Speak AI Response
      setState("speaking");
      speak(
        aiReply,
        () => setState("idle"), // onDone: reset to idle
        () => setState("idle"), // onError: reset to idle
      );
    } catch (error) {
      console.error("Error processing voice interaction:", error);
      setState("idle");
    }
  }, [clearSilenceTimer]);

  // Metering callback for VAD (Voice Activity Detection)
  const handleStatusUpdate = useCallback(
    (status: Audio.RecordingStatus) => {
      if (!status.isRecording || status.metering === undefined) return;

      const currentDb = status.metering;

      // Noise detected above threshold -> reset silence timer
      if (currentDb > vadThresholdDb) {
        clearSilenceTimer();
      } else {
        // Below threshold -> start countdown if not already running
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            stopAndProcess();
          }, silenceDurationMs);
        }
      }
    },
    [vadThresholdDb, silenceDurationMs, clearSilenceTimer, stopAndProcess],
  );

  // Start listening loop
  const startListening = useCallback(async () => {
    stopSpeaking(); // Interrupt TTS if currently speaking
    clearSilenceTimer();

    const hasPermission = await requestMicrophonePermission(
      permissionResponse,
      requestPermission,
    );

    if (!hasPermission) {
      console.warn("Microphone permission was not granted.");
      return;
    }

    try {
      setTranscript("");
      setReply("");
      setState("listening");

      const recording = await createRecording(handleStatusUpdate);
      recordingRef.current = recording;
    } catch (error) {
      console.error("Failed to start recording:", error);
      setState("idle");
    }
  }, [
    permissionResponse,
    requestPermission,
    clearSilenceTimer,
    handleStatusUpdate,
  ]);

  // Cancel/stop manually
  const stopListening = useCallback(async () => {
    clearSilenceTimer();
    if (recordingRef.current) {
      await finishRecording(recordingRef.current);
      recordingRef.current = null;
    }
    stopSpeaking();
    setState("idle");
  }, [clearSilenceTimer]);

  // Clean up timers and recording on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      stopSpeaking();
    };
  }, [clearSilenceTimer]);

  return {
    state,
    transcript,
    reply,
    startListening,
    stopListening,
  };
}
