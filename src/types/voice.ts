export type VoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "executing"
  | "speaking"
  | "done";

export const VoiceColors: Record<
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
    primary: "#22C55E",
    secondary: "#4ADE80",
  },

  thinking: {
    primary: "#A855F7",
    secondary: "#EC4899",
  },

  executing: {
    primary: "#F59E0B",
    secondary: "#FCD34D",
  },

  speaking: {
    primary: "#38BDF8",
    secondary: "#67E8F9",
  },

  done: {
    primary: "#10B981",
    secondary: "#6EE7B7",
  },
};
