import { useEffect } from "react";
import { View } from "react-native";

import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { VoiceColors, VoiceState } from "@/types/voice";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WIDTH = 300;
const HEIGHT = 70;

type WaveformProps = {
  state: VoiceState;
  volume?: number;
};

export default function Waveform({ state, volume = 0.5 }: WaveformProps) {
  const time = useSharedValue(0);

  useEffect(() => {
    time.value = withRepeat(
      withTiming(100000, {
        duration: 900000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const centerY = HEIGHT / 2;

    let path = `M 0 ${centerY}`;

    // Voice state affects wave intensity
    let amplitude = 10;

    switch (state) {
      case "idle":
        amplitude = 6;
        break;

      case "listening":
        amplitude = 16 + volume * 10;
        break;

      case "thinking":
        amplitude = 11;
        break;

      case "executing":
        amplitude = 14;
        break;

      case "speaking":
        amplitude = 18;
        break;

      case "done":
        amplitude = 8;
        break;
    }

    for (let x = 0; x <= WIDTH; x += 2) {
      const t = time.value;

      const wave1 = Math.sin(t * 0.02 + x * 0.03) * amplitude;
      const wave2 = Math.sin(t * 0.013 + x * 0.065) * (amplitude * 0.5);
      const wave3 = Math.sin(t * 0.008 + x * 0.014) * (amplitude * 0.7);

      const y = centerY + wave1 + wave2 + wave3;
      const distance = Math.abs(x - WIDTH / 2) / (WIDTH / 2);
      const strength = 1 - distance * 0.45;

      const finalY = centerY + (y - centerY) * strength;

      path += ` L ${x} ${finalY}`;
    }

    return {
      d: path,
    };
  });

  const current = VoiceColors[state] ?? VoiceColors.idle;

  return (
    <View
      style={{
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={WIDTH} height={HEIGHT}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={current.primary} stopOpacity="0" />
            <Stop offset="18%" stopColor={current.primary} stopOpacity="1" />
            <Stop offset="50%" stopColor={current.secondary} stopOpacity="1" />
            <Stop offset="82%" stopColor={current.primary} stopOpacity="1" />
            <Stop offset="100%" stopColor={current.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Glow */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="url(#gradient)"
          strokeWidth={16}
          strokeOpacity={0.08}
          fill="none"
          strokeLinecap="round"
        />

        {/* Soft Wave */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="url(#gradient)"
          strokeWidth={8}
          strokeOpacity={0.35}
          fill="none"
          strokeLinecap="round"
        />

        {/* Main Wave */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="url(#gradient)"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
