import { Pressable, Text } from "react-native";

type QuickActionProps = {
  title: string;
  onPress?: () => void;
};

export default function QuickAction({ title, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#111827",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 18,
        margin: 6,
        borderWidth: 1,
        borderColor: "#263143",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
