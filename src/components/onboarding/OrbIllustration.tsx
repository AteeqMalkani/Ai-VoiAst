import { View } from "react-native";

import VoiceOrb from "../voice/VoiceOrb";

export default function OrbIllustration() {
  return (
    <View
      style={{
        width: 360,
        height: 360,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <VoiceOrb state="idle" />
    </View>
  );
}
