import { useEffect, useState } from "react";
import { View } from "react-native";

import VoiceOrb from "@/components/voice/VoiceOrb";

export default function AutomationScene() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(1), 1200),
      setTimeout(() => setScene(2), 2400),
      setTimeout(() => setScene(3), 3400),
      setTimeout(() => setScene(4), 4300),
      setTimeout(() => setScene(5), 5200),
      setTimeout(() => setScene(6), 6200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <VoiceOrb size={240} state={scene < 6 ? "thinking" : "success"} />
    </View>
  );
}
