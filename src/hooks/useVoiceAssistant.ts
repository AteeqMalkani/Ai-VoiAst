import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import {
  createGoogleCalendarEvent,
  sendGmail,
} from "@/services/apps/googleServices";
import { saveNote } from "@/services/apps/notes";
import { transcribeAudio } from "@/services/speech/elevenSTT";
import {
  shouldStopRecording,
  startRecorder,
  stopRecorder,
} from "@/services/speech/recorder";
import { useVoiceStore } from "@/store/voiceStore";
import { askAI } from "../services/ai/openrouter";

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

export function useVoiceAssistant(googleToken?: string) {
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
      Speech.stop();
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  /**
   * Speaks text using native Expo Speech (Device-level TTS)
   */
  const speakWithExpoSpeech = (text: string, onDoneCallback?: () => void) => {
    try {
      Speech.stop();
      setState("speaking");

      Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          if (onDoneCallback) {
            onDoneCallback();
          } else {
            setState("idle");
          }
        },
        onError: (error) => {
          console.error("[useVoiceAssistant] expo-speech Error:", error);
          setState("idle");
        },
      });
    } catch (error) {
      console.error("[useVoiceAssistant] Speech Invocation Error:", error);
      setState("idle");
    }
  };

  // Monitor audio levels for Silence Auto-Detection
  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording) return;

    shouldStopRecording(status.metering ?? -160, stopRecordingAndProcess);
  };

  // 1. Start Voice Recording
  async function startRecording() {
    try {
      Speech.stop();
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

      // Transcribe audio via ElevenLabs STT
      const recognizedText = await transcribeAudio(uri);

      if (!recognizedText || recognizedText.trim().length === 0) {
        console.warn("Transcription returned empty string.");
        const fallbackMsg =
          "I couldn't hear you clearly. Could you say that again?";
        setAssistantReply(fallbackMsg);
        speakWithExpoSpeech(fallbackMsg);
        return;
      }

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
  const handleConversationalFlow = async (userSpeech: string) => {
    try {
      const reply = await askAI(userSpeech);
      setAssistantReply(reply);
      speakWithExpoSpeech(reply);
    } catch (error) {
      console.error("Error in conversational flow:", error);
      setState("idle");
    }
  };

  // ─── FLOW B: Task Execution ────────────────────────────────────────────────
  const handleTaskExecutionFlow = async (userSpeech: string) => {
    const initialAck = "On it. Processing your request now.";
    setAssistantReply(initialAck);

    speakWithExpoSpeech(initialAck, async () => {
      setState("executing");
      addExecutionStep("Initializing task runner...");

      const lowerInput = userSpeech.toLowerCase();

      try {
        // Route 1: Calendar Integration
        if (
          lowerInput.includes("meeting") ||
          lowerInput.includes("schedule") ||
          lowerInput.includes("calendar")
        ) {
          if (!googleToken) {
            const authErr =
              "Please connect your Google Account in Settings to manage Calendar events.";
            setAssistantReply(authErr);
            speakWithExpoSpeech(authErr);
            return;
          }

          addExecutionStep("Parsing calendar request...");
          addExecutionStep("Calling Google Calendar API...");

          await createGoogleCalendarEvent({
            accessToken: googleToken,
            summary: userSpeech,
          });

          addExecutionStep("Event added to Google Calendar!");
        }
        // Route 2: Gmail Integration
        else if (lowerInput.includes("email") || lowerInput.includes("mail")) {
          if (!googleToken) {
            const authErr =
              "Please connect your Google Account in Settings to send emails.";
            setAssistantReply(authErr);
            speakWithExpoSpeech(authErr);
            return;
          }

          addExecutionStep("Preparing email payload...");
          addExecutionStep("Sending message via Gmail API...");

          await sendGmail({
            accessToken: googleToken,
            to: "me@example.com", // Adjust or parse dynamically
            subject: "VoiAst Voice Action",
            bodyText: userSpeech,
          });

          addExecutionStep("Email sent successfully!");
        }
        // Route 3: Local Notes Integration ($0 Local Storage)
        else if (lowerInput.includes("note") || lowerInput.includes("remind")) {
          addExecutionStep("Saving note to local storage...");
          await saveNote(userSpeech);
          addExecutionStep("Note saved locally!");
        }

        // Complete task in store
        setLastTask({
          id: Date.now().toString(),
          title: userSpeech,
          status: "completed",
          completedAt: new Date().toLocaleTimeString(),
        });

        setState("done");
        const finalReply = await askAI(
          `Confirm to the user in 1 short sentence that this task was executed: "${userSpeech}"`,
        );
        setAssistantReply(finalReply);
        speakWithExpoSpeech(finalReply);
      } catch (err) {
        console.error("[handleTaskExecutionFlow Error]:", err);
        const failMsg =
          "Sorry, I encountered an issue executing that service request.";
        setAssistantReply(failMsg);
        speakWithExpoSpeech(failMsg);
      }
    });
  };

  // 4. Orb Press Interactor
  const handleVoicePress = async () => {
    if (state === "idle" || state === "done") {
      startRecording();
    } else if (state === "listening") {
      stopRecordingAndProcess();
    } else if (state === "speaking" || state === "executing") {
      Speech.stop();
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
