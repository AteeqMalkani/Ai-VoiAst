import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type App =
  | "gmail"
  | "calendar"
  | "chrome"
  | "drive"
  | "spotify"
  | "slack"
  | "notes";

type Props = {
  app: App;
  radius: number;
  duration: number;
  startAngle: number;
  size?: number;
};

const iconMap: Record<
  App,
  {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
  }
> = {
  gmail: {
    icon: "gmail",
    color: "#EA4335",
  },
  calendar: {
    icon: "calendar-month",
    color: "#4285F4",
  },
  chrome: {
    icon: "google-chrome",
    color: "#34A853",
  },
  drive: {
    icon: "google-drive",
    color: "#0F9D58",
  },
  spotify: {
    icon: "spotify",
    color: "#1DB954",
  },
  slack: {
    icon: "slack",
    color: "#E01E5A",
  },
  notes: {
    icon: "note-text-outline",
    color: "#F59E0B",
  },
};

export default function FloatingApp({
  app,
  radius,
  duration,
  startAngle,
  size = 58,
}: Props) {
  const rotation = useSharedValue(startAngle);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(startAngle + 360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const radians = (rotation.value * Math.PI) / 180;

    return {
      position: "absolute",
      transform: [
        { translateX: radius * Math.cos(radians) },
        { translateY: radius * Math.sin(radians) },
      ],
    };
  });

  const current = iconMap[app];

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons
        name={current.icon}
        size={size}
        color={current.color}
      />
    </Animated.View>
  );
}
