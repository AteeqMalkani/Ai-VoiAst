// src/services/googleAuth.ts
import { auth } from "@/firebase/config";
import { syncUserProfileOnLogin } from "@/services/db";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Platform } from "react-native";

// Configure Google Sign-In with Web Client ID
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

export const signInWithGoogle = async () => {
  try {
    // 1. Check Play Services on Android
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    // 2. Clear lingering local cache so user gets prompt every time
    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignore if no user was signed in
    }

    // 3. Trigger Google Sign-In modal
    const response = await GoogleSignin.signIn();

    // 4. Safely extract ID token (handles v12+ response format vs legacy)
    const idToken = response.data?.idToken || (response as any).idToken;

    if (!idToken) {
      throw new Error("Google Sign-In failed: No ID Token retrieved.");
    }

    // 5. Create Firebase Auth Credential
    const credential = GoogleAuthProvider.credential(idToken);

    // 6. Sign in to Firebase with Credential
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // 7. Sync profile to Firestore
    await syncUserProfileOnLogin({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });

    return user;
  } catch (error: any) {
    if (
      error.code === statusCodes.SIGN_IN_CANCELLED ||
      error.code === "SIGN_IN_CANCELLED"
    ) {
      console.log("User cancelled Google Sign-In flow");
      return null;
    }

    if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Sign-in operation is already in progress");
      return null;
    }

    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
