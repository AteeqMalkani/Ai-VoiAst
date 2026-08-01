export type TaskStatus =
  | "pending"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";
export type VoiceOption =
  | "nova"
  | "alloy"
  | "echo"
  | "fable"
  | "onyx"
  | "shimmer";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: any; // Firestore FieldValue / Timestamp
  lastLogin: any;
  onboardingCompleted: boolean;
  language: string;
  theme: "dark" | "light" | "system";
  voice: VoiceOption;
  timezone: string;
  premium: boolean;
}

export interface ConnectedApp {
  appId: "calendar" | "gmail" | "spotify" | "slack" | "drive";
  connected: boolean;
  email?: string;
  connectedAt?: any;
  lastSync?: any;
}

export interface TaskDocument {
  id?: string;
  userId: string;
  title: string;
  command: string;
  status: TaskStatus;
  createdAt: any;
  completedAt?: any;
  executionTime?: number;
  source: "voice" | "text" | "automation";
  executionSteps?: string[];
}

export interface ConversationMessage {
  id?: string;
  userId: string;
  role: "user" | "assistant" | "system";
  message: string;
  timestamp: any;
  metadata?: Record<string, any>;
}

export interface AutomationDocument {
  id?: string;
  userId: string;
  name: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
  createdAt: any;
  lastRun?: any;
}

export interface NotificationDocument {
  id?: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: any;
}

export interface UserSettings {
  userId: string;
  theme: "dark" | "light";
  voice: VoiceOption;
  language: string;
  notificationsEnabled: boolean;
  soundEffects: boolean;
}
