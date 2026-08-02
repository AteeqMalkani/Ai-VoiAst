import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  steps: string[];
  isCompleted?: boolean; // Optional prop to mark overall completion state
};

export default function ExecutionPlan({
  visible,
  steps,
  isCompleted = false,
}: Props) {
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

      {steps.map((step, index) => {
        const isLastItem = index === steps.length - 1;
        const isExecutingStep = isLastItem && !isCompleted;

        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {/* Show activity indicator for active step, checkmark for finished steps */}
            {isExecutingStep ? (
              <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#22C55E"
              />
            )}

            <Text
              style={{
                color: isExecutingStep ? "#FFFFFF" : "#CBD5E1",
                fontWeight: isExecutingStep ? "600" : "400",
                marginLeft: 10,
                flex: 1,
              }}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
