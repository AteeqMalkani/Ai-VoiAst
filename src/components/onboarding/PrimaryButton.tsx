import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#2563EB",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
