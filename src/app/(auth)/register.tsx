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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            placeholder="Enter your full name"
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
              secureTextEntry={!showPassword}
              placeholder="Create a password"
              placeholderTextColor="#64748B"
              style={{
                flex: 1,
                color: "white",
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
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#64748B"
              style={{
                flex: 1,
                color: "white",
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
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Create Account
          </Text>
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
