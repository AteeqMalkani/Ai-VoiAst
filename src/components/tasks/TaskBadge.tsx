import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type TaskBadgeProps = {
  count: number;
  onPress?: () => void;
};

export default function TaskBadge({ count, onPress }: TaskBadgeProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#1F2937",
      }}
    >
      <MaterialCommunityIcons
        name="clipboard-text-outline"
        size={20}
        color="#FFFFFF"
      />

      {count > 0 && (
        <View
          style={{
            minWidth: 22,
            height: 22,
            marginLeft: 8,
            borderRadius: 11,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
