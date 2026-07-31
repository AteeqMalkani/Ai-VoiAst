import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#070B14" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "600" },
        headerBackTitle: "Back",
        contentStyle: { backgroundColor: "#070B14" },
      }}
    >
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="theme" options={{ title: "Theme" }} />
      <Stack.Screen name="voice" options={{ title: "Voice Settings" }} />
      <Stack.Screen name="language" options={{ title: "Language" }} />
      <Stack.Screen
        name="connected-apps"
        options={{ title: "Connected Apps" }}
      />
    </Stack>
  );
}
