export type TaskStatus = "pending" | "running" | "completed" | "failed";

export type TaskCategory =
  | "calendar"
  | "gmail"
  | "notes"
  | "browser"
  | "automation"
  | "system"
  | "other";

export interface Task {
  id: string;

  title: string;

  description?: string;

  category: TaskCategory;

  status: TaskStatus;

  createdAt: string;

  completedAt?: string;
}
