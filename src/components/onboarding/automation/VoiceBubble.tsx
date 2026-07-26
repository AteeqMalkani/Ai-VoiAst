import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

type Props = {
  message: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color?: string;
};

export default function SpeechBubble({
  message,
  icon = "microphone",
  color = "#5B8CFF",
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      exiting={FadeOutUp.duration(300)}
      layout={Layout.springify()}
      style={{
        width: 320,
        minHeight: 74,
        backgroundColor: "#111827",
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        flexDirection: "row",
        alignItems: "center",

        shadowColor: color,
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: color + "20",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>

      <Text
        style={{
          flex: 1,
          marginLeft: 16,
          color: "#FFFFFF",
          fontSize: 15,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
