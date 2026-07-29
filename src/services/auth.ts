import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";

/**
 * Register a new user
 */
export async function register(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = credential.user;

  await updateProfile(user, {
    displayName: name,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
}

/**
 * Login
 */
export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Reset Password
 */
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
