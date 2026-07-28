import { Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { VoiceState } from "@/types/voice";

type Props = {
  state: VoiceState;
};

const config = {
  idle: {
    icon: "circle",
    color: "#3B82F6",
    text: "Ready",
  },

  listening: {
    icon: "microphone",
    color: "#22C55E",
    text: "Listening...",
  },

  thinking: {
    icon: "brain",
    color: "#A855F7",
    text: "Thinking...",
  },

  speaking: {
    icon: "volume-high",
    color: "#38BDF8",
    text: "Speaking...",
  },

  success: {
    icon: "check-circle",
    color: "#10B981",
    text: "Done",
  },
};

export default function VoiceStatus({ state }: Props) {
  const current = config[state];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <MaterialCommunityIcons
        name={current.icon as any}
        size={14}
        color={current.color}
      />

      <Text
        style={{
          color: "white",
          marginLeft: 8,
          fontWeight: "600",
          fontSize: 15,
        }}
      >
        {current.text}
      </Text>
    </View>
  );
}
