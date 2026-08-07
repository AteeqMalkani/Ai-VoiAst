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

import { login, loginWithGoogle } from "@/services/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);

  // Track focused state for clean custom outline styling on Web & Mobile
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      Alert.alert(
        "Validation Error",
        "Please enter both your email and password.",
      );
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, password);
      setPassword("");
      router.replace("/(tabs)");
    } catch (error: any) {
      setPassword("");

      let message = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;
        case "auth/user-not-found":
          message = "No account exists with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Please try again later.";
          break;
      }

      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Google Sign-In Failed",
        error?.message || "Could not sign in with Google. Please try again.",
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
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 28,
          paddingTop: 70,
          paddingBottom: 30,
        }}
        keyboardShouldPersistTaps="handled"
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

        {/* Heading */}
        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: "700",
            }}
          >
            Welcome Back
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 18,
              marginTop: 10,
              lineHeight: 28,
            }}
          >
            Sign in to continue using VoiAst.
          </Text>
        </View>

        {/* Email Field Container */}
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

          <View
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: isEmailFocused ? "#5B8CFF" : "#1E293B",
              paddingHorizontal: 18,
              justifyContent: "center",
            }}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="Enter your email"
              placeholderTextColor="#64748B"
              editable={!loading && !googleLoading}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              style={{
                color: "white",
                fontSize: 16,
                ...Platform.select({
                  web: { outlineStyle: "none" } as any,
                }),
              }}
            />
          </View>
        </View>

        {/* Password Field Container */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              color: "#CBD5E1",
              marginBottom: 10,
              fontSize: 15,
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
              borderColor: isPasswordFocused ? "#5B8CFF" : "#1E293B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              placeholder="Enter your password"
              placeholderTextColor="#64748B"
              editable={!loading && !googleLoading}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
                ...Platform.select({
                  web: { outlineStyle: "none" } as any,
                }),
              }}
            />

            <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
              <MaterialCommunityIcons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#94A3B8"
              />
            </Pressable>
          </View>
        </View>

        {/* Remember & Forgot */}
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable
            disabled={loading || googleLoading}
            onPress={() => setRemember(!remember)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name={remember ? "checkbox-marked" : "checkbox-blank-outline"}
              size={22}
              color="#5B8CFF"
            />

            <Text
              style={{
                color: "#CBD5E1",
                marginLeft: 8,
              }}
            >
              Remember me
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/forgot-password")}
            disabled={loading || googleLoading}
          >
            <Text
              style={{
                color: "#5B8CFF",
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Sign In Button */}
        <Pressable
          onPress={handleLogin}
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
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Sign In
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

        {/* Google Sign-In Button */}
        <Pressable
          onPress={handleGoogleAuth}
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
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        {/* Footer */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <Text style={{ color: "#94A3B8" }}>Don't have an account?</Text>

          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text
              style={{
                color: "#5B8CFF",
                marginLeft: 6,
                fontWeight: "700",
              }}
            >
              Create Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
