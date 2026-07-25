import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { CompletedTask } from "@/store/voiceStore";

type Props = {
  task: CompletedTask;
};

export default function LastTaskCard({ task }: Props) {
  return (
    <View
      style={{
        marginTop: 24,
        padding: 18,
        borderRadius: 20,
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#1F2937",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <MaterialCommunityIcons
          name="check-decagram"
          size={22}
          color="#22C55E"
        />

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "700",
            marginLeft: 10,
          }}
        >
          Last Automation
        </Text>
      </View>

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {task.title}
      </Text>

      <Text
        style={{
          color: "#22C55E",
          marginTop: 6,
          fontSize: 15,
        }}
      >
        ✓ Completed Successfully
      </Text>

      <Text
        style={{
          color: "#94A3B8",
          marginTop: 10,
          fontSize: 13,
        }}
      >
        Completed at {task.completedAt}
      </Text>
    </View>
  );
}
