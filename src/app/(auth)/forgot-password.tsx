import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { resetPassword } from "../../services/auth"; // Adjust relative path as needed

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      Alert.alert(
        "Reset Link Sent",
        "If an account exists with this email, a password reset link has been sent to your inbox.",
        [
          {
            text: "Back to Sign In",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    } catch (error: any) {
      let message = "Failed to send reset email. Please try again.";

      if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        // Firebase Auth security settings may swallow this, but handled if triggered
        message = "No account found with this email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many reset attempts. Please try again later.";
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#070B14",
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 28,
          paddingTop: 70,
          paddingBottom: 30,
        }}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: "rgba(255,255,255,0.08)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </Pressable>

        {/* Header */}
        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: "700",
            }}
          >
            Forgot Password
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 18,
              marginTop: 10,
              lineHeight: 28,
            }}
          >
            Enter your email and we'll send you a password reset link.
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginTop: 50 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
              fontSize: 15,
            }}
          >
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
            placeholderTextColor="#64748B"
            editable={!loading}
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#1E293B",
              color: "white",
              paddingHorizontal: 18,
              fontSize: 16,
            }}
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleResetPassword}
          disabled={loading}
          style={{
            marginTop: 40,
            height: 58,
            borderRadius: 18,
            backgroundColor: loading ? "#3B82F6" : "#5B8CFF",
            justifyContent: "center",
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Send Reset Link
            </Text>
          )}
        </Pressable>

        {/* Footer */}
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          style={{
            marginTop: 30,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: "#5B8CFF",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Back to Sign In
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
