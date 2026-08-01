import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";

/**
 * Register a new user with Email and Password
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
 * Register / Sign In with Google
 */
export async function registerWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  // Check if the user document already exists in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  // If new user, create their document in Firestore
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

// Alias registerWithGoogle as loginWithGoogle for convenience
export const loginWithGoogle = registerWithGoogle;

/**
 * Login with Email and Password
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
