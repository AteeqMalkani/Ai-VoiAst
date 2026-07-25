import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  steps: string[];
};

export default function ExecutionPlan({ visible, steps }: Props) {
  if (!visible || steps.length === 0) return null;

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
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 14,
        }}
      >
        Execution Plan
      </Text>

      {steps.map((step, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={20}
            color="#22C55E"
          />

          <Text
            style={{
              color: "#CBD5E1",
              marginLeft: 10,
              flex: 1,
            }}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
}
