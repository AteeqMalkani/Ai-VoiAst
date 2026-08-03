import { Text, View } from "react-native";
import { VoiceState } from "@/types/voice";

export type Status = VoiceState | "ready" | "error";

type StatusBadgeProps = {
  status: Status;
};

const config: Record<Status, { color: string; text: string }> = {
  ready: {
    color: "#22C55E",
    text: "Ready",
  },
  idle: {
    color: "#22C55E",
    text: "Ready",
  },
  listening: {
    color: "#3B82F6",
    text: "Listening...",
  },
  thinking: {
    color: "#8B5CF6",
    text: "Thinking...",
  },
  speaking: {
    color: "#06B6D4",
    text: "Speaking...",
  },
  executing: {
    color: "#F59E0B",
    text: "Executing...",
  },
  done: {
    color: "#16A34A",
    text: "Completed",
  },
  error: {
    color: "#EF4444",
    text: "Something went wrong",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const current = config[status] ?? config.ready;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: current.color,
          marginRight: 8,
        }}
      />

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        {current.text}
      </Text>
    </View>
  );
}
