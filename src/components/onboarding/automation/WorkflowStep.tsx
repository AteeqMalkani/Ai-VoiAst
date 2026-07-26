import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type Props = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  active: boolean;
  completed: boolean;
  last?: boolean;
};

export default function WorkflowStep({
  icon,
  title,
  active,
  completed,
  last = false,
}: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(withSpring(1.15), withSpring(1));
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = completed ? "#22C55E" : active ? "#5B8CFF" : "#64748B";

  return (
    <Animated.View
      entering={FadeInUp.duration(450)}
      style={{
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 300,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: color + "20",
              justifyContent: "center",
              alignItems: "center",
            },
            animatedStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={completed ? "check" : icon}
            size={22}
            color={color}
          />
        </Animated.View>

        <Text
          style={{
            marginLeft: 16,
            color,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      </View>

      {!last && (
        <View
          style={{
            width: 2,
            height: 28,
            marginVertical: 8,
            backgroundColor: completed ? "#22C55E" : "#233044",
          }}
        />
      )}
    </Animated.View>
  );
}
