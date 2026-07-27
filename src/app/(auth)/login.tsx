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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("Ateeq@gmail.com");
  const [password, setPassword] = useState("123456");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = () => {
    if (email === "Ateeq@gmail.com" && password === "12") {
      router.replace("/(tabs)");
    } else {
      alert("Invalid demo credentials");
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
              fontSize: 15,
            }}
          >
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#64748B"
            style={{
              height: 58,
              borderRadius: 18,
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#1E293B",
              paddingHorizontal: 18,
              color: "white",
              fontSize: 16,
            }}
          />
        </View>

        {/* Password */}

        <View
          style={{
            marginTop: 24,
          }}
        >
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
              borderColor: "#1E293B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              placeholder="Enter your password"
              placeholderTextColor="#64748B"
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
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

          <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
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

        {/* Sign In */}

        <Pressable
          onPress={handleLogin}
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
            Sign In
          </Text>
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

        {/* Google */}

        <Pressable
          style={{
            height: 58,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#1E293B",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
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
