import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useVoiceStore } from "@/store/voiceStore";

import { HeaderSettings } from "@/components/home/HeaderSettings";
import Header from "@/components/layout/Header";
import QuickAction from "@/components/ui/QuickAction";
import StatusBadge from "@/components/ui/StatusBadge";

import ExecutionPlan from "@/components/voice/ExecutionPlan";
import LastTaskCard from "@/components/voice/LastTaskCard";
import ThinkingCard from "@/components/voice/ThinkingCard";
import TranscriptCard from "@/components/voice/TranscriptCard";
import VoiceOrb from "@/components/voice/VoiceOrb";
import Waveform from "@/components/voice/Waveform";

export default function Home() {
  const { user, signOut } = useAuth();

  const {
    state,
    transcript,
    executionSteps,
    lastTask,
    setState,
    resetVoiceState,
  } = useVoiceStore();

  const handleVoicePress = async () => {
    if (state === "idle") {
      // Clear previous execution state and start listening
      resetVoiceState();
      setState("listening");

      // TODO: Call your Speech Recognition start engine here
      // e.g. Voice.start('en-US');
      return;
    }

    if (state === "listening") {
      // Signal speech engine that the user finished speaking
      setState("thinking");

      // TODO: Send captured audio / transcript to your AI Agent / Backend pipeline
      // e.g. await processVoiceCommand(liveTranscript);
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
          paddingBottom: 50,
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
              <Waveform state={state} volume={0.6} />
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
            How can I help today?
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
              ? "Listening... Tap the orb again when finished."
              : "Tap the orb and speak naturally.\nVoiAst will handle the rest."}
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
            <QuickAction title="📅 Calendar" />
            <QuickAction title="📧 Gmail" />
            <QuickAction title="📝 Notes" />
            <QuickAction title="🤖 Automate" />
          </View>
        </View>

        {/* Dynamic Voice Cards */}
        {Boolean(transcript) && <TranscriptCard transcript={transcript} />}

        <ThinkingCard visible={state === "thinking"} />

        <ExecutionPlan
          visible={
            (state === "executing" || state === "success") &&
            executionSteps.length > 0
          }
          steps={executionSteps}
        />

        {/* Dynamic Task Card generated upon completion */}
        {state === "idle" && lastTask && <LastTaskCard task={lastTask} />}
      </ScrollView>
    </SafeAreaView>
  );
}
