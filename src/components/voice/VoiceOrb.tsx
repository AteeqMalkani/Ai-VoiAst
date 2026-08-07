import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { VoiceColors, VoiceState } from "@/types/voice";

import PulseRing from "./PulseRing";
import RotatingRing from "./RotatingRing";

type VoiceOrbProps = {
  state?: VoiceState;
  size?: number;
  onPress?: () => void;
};

const CONFIG: Record<
  VoiceState,
  {
    pulse: boolean;
    outerSpeed: number;
    middleSpeed: number;
    innerSpeed: number;
  }
> = {
  idle: {
    pulse: true,
    outerSpeed: 18000,
    middleSpeed: 12000,
    innerSpeed: 8000,
  },

  listening: {
    pulse: true,
    outerSpeed: 10000,
    middleSpeed: 7000,
    innerSpeed: 5000,
  },

  thinking: {
    pulse: false,
    outerSpeed: 9000,
    middleSpeed: 7000,
    innerSpeed: 5000,
  },

  executing: {
    pulse: true,
    outerSpeed: 7000,
    middleSpeed: 5500,
    innerSpeed: 3500,
  },

  speaking: {
    pulse: true,
    outerSpeed: 6000,
    middleSpeed: 4500,
    innerSpeed: 3000,
  },

  done: {
    pulse: false,
    outerSpeed: 16000,
    middleSpeed: 11000,
    innerSpeed: 7000,
  },
};

export default function VoiceOrb({
  state = "idle",
  size = 240,
  onPress,
}: VoiceOrbProps) {
  // Safe fallbacks to avoid runtime crashes
  const config = CONFIG[state] ?? CONFIG.idle;
  const colors = VoiceColors[state] ?? VoiceColors.idle;

  const outerRing = size * 1.08;
  const middleRing = size * 0.95;
  const innerRing = size * 0.82;

  const shellSize = size * 0.88;
  const buttonSize = size * 0.54;
  const iconSize = size * 0.23;

  const scale = useSharedValue(1);

  useEffect(() => {
    switch (state) {
      case "idle":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.04, {
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        );
        break;

      case "listening":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 500 }),
            withTiming(1, { duration: 500 }),
          ),
          -1,
          false,
        );
        break;

      case "thinking":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.06, { duration: 900 }),
            withTiming(1, { duration: 900 }),
          ),
          -1,
          false,
        );
        break;

      case "executing":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.12, { duration: 350 }),
            withTiming(1, { duration: 350 }),
          ),
          -1,
          false,
        );
        break;

      case "speaking":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 400 }),
            withTiming(1, { duration: 400 }),
          ),
          -1,
          false,
        );
        break;

      case "done":
        scale.value = withSequence(
          withTiming(1.18, { duration: 350 }),
          withTiming(1, { duration: 700 }),
        );
        break;
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  // Only disable press when strictly processing background tasks/thinking.
  // Speech interrupting is allowed!
  const isBusy = state === "thinking" || state === "executing";

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          width: outerRing + 30,
          height: outerRing + 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {config.pulse && <PulseRing size={size} color={colors.primary} />}

        <RotatingRing
          size={outerRing}
          color={colors.primary}
          duration={config.outerSpeed}
        />

        <RotatingRing
          size={middleRing}
          color={colors.secondary}
          duration={config.middleSpeed}
          reverse
        />

        <RotatingRing
          size={innerRing}
          color={colors.primary}
          duration={config.innerSpeed}
        />

        <View
          style={{
            width: shellSize,
            height: shellSize,
            borderRadius: shellSize / 2,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: `${colors.primary}20`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={onPress}
            disabled={isBusy}
            hitSlop={12}
            style={{
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.primary,

              shadowColor: colors.primary,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.8,
              shadowRadius:
                state === "listening"
                  ? 36
                  : state === "thinking"
                    ? 30
                    : state === "executing"
                      ? 40
                      : 24,
              elevation: 18,
            }}
          >
            <MaterialCommunityIcons
              name={
                state === "listening"
                  ? "stop"
                  : state === "speaking"
                    ? "volume-off"
                    : "microphone"
              }
              size={iconSize}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
