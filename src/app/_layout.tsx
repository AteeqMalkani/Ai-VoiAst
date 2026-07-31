import { useAuth } from "@/hooks/useAuth";
import { router, Slot, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect unauthenticated user to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect logged-in user to home tab
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return <Slot />;
}
