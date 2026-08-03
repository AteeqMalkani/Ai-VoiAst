import { create } from "zustand";
import { VoiceState } from "@/types/voice";

export interface TaskItem {
  id: string;
  title: string;
  status: "completed" | "failed" | "in_progress";
  completedAt: string;
}

interface VoiceStoreState {
  state: VoiceState;
  transcript: string;
  executionSteps: string[];
  lastTask: TaskItem | null;

  setState: (state: VoiceState) => void;
  setTranscript: (transcript: string) => void;
  addExecutionStep: (step: string) => void;
  setExecutionSteps: (steps: string[]) => void;
  setLastTask: (task: TaskItem | null) => void;
  resetVoiceState: () => void;
}

export const useVoiceStore = create<VoiceStoreState>((set) => ({
  state: "idle",
  transcript: "",
  executionSteps: [],
  lastTask: null,

  setState: (state) => set({ state }),
  setTranscript: (transcript) => set({ transcript }),
  addExecutionStep: (step) =>
    set((prev) => ({ executionSteps: [...prev.executionSteps, step] })),
  setExecutionSteps: (executionSteps) => set({ executionSteps }),
  setLastTask: (lastTask) => set({ lastTask }),
  resetVoiceState: () =>
    set({
      state: "idle",
      transcript: "",
      executionSteps: [],
      lastTask: null,
    }),
}));
