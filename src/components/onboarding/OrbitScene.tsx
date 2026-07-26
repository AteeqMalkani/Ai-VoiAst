import { View } from "react-native";

import FloatingApp from "./FloatingApp";
import VoiceOrb from "../voice/VoiceOrb";

export default function OrbitScene() {
  return (
    <View
      style={{
        width: 360,
        height: 360,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Center Orb */}
      <View
        style={{
          position: "absolute",
        }}
      >
        <VoiceOrb state="idle" />
      </View>

      <FloatingApp app="gmail" radius={155} duration={18000} startAngle={0} />

      <FloatingApp
        app="calendar"
        radius={135}
        duration={22000}
        startAngle={80}
      />

      <FloatingApp
        app="chrome"
        radius={180}
        duration={16000}
        startAngle={160}
      />

      <FloatingApp app="drive" radius={145} duration={25000} startAngle={230} />

      <FloatingApp
        app="spotify"
        radius={190}
        duration={30000}
        startAngle={310}
      />

      <FloatingApp app="notes" radius={120} duration={20000} startAngle={120} />

      <FloatingApp app="slack" radius={170} duration={27000} startAngle={40} />
    </View>
  );
}
