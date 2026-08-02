import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

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
    recording,
    handleVoicePress,
    processSpeechInteraction,
  } = useVoiceAssistant();

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
