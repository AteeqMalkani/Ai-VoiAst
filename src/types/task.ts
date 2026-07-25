export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface Task {
  id: string;

  title: string;

  description?: string;

  status: TaskStatus;

  createdAt: string;

  completedAt?: string;
}
