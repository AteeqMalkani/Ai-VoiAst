import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

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

  success: {
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
  const config = CONFIG[state];
  const colors = VoiceColors[state];

  const outerRingSize = size * 1.08;
  const middleRingSize = size * 0.95;
  const innerRingSize = size * 0.82;

  const shellSize = size * 0.88;
  const buttonSize = size * 0.54;
  const iconSize = size * 0.23;

  return (
    <View
      style={{
        width: outerRingSize + 30,
        height: outerRingSize + 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {config.pulse && <PulseRing size={size} color={colors.primary} />}

      <RotatingRing
        size={outerRingSize}
        color={colors.primary}
        duration={config.outerSpeed}
      />

      <RotatingRing
        size={middleRingSize}
        color={colors.secondary}
        duration={config.middleSpeed}
        reverse
      />

      <RotatingRing
        size={innerRingSize}
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
          disabled={state !== "idle"}
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
            shadowOpacity: 0.7,
            shadowRadius:
              state === "listening" ? 34 : state === "thinking" ? 28 : 24,

            elevation: 18,
          }}
        >
          <MaterialCommunityIcons
            name="microphone"
            size={iconSize}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}
