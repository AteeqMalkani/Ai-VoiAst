import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVoiceStore } from "@/store/voiceStore";

import Header from "../../components/layout/Header";
import QuickAction from "../../components/ui/QuickAction";
import StatusBadge from "../../components/ui/StatusBadge";

import VoiceOrb from "../../components/voice/VoiceOrb";
import TranscriptCard from "../../components/voice/TranscriptCard";
import ThinkingCard from "../../components/voice/ThinkingCard";
import ExecutionPlan from "../../components/voice/ExecutionPlan";
import LastTaskCard from "../../components/voice/LastTaskCard";

export default function Home() {
  const {
    state,
    transcript,
    executionSteps,
    lastTask,
    setState,
    setTranscript,
    setExecutionSteps,
    setLastTask,
  } = useVoiceStore();

  const handleVoicePress = () => {
    // Clear previous temporary UI
    setTranscript("");
    setExecutionSteps([]);

    setState("listening");

    setTimeout(() => {
      setTranscript("Schedule a meeting with Ali tomorrow at 3 PM");
      setState("thinking");

      setTimeout(() => {
        setExecutionSteps([
          "Open Google Calendar",
          "Create a new event",
          "Invite Ali",
          "Add a reminder",
        ]);

        setState("executing");

        setTimeout(() => {
          setState("success");

          setLastTask({
            title: "Schedule meeting with Ali",
            status: "completed",
            completedAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          setTimeout(() => {
            // Remove temporary cards
            setTranscript("");
            setExecutionSteps([]);

            // Ready for next command
            setState("idle");
          }, 1500);
        }, 2000);
      }, 1500);
    }, 2500);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 40,
        }}
      >
        <Header greeting="Good Evening" name="Ateeq" />

        <StatusBadge status={state === "idle" ? "ready" : state} />

        <View
          style={{
            alignItems: "center",
            marginTop: 35,
          }}
        >
          <VoiceOrb state={state} onPress={handleVoicePress} />

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: "700",
              textAlign: "center",
              marginTop: 36,
            }}
          >
            How can I help today?
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 17,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            Tap the orb to start talking
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginTop: 30,
            }}
          >
            <QuickAction title="📅 Calendar" />
            <QuickAction title="📧 Gmail" />
            <QuickAction title="📝 Notes" />
            <QuickAction title="🤖 Automate" />
          </View>
        </View>

        {transcript !== "" && <TranscriptCard transcript={transcript} />}

        <ThinkingCard visible={state === "thinking"} />

        <ExecutionPlan
          visible={state === "executing" || state === "success"}
          steps={executionSteps}
        />

        {state === "idle" && lastTask && <LastTaskCard task={lastTask} />}
      </ScrollView>
    </SafeAreaView>
  );
}
