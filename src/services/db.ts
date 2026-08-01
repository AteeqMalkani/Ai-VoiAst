import { db } from "@/firebase/config";
import {
  AutomationDocument,
  ConnectedApp,
  NotificationDocument,
  TaskDocument,
  UserProfile,
  UserSettings,
} from "@/types/database";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// ==========================================
// USERS & SETTINGS
// ==========================================

export const syncUserProfileOnLogin = async (user: {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Initial creation on first register
    const newUser: UserProfile = {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      onboardingCompleted: false,
      language: "en",
      theme: "dark",
      voice: "nova",
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi",
      premium: false,
    };

    await setDoc(userRef, newUser);

    // Initialize Default User Settings
    const defaultSettings: UserSettings = {
      userId: user.uid,
      theme: "dark",
      voice: "nova",
      language: "English",
      notificationsEnabled: true,
      soundEffects: true,
    };
    await setDoc(doc(db, "settings", user.uid), defaultSettings);
  } else {
    // Just update lastLogin on subsequent logins
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  }
};

// ==========================================
// CONNECTED APPS (Subcollection)
// ==========================================

export const updateConnectedApp = async (
  userId: string,
  appId: ConnectedApp["appId"],
  data: Partial<ConnectedApp>,
) => {
  const appRef = doc(db, "users", userId, "connectedApps", appId);
  await setDoc(
    appRef,
    {
      appId,
      ...data,
      lastSync: serverTimestamp(),
    },
    { merge: true },
  );
};

// ==========================================
// TASKS
// ==========================================

export const createVoiceTask = async (
  userId: string,
  command: string,
  title: string,
  executionSteps: string[] = [],
): Promise<string> => {
  const tasksRef = collection(db, "tasks");
  const docRef = await addDoc(tasksRef, {
    userId,
    title,
    command,
    status: "executing",
    source: "voice",
    executionSteps,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskDocument["status"],
  executionTime?: number,
) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    status,
    ...(executionTime ? { executionTime } : {}),
    ...(status === "completed" ? { completedAt: serverTimestamp() } : {}),
  });
};

export const getUserTasks = async (userId: string, limitCount = 10) => {
  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as TaskDocument);
};

// ==========================================
// CONVERSATIONS
// ==========================================

export const saveMessage = async (
  userId: string,
  role: "user" | "assistant",
  message: string,
) => {
  const convRef = collection(db, "conversations");
  await addDoc(convRef, {
    userId,
    role,
    message,
    timestamp: serverTimestamp(),
  });
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const createNotification = async (
  userId: string,
  title: string,
  body: string,
) => {
  const notifRef = collection(db, "notifications");
  await addDoc(notifRef, {
    userId,
    title,
    body,
    read: false,
    createdAt: serverTimestamp(),
  });
};
