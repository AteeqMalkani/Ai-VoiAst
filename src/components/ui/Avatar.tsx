import React from "react";
import { Image, Text, View } from "react-native";
import { getUserAvatar, getUserInitials } from "@/utils/avatar";

interface AvatarProps {
  user?: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  size?: number;
}

export default function Avatar({ user, size = 44 }: AvatarProps) {
  const avatarSource = user ? getUserAvatar(user) : null;
  const initials = getUserInitials(user?.displayName, user?.email);

  if (avatarSource) {
    return (
      <Image
        source={avatarSource}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: "#6366F1",
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#1E293B",
        borderWidth: 1.5,
        borderColor: "#6366F1",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.4,
          fontWeight: "700",
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
