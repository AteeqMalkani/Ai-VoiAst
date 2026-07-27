import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

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

        <View
          style={{
            marginTop: 40,
          }}
        >
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

        {/* Email */}

        <View
          style={{
            marginTop: 50,
          }}
        >
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
            placeholder="Enter your email"
            placeholderTextColor="#64748B"
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#1E293B",
              color: "white",
              paddingHorizontal: 18,
            }}
          />
        </View>

        {/* Button */}

        <Pressable
          style={{
            marginTop: 40,
            height: 58,
            borderRadius: 18,
            backgroundColor: "#5B8CFF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            Send Reset Link
          </Text>
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
