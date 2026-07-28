import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    if (state !== "idle") return;

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
            setTranscript("");
            setExecutionSteps([]);
            setState("idle");
          }, 1800);
        }, 2200);
      }, 1600);
    }, 2200);
  };

  const handleOptionSelect = (option: string) => {
    console.log(option);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
    >
      <HeaderSettings onSelectOption={handleOptionSelect} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 50,
        }}
      >
        <Header greeting="Good Evening" name="Ateeq" />

        <StatusBadge status={state === "idle" ? "ready" : state} />

        {/* Hero Section */}

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 36,
          }}
        >
          {/* Orb + Wave */}

          <View
            style={{
              alignItems: "center",
            }}
          >
            <VoiceOrb state={state} onPress={handleVoicePress} size={220} />

            <View
              style={{
                marginTop: -22,
              }}
            >
              <Waveform state={state} volume={0.6} />
            </View>
          </View>

          {/* Heading */}

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
            Tap the orb and speak naturally.
            {"\n"}
            VoiAst will handle the rest.
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

        {/* Voice Cards */}

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
