import { auth } from "@/firebase/config";
import { syncUserProfileOnLogin } from "@/services/db";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { Platform } from "react-native";

// 1. Define required Google OAuth scopes for Calendar & Gmail access
const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar"];

// 2. Configure Native Google Sign-In (iOS/Android only)
if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: GOOGLE_SCOPES,
    offlineAccess: true,
  });
}

export const signInWithGoogle = async () => {
  try {
    // ─── WEB PLATFORM FLOW ───────────────────────────────────────────────────
    if (Platform.OS === "web") {
      const provider = new GoogleAuthProvider();
      GOOGLE_SCOPES.forEach((scope) => provider.addScope(scope));

      // Trigger Firebase Web OAuth Popup
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Extract OAuth Access Token from Web OAuth credential
      const credential =
        GoogleAuthProvider.credentialFromResult(userCredential);
      const accessToken = credential?.accessToken;

      if (!accessToken) {
        console.warn(
          "[GoogleAuth Web] Access token not retrieved from web auth payload.",
        );
      }

      // Sync user profile to Firestore
      await syncUserProfileOnLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        googleAccessToken: accessToken,
      });

      return { user, accessToken };
    }

    // ─── NATIVE MOBILE FLOW (iOS / Android) ─────────────────────────────────
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignore if no active session existed
    }

    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken || (response as any).idToken;

    if (!idToken) {
      throw new Error("Google Sign-In failed: No ID Token retrieved.");
    }

    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens.accessToken;

    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    await syncUserProfileOnLogin({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      googleAccessToken: accessToken,
    });

    return { user, accessToken };
  } catch (error: any) {
    if (
      error.code === statusCodes?.SIGN_IN_CANCELLED ||
      error.code === "SIGN_IN_CANCELLED" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      console.log("User cancelled Google Sign-In flow");
      return null;
    }

    if (error.code === statusCodes?.IN_PROGRESS) {
      console.log("Sign-in operation is already in progress");
      return null;
    }

    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

/**
 * Check active connection state across Web and Native platforms
 */
export const checkGoogleConnectionState = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    if (Platform.OS === "web") {
      return Boolean(currentUser);
    } else {
      const googleUser = await GoogleSignin.getCurrentUser();
      return Boolean(googleUser);
    }
  } catch (error) {
    console.error("Failed to check Google connection state:", error);
    return false;
  }
};
