import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { VoiceState } from "@/types/voice";
import PulseRing from "./PulseRing";
import RotatingRing from "./RotatingRing";

type Props = {
  state?: VoiceState;
  onPress?: () => void;
};

export default function VoiceOrb({ state = "idle", onPress }: Props) {
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

  const color = current.color;

  return (
    <View
      style={{
        width: 260,
        height: 260,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {current.pulse && <PulseRing size={240} color={current.color} />}

      <RotatingRing size={255} color={current.color} duration={18000} />

      <RotatingRing size={225} color={color} duration={12000} reverse />

      <RotatingRing size={195} color={color} duration={8000} />

      <View
        style={{
          width: 210,
          height: 210,
          borderRadius: 105,
          borderWidth: 2,
          borderColor: current.color,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: current.color + "20",
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            backgroundColor: current.color,
            justifyContent: "center",
            alignItems: "center",

            shadowColor: current.color,
            shadowOpacity: 0.9,
            shadowRadius: 25,
            elevation: 12,
          }}
        >
          <MaterialCommunityIcons name="microphone" size={56} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
