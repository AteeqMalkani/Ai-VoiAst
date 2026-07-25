import { create } from "zustand";
import { VoiceState } from "@/types/voice";

type VoiceStore = {
  state: VoiceState;
  transcript: string;

  setState: (state: VoiceState) => void;
  setTranscript: (text: string) => void;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  state: "idle",
  transcript: "",

  setState: (state) => set({ state }),

  setTranscript: (text) => set({ transcript: text }),
}));
