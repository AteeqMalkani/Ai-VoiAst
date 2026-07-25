import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type RotatingRingProps = {
  size: number;
  color: string;
  duration?: number;
  reverse?: boolean;
};

export default function RotatingRing({
  size,
  color,
  duration = 10000,
  reverse = false,
}: RotatingRingProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ["360deg", "0deg"] : ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        borderStyle: "dashed",
        opacity: 0.4,
        transform: [{ rotate: spin }],
      }}
    />
  );
}
