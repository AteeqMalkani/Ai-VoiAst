import { create } from "zustand";
import { Task, TaskStatus } from "@/types/task";

interface TaskStore {
  tasks: Task[];

  addTask: (task: Task) => void;

  updateTask: (id: string, status: TaskStatus) => void;

  removeTask: (id: string) => void;

  clearTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              completedAt:
                status === "completed"
                  ? new Date().toISOString()
                  : task.completedAt,
            }
          : task,
      ),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  clearTasks: () =>
    set({
      tasks: [],
    }),
}));
