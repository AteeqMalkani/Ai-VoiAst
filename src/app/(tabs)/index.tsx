import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useVoiceStore } from "@/store/voiceStore";

import { HeaderSettings } from "@/components/home/HeaderSettings";
import Header from "@/components/layout/Header";
import QuickAction from "@/components/ui/QuickAction";
import StatusBadge from "@/components/ui/StatusBadge";
import VoiceOrb from "@/components/voice/VoiceOrb";
import Waveform from "@/components/voice/Waveform";

export default function Home() {
  const { user, signOut } = useAuth();

  const {
    state,
    transcript,
    assistantReply,
    handleVoicePress,
    processSpeechInteraction,
  } = useVoiceAssistant();

  const executionSteps = useVoiceStore((s) => s.executionSteps);

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
  const isBusy = state !== "idle" && state !== "done";

  const getHeroTitle = () => {
    switch (state) {
      case "listening":
        return "Listening...";
      case "thinking":
        return "Thinking...";
      case "executing":
        return "Executing Task...";
      case "done":
        return "Task Completed!";
      case "speaking":
        return "VoiAst Speaking";
      case "idle":
      default:
        return "How can I help today?";
    }
  };

  const getHeroSubtitle = () => {
    switch (state) {
      case "listening":
        return "Speak now... Auto-detecting when you finish.";
      case "thinking":
        return "Analyzing your voice request...";
      case "executing":
        return "Running automation steps in background...";
      case "done":
        return "All execution steps finished successfully.";
      case "speaking":
        return "Tap the orb to interrupt speech.";
      case "idle":
      default:
        return "Tap the orb and speak naturally.";
    }
  };

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
        <Header greeting="Welcome" name={username} />

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
              <Waveform
                state={state}
                volume={
                  state === "listening" || state === "speaking" ? 0.95 : 0.15
                }
              />
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
            {getHeroTitle()}
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
            {getHeroSubtitle()}
          </Text>

          {/* Quick Actions */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginTop: 32,
              opacity: isBusy ? 0.6 : 1.0,
            }}
            pointerEvents={isBusy ? "none" : "auto"}
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
              onPress={() => processSpeechInteraction("Tell me a joke")}
            />
          </View>
        </View>

        {/* Task Execution Steps Progress Display */}
        {executionSteps.length > 0 && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: "#0B132B",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#1C2D5A",
            }}
          >
            <Text
              style={{
                color: "#3B82F6",
                fontSize: 14,
                fontWeight: "700",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Execution Progress
            </Text>

            {executionSteps.map((step, idx) => (
              <View
                key={`${step}-${idx}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: idx === 0 ? 0 : 8,
                }}
              >
                <MaterialCommunityIcons
                  name={
                    state === "executing" && idx === executionSteps.length - 1
                      ? "progress-clock"
                      : "check-circle-outline"
                  }
                  size={18}
                  color={
                    state === "executing" && idx === executionSteps.length - 1
                      ? "#3B82F6"
                      : "#10B981"
                  }
                />
                <Text
                  style={{
                    color: "#CBD5E1",
                    fontSize: 14,
                    marginLeft: 8,
                    flex: 1,
                  }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Reply & Transcript Card */}
        {(Boolean(transcript) || Boolean(assistantReply)) && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: "#0F172A",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#1E293B",
            }}
          >
            {Boolean(transcript) && (
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
                    flex: 1,
                  }}
                >
                  "{transcript}"
                </Text>
              </View>
            )}

            {Boolean(assistantReply) && (
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
