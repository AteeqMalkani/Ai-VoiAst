import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVoiceStore } from "@/store/voiceStore";

import Header from "../components/layout/Header";
import QuickAction from "../components/ui/QuickAction";
import StatusBadge from "../components/ui/StatusBadge";
import TranscriptCard from "../components/voice/TranscriptCard";
import VoiceOrb from "../components/voice/VoiceOrb";

export default function Home() {
  const { state, transcript, setState, setTranscript } = useVoiceStore();

  const handleVoicePress = () => {
    setState("listening");

    setTimeout(() => {
      setTranscript("Schedule a meeting with Ali tomorrow at 3 PM");
      setState("thinking");

      setTimeout(() => {
        setState("executing");

        setTimeout(() => {
          setState("success");

          setTimeout(() => {
            setState("idle");
          }, 1500);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 12,
        }}
      >
        <Header greeting="Good Evening" name="Ateeq" />

        <StatusBadge status={state === "idle" ? "ready" : state} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VoiceOrb state={state} onPress={handleVoicePress} />

          <View
            style={{
              alignItems: "center",
              marginTop: 36,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 28,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              How can I help today?
            </Text>

            <Text
              style={{
                color: "#94A3B8",
                fontSize: 18,
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
                marginTop: 30,
                gap: 12,
              }}
            >
              <QuickAction title="📅 Calendar" />
              <QuickAction title="📧 Gmail" />
              <QuickAction title="📝 Notes" />
              <QuickAction title="🤖 Automate" />
            </View>
            <TranscriptCard transcript={transcript} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
