import { VoiceState } from "@/types/voice";
import { create } from "zustand";

export type CompletedTask = {
  title: string;
  status: "completed";
  completedAt: string;
};

type VoiceStore = {
  state: VoiceState;
  transcript: string;
  executionSteps: string[];
  lastTask: CompletedTask | null;

  setState: (state: VoiceState) => void;
  setTranscript: (text: string) => void;
  setExecutionSteps: (steps: string[]) => void;
  setLastTask: (task: CompletedTask | null) => void;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  state: "idle",
  transcript: "",
  executionSteps: [],
  lastTask: null,

  setState: (state) =>
    set({
      state,
    }),

  setTranscript: (text) =>
    set({
      transcript: text,
    }),

  setExecutionSteps: (steps) =>
    set({
      executionSteps: steps,
    }),

  setLastTask: (task) =>
    set({
      lastTask: task,
    }),
}));
