import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text } from "react-native";

import { signInWithGoogle } from "@/services/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

export default function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGooglePress = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();

      if (onSuccess) {
        onSuccess();
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      // Don't alert if the user simply cancelled the sign-in modal flow
      if (error?.code !== "SIGN_IN_CANCELLED") {
        Alert.alert(
          "Google Sign-In Failed",
          error?.message || "Could not complete authentication with Google.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleGooglePress}
      disabled={loading}
      style={{
        height: 58,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#111827",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <MaterialCommunityIcons name="google" size={22} color="#EA4335" />
          <Text
            style={{
              color: "white",
              marginLeft: 12,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Continue with Google
          </Text>
        </>
      )}
    </Pressable>
  );
}
