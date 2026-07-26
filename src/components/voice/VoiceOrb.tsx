import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { VoiceState } from "@/types/voice";

import PulseRing from "./PulseRing";
import RotatingRing from "./RotatingRing";

type VoiceOrbProps = {
  state?: VoiceState;
  onPress?: () => void;
  size?: number;
};

export default function VoiceOrb({
  state = "idle",
  onPress,
  size = 240,
}: VoiceOrbProps) {
  const config = {
    idle: {
      color: "#3B82F6",
      pulse: true,
    },
    listening: {
      color: "#60A5FA",
      pulse: true,
    },
    thinking: {
      color: "#A855F7",
      pulse: false,
    },
    executing: {
      color: "#22C55E",
      pulse: true,
    },
    success: {
      color: "#10B981",
      pulse: false,
    },
  };

  const current = config[state];

  const outerRing = size * 1.08;
  const middleRing = size * 0.95;
  const innerRing = size * 0.82;

  const shellSize = size * 0.88;
  const buttonSize = size * 0.54;
  const iconSize = size * 0.23;

  return (
    <View
      style={{
        width: outerRing + 30,
        height: outerRing + 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {current.pulse && <PulseRing size={size} color={current.color} />}

      <RotatingRing size={outerRing} color={current.color} duration={18000} />

      <RotatingRing
        size={middleRing}
        color={current.color}
        duration={12000}
        reverse
      />

      <RotatingRing size={innerRing} color={current.color} duration={8000} />

      <View
        style={{
          width: shellSize,
          height: shellSize,
          borderRadius: shellSize / 2,
          borderWidth: 2,
          borderColor: current.color,
          backgroundColor: current.color + "20",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor: current.color,
            justifyContent: "center",
            alignItems: "center",

            shadowColor: current.color,
            shadowOpacity: 0.9,
            shadowRadius: 25,
            elevation: 12,
          }}
        >
          <MaterialCommunityIcons
            name="microphone"
            size={iconSize}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
}
