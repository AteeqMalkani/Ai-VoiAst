import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
};

export default function ThinkingCard({ visible }: Props) {
  if (!visible) return null;

  return (
    <View
      style={{
        width: "100%",
        marginTop: 20,
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
        }}
      >
        <MaterialCommunityIcons name="brain" size={22} color="#A855F7" />

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            marginLeft: 10,
            flex: 1,
          }}
        >
          AI is analysing your request...
        </Text>

        <ActivityIndicator color="#A855F7" />
      </View>
    </View>
  );
}
