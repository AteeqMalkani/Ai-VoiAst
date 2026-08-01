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

import { register, registerWithGoogle } from "@/services/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      Alert.alert("Validation Error", "Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }

    if (!password) {
      Alert.alert("Validation Error", "Please enter a password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 8 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase
      await register(trimmedName, trimmedEmail, password);

      // 2. Notify the user and navigate upon dismissal
      Alert.alert(
        "User Created Successfully",
        "Your account has been created. Please sign in to continue.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              router.dismissAll();
              router.replace("/(auth)/login");
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "An account with this email already exists.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          message = "Password is too weak.";
          break;

        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;
      }

      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await registerWithGoogle();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error?.message ||
          "Could not complete Google Sign-Up. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
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
        {/* Back Button */}
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
            Create Account
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 18,
              marginTop: 10,
              lineHeight: 28,
            }}
          >
            Join VoiAst and start automating your daily work.
          </Text>
        </View>

        {/* Full Name */}
        <View style={{ marginTop: 45 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
            }}
          >
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            autoComplete="name"
            placeholder="Enter your full name"
            placeholderTextColor="#64748B"
            editable={!loading && !googleLoading}
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

        {/* Email */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
            }}
          >
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="Enter your email"
            placeholderTextColor="#64748B"
            editable={!loading && !googleLoading}
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

        {/* Password */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
            }}
          >
            Password
          </Text>

          <View
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#1E293B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              autoComplete="new-password"
              placeholder="Create a password"
              placeholderTextColor="#64748B"
              editable={!loading && !googleLoading}
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
              }}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#94A3B8"
              />
            </Pressable>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
            }}
          >
            Confirm Password
          </Text>

          <View
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#1E293B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
            }}
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              placeholderTextColor="#64748B"
              editable={!loading && !googleLoading}
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
              }}
            />

            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#94A3B8"
              />
            </Pressable>
          </View>
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          disabled={loading || googleLoading}
          style={{
            marginTop: 40,
            height: 58,
            borderRadius: 18,
            backgroundColor: "#5B8CFF",
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
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Create Account
            </Text>
          )}
        </Pressable>

        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 32,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#1E293B",
            }}
          />

          <Text
            style={{
              color: "#64748B",
              marginHorizontal: 14,
            }}
          >
            OR
          </Text>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#1E293B",
            }}
          />
        </View>

        {/* Register with Google Button */}
        <Pressable
          onPress={handleGoogleRegister}
          disabled={loading || googleLoading}
          style={{
            height: 58,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#1E293B",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "transparent",
            opacity: googleLoading ? 0.7 : 1,
          }}
        >
          {googleLoading ? (
            <ActivityIndicator color="#EA4335" />
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
                Sign Up with Google
              </Text>
            </>
          )}
        </Pressable>

        {/* Footer */}
        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#94A3B8" }}>Already have an account?</Text>

          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text
              style={{
                marginLeft: 6,
                color: "#5B8CFF",
                fontWeight: "700",
              }}
            >
              Sign In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
