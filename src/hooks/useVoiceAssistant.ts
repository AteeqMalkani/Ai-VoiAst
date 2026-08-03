import { generateReply, transcribeAudio } from "@/services/ai/assistant";
import {
  shouldStopRecording,
  startRecorder,
  stopRecorder,
} from "@/services/speech/recorder";
import { speak, stopSpeaking } from "@/services/speech/speaker";
import { useVoiceStore } from "@/store/voiceStore";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

const TASK_KEYWORDS = [
  "email",
  "mail",
  "schedule",
  "meeting",
  "calendar",
  "note",
  "automate",
  "remind",
];

export function useVoiceAssistant() {
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const {
    state,
    transcript,
    setState,
    setTranscript,
    addExecutionStep,
    setExecutionSteps,
    setLastTask,
    resetVoiceState,
  } = useVoiceStore();

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

  // 1. Start Voice Recording
  async function startRecording() {
    try {
      stopSpeaking();
      clearAllTimers();

      const newRecording = await startRecorder(
        permissionResponse,
        requestPermission,
        onRecordingStatusUpdate,
      );

      setRecording(newRecording);
      setTranscript("");
      setAssistantReply(null);
      setExecutionSteps([]);
      setState("listening");
    } catch (err) {
      console.error(err);
      Alert.alert("Microphone", "Please allow microphone permission.");
    }
  }

  // 2. Stop Voice Recording & Process Pipeline
  // Stop Voice Recording & Process Pipeline
  async function stopRecordingAndProcess() {
    if (!recording) return;

    setState("thinking");
    const currentRecording = recording;
    setRecording(null);

    try {
      const uri = await stopRecorder(currentRecording);

      if (!uri) {
        console.warn("No recording URI found.");
        setState("idle");
        return;
      }

      // 1. Get real transcript from audio file
      const recognizedText = await transcribeAudio(uri);

      // 2. Fallback check if user said nothing or VAD triggered on ambient noise
      if (!recognizedText || recognizedText.trim().length === 0) {
        console.warn("Transcription returned empty string.");
        setAssistantReply(
          "I couldn't hear you clearly. Could you say that again?",
        );

        speak("I couldn't hear you clearly. Could you say that again?", {
          onStart: () => setState("speaking"),
          onDone: () => setState("idle"),
          onError: () => setState("idle"),
        });
        return;
      }

      // 3. Process valid user transcript
      processSpeechInteraction(recognizedText);
    } catch (error) {
      console.error("Failed to process recording:", error);
      setState("idle");
    }
  }

  // Helper to determine if prompt is an action task
  const isTaskRequest = (input: string): boolean => {
    const lower = input.toLowerCase();
    return TASK_KEYWORDS.some((keyword) => lower.includes(keyword));
  };

  // 3. Main Pipeline Coordinator
  const processSpeechInteraction = async (userSpeech: string) => {
    clearAllTimers();
    setTranscript(userSpeech);
    setExecutionSteps([]);

    if (isTaskRequest(userSpeech)) {
      await handleTaskExecutionFlow(userSpeech);
    } else {
      await handleConversationalFlow(userSpeech);
    }
  };

  // ─── FLOW A: Conversational (Chat / Q&A) ───────────────────────────────────
  // Listening -> Thinking -> Speaking -> Idle
  const handleConversationalFlow = async (userSpeech: string) => {
    const t1 = setTimeout(async () => {
      const reply = await generateReply(userSpeech);
      setAssistantReply(reply);

      speak(reply, {
        onStart: () => setState("speaking"),
        onDone: () => setState("idle"),
        onError: () => setState("idle"),
      });
    }, 500);

    timerRefs.current.push(t1);
  };

  // ─── FLOW B: Task Execution ────────────────────────────────────────────────
  // Listening -> Thinking -> Speaking ("On it") -> Executing -> Done -> Speaking -> Idle
  const handleTaskExecutionFlow = async (userSpeech: string) => {
    const initialAck = "On it. Processing your request now.";
    setAssistantReply(initialAck);

    // Step 1: Speak initial acknowledgment
    speak(initialAck, {
      onStart: () => setState("speaking"),
      onDone: async () => {
        // Step 2: Transition to Executing state
        setState("executing");
        addExecutionStep("Initializing task runner...");

        // Simulate step progress
        const tStep1 = setTimeout(() => {
          addExecutionStep(`Parsing action parameters for: "${userSpeech}"`);
        }, 800);

        const tStep2 = setTimeout(async () => {
          addExecutionStep("Executing service payload...");

          // Record task result in store
          setLastTask({
            id: Date.now().toString(),
            title: userSpeech,
            status: "completed",
            completedAt: new Date().toLocaleTimeString(),
          });

          // Step 3: Transition to Done state
          setState("done");
          const finalReply = await generateReply(userSpeech);
          setAssistantReply(finalReply);

          // Step 4: Speak final completion message and reset to Idle
          speak(finalReply, {
            onStart: () => setState("speaking"),
            onDone: () => setState("idle"),
            onError: () => setState("idle"),
          });
        }, 2000);

        timerRefs.current.push(tStep1, tStep2);
      },
      onError: () => setState("idle"),
    });
  };

  // 4. Orb Press Interactor
  const handleVoicePress = () => {
    if (state === "idle" || state === "done") {
      startRecording();
    } else if (state === "listening") {
      stopRecordingAndProcess();
    } else if (state === "speaking" || state === "executing") {
      stopSpeaking();
      clearAllTimers();
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
    resetVoiceState,
  };
}
