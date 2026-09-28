import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

import { useAuth } from "@/hooks/useAuth";

import { askAI } from "@/services/ai/assistant";
import { detectIntent, IntentResult } from "@/services/ai/intent";

import { createGoogleCalendarEvent } from "@/services/apps/googleServices";

import { saveMemory } from "@/services/firestore/memories";

import { ActionRouter } from "@/services/router/actionRouter";

import { transcribeAudio } from "@/services/speech/elevenSTT";

import {
  resetVoiceDetection,
  shouldStopRecording,
  startRecorder,
  stopRecorder,
} from "@/services/speech/recorder";

import { useVoiceStore } from "@/store/voiceStore";

const SETTINGS_STORAGE_KEY = "@voiast_general_settings";

export function useVoiceAssistant(
  googleToken?: string,
  assistantName: string = "VoiAst",
  userName: string = "Ateeq Malkani",
) {
  const { user } = useAuth();

  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isProcessingRef = useRef<boolean>(false);

  /*
   * ---------------------------------------------------------
   * Action Router
   * ---------------------------------------------------------
   *
   * Native:
   *   LocalFileSystemProvider
   *
   * Web:
   *   FirebaseStorageProvider
   *
   * We intentionally do NOT create the router directly
   * inside useRef because that would execute the constructor
   * during render.
   */

  const routerRef = useRef<ActionRouter | null>(null);

  useEffect(() => {
    /*
     * Web cannot use Expo's native filesystem.
     * Therefore use Firebase storage on Web.
     */
    if (Platform.OS === "web") {
      if (!user?.uid) {
        routerRef.current = null;
        return;
      }

      routerRef.current = new ActionRouter("firebase", user.uid);

      return;
    }

    /*
     * Native Android/iOS can use the local filesystem.
     */
    routerRef.current = new ActionRouter("local", user?.uid);
  }, [user?.uid]);

  const [assistantReply, setAssistantReply] = useState<string | null>(null);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

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

  /*
   * ---------------------------------------------------------
   * Utility
   * ---------------------------------------------------------
   */

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const addCompletedTask = (title: string) => {
    setLastTask({
      id: Date.now().toString(),
      title,
      status: "completed",
      completedAt: new Date().toLocaleTimeString(),
    });
  };

  /*
   * ---------------------------------------------------------
   * Load Settings
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function loadStoredSettings() {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (!stored) {
          return;
        }

        const parsed = JSON.parse(stored);

        setSettings({
          selectedLanguage: parsed.selectedLanguage || "en-US",

          selectedVoice: parsed.selectedVoice || "",

          responseStyle: parsed.responseStyle || "Balanced",
        });
      } catch (error) {
        console.error("[VoiAst] Failed to load settings:", error);
      }
    }

    loadStoredSettings();
  }, []);

  /*
   * ---------------------------------------------------------
   * Cleanup
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      clearAllTimers();

      Speech.stop();

      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Wake Word Cleaning
   * ---------------------------------------------------------
   */

  const cleanWakeWordPrefix = (text: string): string => {
    const escapedName = assistantName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `^(hey|hi|ok|okay|hello)?\\s*${escapedName}[,\\s]*`,
      "i",
    );

    return text.replace(pattern, "").trim();
  };

  /*
   * ---------------------------------------------------------
   * Speech Output
   * ---------------------------------------------------------
   */

  const speakWithExpoSpeech = (text: string, onDoneCallback?: () => void) => {
    if (!text || !text.trim()) {
      isProcessingRef.current = false;
      setState("idle");
      return;
    }

    try {
      Speech.stop();

      setState("speaking");

      const speechOptions: Speech.SpeechOptions = {
        language: settings.selectedLanguage,

        pitch: 1.0,
        rate: 1.0,

        onDone: () => {
          if (onDoneCallback) {
            onDoneCallback();
          } else {
            isProcessingRef.current = false;
            setState("idle");
          }
        },

        onError: (error) => {
          console.error("[VoiAst] Expo Speech Error:", error);

          isProcessingRef.current = false;
          setState("idle");
        },
      };

      if (
        settings.selectedVoice &&
        settings.selectedVoice !== "Default Voice"
      ) {
        speechOptions.voice = settings.selectedVoice;
      }

      Speech.speak(text, speechOptions);
    } catch (error) {
      console.error("[VoiAst] Speech invocation error:", error);

      isProcessingRef.current = false;
      setState("idle");
    }
  };

  /*
   * ---------------------------------------------------------
   * Recording
   * ---------------------------------------------------------
   */

  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording) {
      return;
    }

    shouldStopRecording(status.metering ?? -160, stopRecordingAndProcess);
  };

  async function startRecording() {
    if (isProcessingRef.current) {
      return;
    }

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
    } catch (error) {
      console.error("[VoiAst] Start recording error:", error);

      isProcessingRef.current = false;

      Alert.alert(
        "Microphone",
        "Please allow microphone permission to use VoiAst.",
      );
    }
  }

  async function stopRecordingAndProcess() {
    if (!recording || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    setState("thinking");

    const currentRecording = recording;

    setRecording(null);

    try {
      const uri = await stopRecorder(currentRecording);

      if (!uri) {
        throw new Error("Recording stopped but no audio URI was returned.");
      }

      console.log("[VoiAst] Transcribing audio...");

      const recognizedText = await transcribeAudio(uri);

      if (!recognizedText || !recognizedText.trim()) {
        const reply = "I couldn't hear you clearly. Could you say that again?";

        setAssistantReply(reply);

        speakWithExpoSpeech(reply);

        return;
      }

      const cleanedCommand = cleanWakeWordPrefix(recognizedText);

      const userSpeech = cleanedCommand || recognizedText.trim();

      console.log("[VoiAst] User:", userSpeech);

      await processSpeechInteraction(userSpeech);
    } catch (error) {
      console.error("[VoiAst] Voice processing error:", error);

      const reply = "Sorry, I had trouble processing that. Please try again.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    }
  }

  /*
   * ---------------------------------------------------------
   * MEMORY
   * ---------------------------------------------------------
   */

  const handleMemoryIntent = async (
    userSpeech: string,
    intent: IntentResult,
  ) => {
    if (!user?.uid) {
      const reply = "Please sign in so I can remember that for you.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);

      return;
    }

    try {
      setState("executing");

      addExecutionStep("Understanding what you want me to remember...");

      const content = intent.content?.trim() || userSpeech.trim();

      const title = intent.title?.trim() || "General Memory";

      addExecutionStep("Saving to VoiAst memory...");

      await saveMemory(user.uid, content, title);

      addExecutionStep("Memory saved successfully!");

      addCompletedTask(title);

      setState("done");

      const reply = "Got it. I'll remember that.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    } catch (error) {
      console.error("[VoiAst] Memory save error:", error);

      const reply = "I couldn't save that to memory right now.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    }
  };

  /*
   * ---------------------------------------------------------
   * CALENDAR
   * ---------------------------------------------------------
   */

  const handleCalendarIntent = async (
    userSpeech: string,
    intent: IntentResult,
  ) => {
    if (!googleToken) {
      const reply =
        "Please connect your Google Account in Settings to manage Calendar events.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);

      return;
    }

    try {
      setState("executing");

      addExecutionStep("Understanding your calendar request...");

      const calendarSummary =
        intent.content?.trim() || intent.title?.trim() || userSpeech.trim();

      addExecutionStep("Creating the calendar event...");

      await createGoogleCalendarEvent({
        accessToken: googleToken,
        summary: calendarSummary,
      });

      addExecutionStep("Calendar event created successfully!");

      addCompletedTask(intent.title || calendarSummary);

      setState("done");

      const reply = "Done. I've added that to your calendar.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    } catch (error) {
      console.error("[VoiAst] Calendar error:", error);

      const reply = "I couldn't create that calendar event.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    }
  };

  /*
   * ---------------------------------------------------------
   * NORMAL CHAT
   * ---------------------------------------------------------
   */

  const handleConversationalFlow = async (userSpeech: string) => {
    try {
      setState("thinking");

      const styledPrompt = `
Response style preference: ${settings.responseStyle}

User:
${userSpeech}
      `.trim();

      const reply = await askAI(styledPrompt, assistantName, userName);

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    } catch (error) {
      console.error("[VoiAst] Conversational flow error:", error);

      const reply =
        "I'm having trouble responding right now. Please try again.";

      setAssistantReply(reply);

      speakWithExpoSpeech(reply);
    }
  };

  /*
   * ---------------------------------------------------------
   * MAIN INTENT PROCESSOR
   * ---------------------------------------------------------
   */

  const processSpeechInteraction = async (userSpeech: string) => {
    clearAllTimers();

    setTranscript(userSpeech);

    setExecutionSteps([]);

    try {
      addExecutionStep("Understanding your request...");

      const intent = await detectIntent(userSpeech);

      console.log("[VoiAst Intent]:", intent);

      switch (intent.intent) {
        /*
         * ---------------------------------------------------
         * NOTE
         * ---------------------------------------------------
         */

        case "note": {
          setState("executing");

          addExecutionStep("Understanding your note...");

          const title = intent.title?.trim() || "VoiAst Note";

          const content = intent.content?.trim() || userSpeech.trim();

          /*
           * Make sure the storage provider has been
           * initialized after authentication.
           */

          if (!routerRef.current) {
            if (!user?.uid) {
              throw new Error("User must be signed in before saving a note.");
            }

            throw new Error("Storage provider is not initialized yet.");
          }

          if (Platform.OS === "web") {
            addExecutionStep("Saving note to cloud storage...");
          } else {
            addExecutionStep("Saving note to local storage...");
          }

          const response = await routerRef.current.handleIntent({
            intent: "note",
            title,
            content,
          });

          if (!response?.success) {
            throw new Error("Failed to save note.");
          }

          console.log("[VoiAst] Note saved:", response.pathOrId);

          if (Platform.OS === "web") {
            addExecutionStep("Note saved to your account!");
          } else {
            addExecutionStep("Note saved locally!");
          }

          addCompletedTask(title);

          setState("done");

          const reply =
            Platform.OS === "web"
              ? "I've saved that note to your account."
              : "I've saved that as a note on your computer.";

          setAssistantReply(reply);

          speakWithExpoSpeech(reply);

          return;
        }

        /*
         * ---------------------------------------------------
         * MEMORY
         * ---------------------------------------------------
         */

        case "memory":
          await handleMemoryIntent(userSpeech, intent);
          return;

        /*
         * ---------------------------------------------------
         * CALENDAR
         * ---------------------------------------------------
         */

        case "calendar_event":
          await handleCalendarIntent(userSpeech, intent);
          return;

        /*
         * ---------------------------------------------------
         * CHAT
         * ---------------------------------------------------
         */

        case "chat":
        default:
          await handleConversationalFlow(userSpeech);

          return;
      }
    } catch (error) {
      console.error("[VoiAst] Intent processing error:", error);

      await handleConversationalFlow(userSpeech);
    }
  };

  /*
   * ---------------------------------------------------------
   * MAIN VOICE BUTTON
   * ---------------------------------------------------------
   */

  const handleVoicePress = async () => {
    if (state === "idle" || state === "done") {
      await startRecording();
      return;
    }

    if (state === "listening") {
      await stopRecordingAndProcess();
      return;
    }

    if (state === "speaking" || state === "executing") {
      Speech.stop();

      clearAllTimers();

      isProcessingRef.current = false;

      await startRecording();

      return;
    }
  };

  /*
   * ---------------------------------------------------------
   * RETURN API
   * ---------------------------------------------------------
   */

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
