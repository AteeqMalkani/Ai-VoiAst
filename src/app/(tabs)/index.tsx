import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useVoiceStore } from "@/store/voiceStore";

import { HeaderSettings } from "@/components/home/HeaderSettings";
import Header from "@/components/layout/Header";
import QuickAction from "@/components/ui/QuickAction";
import StatusBadge from "@/components/ui/StatusBadge";
import VoiceOrb from "@/components/voice/VoiceOrb";
import Waveform from "@/components/voice/Waveform";

// Configuration for Voice Activity Detection (VAD)
const SILENCE_THRESHOLD_DB = -35; // Volume threshold below which is considered silence
const SILENCE_DURATION_MS = 1500; // Duration of silence to trigger auto-stop (1.5s)

function getAssistantReply(userSpeech: string): string {
  const lower = userSpeech.toLowerCase().trim();

  if (
    lower.includes("hi") ||
    lower.includes("hello") ||
    lower.includes("hey")
  ) {
    const greetings = [
      "Hello! How are you doing today?",
      "Hi there! How was your day?",
      "Hey! How can I make your day easier?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else if (lower.includes("how are you")) {
    return "I'm doing great, thank you for asking! How about you?";
  } else if (lower.includes("schedule") || lower.includes("meeting")) {
    return "Sure thing! I can help schedule that meeting for you.";
  } else if (lower.includes("thank")) {
    return "You're very welcome! Let me know if you need anything else.";
  } else {
    return `Got it! You said: "${userSpeech}". How else can I assist?`;
  }
}

/**
 * Speech-to-Text Transcriber
 * Pass audio URI to OpenAI Whisper / Speech API here.
 */
async function transcribeAudio(audioUri: string): Promise<string> {
  console.log("Processing audio recording at:", audioUri);

  // TODO: Replace with real Whisper API / STT service call.
  // Example API call:
  // const formData = new FormData();
  // formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'audio.m4a' });
  // const res = await fetch('https://api.openai.com/v1/audio/transcriptions', { ... });

  return "Hello how are you"; // Return fallback transcribed string for testing
}

export default function Home() {
  const { user, signOut } = useAuth();
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastSpokenTimeRef = useRef<number>(Date.now());
  const isStoppingRef = useRef<boolean>(false);

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
      Speech.stop();
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Speak text using Option A: expo-speech
  const speakResponse = (text: string) => {
    setState("speaking");
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.95,
      onDone: () => setState("idle"),
      onError: () => setState("idle"),
    });
  };

  // Monitor audio levels for Silence Auto-Detection
  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording || isStoppingRef.current) return;

    const metering = status.metering ?? -160;

    // Reset silence timer if voice input is detected above threshold
    if (metering > SILENCE_THRESHOLD_DB) {
      lastSpokenTimeRef.current = Date.now();
    } else {
      // Check if silence has lasted longer than our threshold (1.5 seconds)
      const silenceDuration = Date.now() - lastSpokenTimeRef.current;
      if (silenceDuration > SILENCE_DURATION_MS) {
        isStoppingRef.current = true;
        stopRecordingAndProcess();
      }
    }
  };

  // 1. Start Voice Recording with Silence Detection (VAD)
  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (!permission.granted) {
          Alert.alert("Permission required", "Microphone access is required.");
          return;
        }
      }

      // Stop any active speech before starting a new recording
      Speech.stop();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      isStoppingRef.current = false;
      lastSpokenTimeRef.current = Date.now();

      // Start Recording with High Quality preset and metering enabled
      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        },
        onRecordingStatusUpdate,
        100, // Status update interval in ms
      );

      setRecording(newRecording);
      setTranscript("");
      setAssistantReply(null);
      setState("listening");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }

  // 2. Stop Voice Recording & Generate Voice Reply
  async function stopRecordingAndProcess() {
    if (!recording) return;

    setState("thinking");
    const currentRecording = recording;
    setRecording(null);

    try {
      await currentRecording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = currentRecording.getURI();

      // Convert recorded audio file to text
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

    const t1 = setTimeout(() => {
      const reply = getAssistantReply(userSpeech);
      setAssistantReply(reply);
      speakResponse(reply); // Triggers Voice Output
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
      Speech.stop();
      setState("idle");
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (option === "logout") {
      try {
        if (signOut) await signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        router.replace("/(auth)/login");
      }
    } else {
      router.push(`/settings/${option.replace("_", "-")}` as any);
    }
  };

  const username = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070B14" }}>
      <HeaderSettings onSelectOption={handleOptionSelect} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 40,
        }}
      >
        <Header greeting="Good Evening" name={username} />

        <StatusBadge status={state === "idle" ? "ready" : state} />

        {/* Hero Section */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 36,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <VoiceOrb state={state} onPress={handleVoicePress} size={220} />
            <View style={{ marginTop: -22 }}>
              <Waveform state={state} volume={recording ? 0.9 : 0.2} />
            </View>
          </View>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: "700",
              textAlign: "center",
              marginTop: 22,
            }}
          >
            {state === "listening"
              ? "Listening..."
              : state === "speaking"
                ? "VoiAst Speaking"
                : "How can I help today?"}
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 17,
              lineHeight: 26,
              textAlign: "center",
              marginTop: 10,
              paddingHorizontal: 20,
            }}
          >
            {state === "listening"
              ? "Speak now... Auto-detecting when you finish."
              : state === "speaking"
                ? "Tap the orb to interrupt speech."
                : "Tap the orb and speak naturally."}
          </Text>

          {/* Quick Actions */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginTop: 32,
            }}
          >
            <QuickAction
              title="📅 Calendar"
              onPress={() => processSpeechInteraction("Schedule a meeting")}
            />
            <QuickAction
              title="📧 Gmail"
              onPress={() => processSpeechInteraction("Check my emails")}
            />
            <QuickAction
              title="📝 Notes"
              onPress={() => processSpeechInteraction("Create a quick note")}
            />
            <QuickAction
              title="🤖 Automate"
              onPress={() => processSpeechInteraction("Run my evening routine")}
            />
          </View>
        </View>

        {/* Minimalist Reply Pill */}
        {(transcript !== "" || assistantReply !== null) && (
          <View
            style={{
              marginTop: 28,
              backgroundColor: "#0F172A",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#1E293B",
            }}
          >
            {transcript !== "" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: assistantReply ? 14 : 0,
                }}
              >
                <MaterialCommunityIcons
                  name="account-voice"
                  size={20}
                  color="#94A3B8"
                />
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 15,
                    marginLeft: 10,
                    fontWeight: "500",
                  }}
                >
                  "{transcript}"
                </Text>
              </View>
            )}

            {assistantReply && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  padding: 14,
                  borderRadius: 12,
                  borderColor: "rgba(59, 130, 246, 0.25)",
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={22}
                  color="#3B82F6"
                  style={{ marginTop: 2 }}
                />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    marginLeft: 10,
                    fontWeight: "600",
                    flex: 1,
                    lineHeight: 22,
                  }}
                >
                  {assistantReply}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
