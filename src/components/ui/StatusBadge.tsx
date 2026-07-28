import { Text, View } from "react-native";

type Status =
  | "ready"
  | "listening"
  | "thinking"
  | "executing"
  | "speaking"
  | "success";

type StatusBadgeProps = {
  status: Status;
};

const config = {
  ready: {
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
    color: "#22C55E",
    text: "Executing...",
  },
  success: {
    color: "#16A34A",
    text: "Completed",
  },
  error: {
    color: "#EF4444",
    text: "Something went wrong",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const current = config[status];

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
