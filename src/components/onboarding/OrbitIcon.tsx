import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type OrbitIconProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  backgroundColor?: string;
};

export default function OrbitIcon({
  icon,
  size = 26,
  backgroundColor = "#111827",
}: OrbitIconProps) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#1F2937",

        shadowColor: "#2563EB",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <MaterialCommunityIcons name={icon} size={size} color="#FFFFFF" />
    </View>
  );
}
