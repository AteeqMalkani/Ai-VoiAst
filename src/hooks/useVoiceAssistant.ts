// src/hooks/useVoiceAssistant.ts
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  resetVoiceDetection,
  shouldStopRecording,
  startRecorder,
  stopRecorder,
} from "@/services/speech/recorder";
import { useVoiceStore } from "@/store/voiceStore";
import { askAI } from "../services/ai/assistant";

const SETTINGS_STORAGE_KEY = "@voiast_general_settings";

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

export function useVoiceAssistant(
  googleToken?: string,
  assistantName: string = "VoiAst",
  userName: string = "Ateeq Malkani",
) {
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Settings configuration states loaded from storage
  const [settings, setSettings] = useState({
    selectedLanguage: "en-US",
    selectedVoice: "",
    responseStyle: "Balanced",
  });

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

  // Load saved general settings on mount
  useEffect(() => {
    async function loadStoredSettings() {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({
            selectedLanguage: parsed.selectedLanguage || "en-US",
            selectedVoice: parsed.selectedVoice || "",
            responseStyle: parsed.responseStyle || "Balanced",
          });
        }
      } catch (error) {
        console.error("Failed to load settings in voice hook:", error);
      }
    }
    loadStoredSettings();
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      Speech.stop();
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const cleanWakeWordPrefix = (text: string): string => {
    const lowerName = assistantName.toLowerCase();
    const pattern = new RegExp(
      `^(hey|hi|ok|hello)?\\s*${lowerName}[,\\s]*`,
      "i",
    );
    return text.replace(pattern, "").trim();
  };

  /**
   * Speaks text using native Expo Speech, applying user's language, voice model, and rate adjustments.
   */
  const speakWithExpoSpeech = (text: string, onDoneCallback?: () => void) => {
    try {
      Speech.stop();
      setState("speaking");

      const speechOptions: Speech.SpeechOptions = {
        language: settings.selectedLanguage,
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          isProcessingRef.current = false;
          if (onDoneCallback) {
            onDoneCallback();
          } else {
            setState("idle");
          }
        },
        onError: (error) => {
          console.error("[useVoiceAssistant] expo-speech Error:", error);
          isProcessingRef.current = false;
          setState("idle");
        },
      };

      // Pass voice identifier if user selected a custom local voice
      if (
        settings.selectedVoice &&
        settings.selectedVoice !== "Default Voice"
      ) {
        speechOptions.voice = settings.selectedVoice;
      }

      Speech.speak(text, speechOptions);
    } catch (error) {
      console.error("[useVoiceAssistant] Speech Invocation Error:", error);
      isProcessingRef.current = false;
      setState("idle");
    }
  };

  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording) return;
    shouldStopRecording(status.metering ?? -160, stopRecordingAndProcess);
  };

  async function startRecording() {
    try {
      Speech.stop();
      clearAllTimers();
      resetVoiceDetection();

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
      console.error("[startRecording Error]:", err);
      isProcessingRef.current = false;
      Alert.alert("Microphone", "Please allow microphone permission.");
    }
  }

  async function stopRecordingAndProcess() {
    if (!recording || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setState("thinking");
    const currentRecording = recording;
    setRecording(null);

    try {
      const uri = await stopRecorder(currentRecording);

      if (!uri) {
        console.warn("No recording URI found.");
        isProcessingRef.current = false;
        setState("idle");
        return;
      }

      const recognizedText = await transcribeAudio(uri);

      if (!recognizedText || recognizedText.trim().length === 0) {
        console.warn("Transcription returned empty string.");
        const fallbackMsg =
          "I couldn't hear you clearly. Could you say that again?";
        setAssistantReply(fallbackMsg);
        speakWithExpoSpeech(fallbackMsg);
        return;
      }

      const cleanedCommand = cleanWakeWordPrefix(recognizedText);
      await processSpeechInteraction(cleanedCommand || recognizedText);
    } catch (error) {
      console.error("Failed to process recording:", error);
      isProcessingRef.current = false;
      setState("idle");
    }
  }

  const isTaskRequest = (input: string): boolean => {
    const lower = input.toLowerCase();
    return TASK_KEYWORDS.some((keyword) => lower.includes(keyword));
  };

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

  const handleConversationalFlow = async (userSpeech: string) => {
    try {
      // Append style context instruction based on user's General preference
      const styledPrompt = `[Response Style Preference: ${settings.responseStyle}] ${userSpeech}`;
      const reply = await askAI(styledPrompt, assistantName, userName);

      setAssistantReply(reply);
      speakWithExpoSpeech(reply);
    } catch (error) {
      console.error("Error in conversational flow:", error);
      isProcessingRef.current = false;
      setState("idle");
    }
  };

  const handleTaskExecutionFlow = async (userSpeech: string) => {
    const initialAck = "On it. Processing your request now.";
    setAssistantReply(initialAck);

    speakWithExpoSpeech(initialAck, async () => {
      setState("executing");
      addExecutionStep("Initializing task runner...");

      const lowerInput = userSpeech.toLowerCase();

      try {
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
        } else if (
          lowerInput.includes("email") ||
          lowerInput.includes("mail")
        ) {
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
            to: "me@example.com",
            subject: `${assistantName} Voice Action`,
            bodyText: userSpeech,
          });

          addExecutionStep("Email sent successfully!");
        } else if (
          lowerInput.includes("note") ||
          lowerInput.includes("remind")
        ) {
          addExecutionStep("Saving note to local storage...");
          await saveNote(userSpeech);
          addExecutionStep("Note saved locally!");
        }

        setLastTask({
          id: Date.now().toString(),
          title: userSpeech,
          status: "completed",
          completedAt: new Date().toLocaleTimeString(),
        });

        setState("done");
        const finalReply = await askAI(
          `Confirm to the user in 1 short sentence (${settings.responseStyle} style) that this task was executed: "${userSpeech}"`,
          assistantName,
          userName,
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

  const handleVoicePress = async () => {
    if (state === "idle" || state === "done") {
      startRecording();
    } else if (state === "listening") {
      stopRecordingAndProcess();
    } else if (state === "speaking" || state === "executing") {
      Speech.stop();
      clearAllTimers();
      isProcessingRef.current = false;
      startRecording();
    }
  };

  return {
    state,
    transcript,
    assistantReply,
    recording,
    startRecording,
    handleVoicePress,
    processSpeechInteraction,
    resetVoiceState,
  };
}
