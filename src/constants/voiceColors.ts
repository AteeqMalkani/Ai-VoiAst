import { VoiceState } from "@/types/voice";

export const voiceColors: Record<
  VoiceState,
  {
    primary: string;
    secondary: string;
  }
> = {
  idle: {
    primary: "#3B82F6",
    secondary: "#38BDF8",
  },

  listening: {
    primary: "#60A5FA",
    secondary: "#22D3EE",
  },

  thinking: {
    primary: "#A855F7",
    secondary: "#EC4899",
  },

  executing: {
    primary: "#22C55E",
    secondary: "#84CC16",
  },

  success: {
    primary: "#10B981",
    secondary: "#6EE7B7",
  },
};
