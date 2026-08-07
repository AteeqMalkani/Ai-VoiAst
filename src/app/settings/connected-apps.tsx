import { auth } from "@/firebase/config";
import {
  checkGoogleConnectionState,
  signInWithGoogle,
} from "@/services/googleAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConnectedAppsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [connections, setConnections] = useState({
    notes: false,
    automate: true,
  });

  // Check existing Google authentication state on mount using cross-platform helper
  useEffect(() => {
    checkGoogleConnection();
  }, []);

  const checkGoogleConnection = async () => {
    const isConnected = await checkGoogleConnectionState();
    setIsGoogleConnected(isConnected);
  };

  const handleGoogleToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isGoogleConnected) {
        // Disconnect: Sign out from Google & Firebase Auth
        try {
          await GoogleSignin.signOut();
        } catch {
          // Ignore if no native session existed
        }
        await auth.signOut();
        setIsGoogleConnected(false);
        Alert.alert("Disconnected", "Google Calendar unlinked.");
      } else {
        // Connect: Trigger Google OAuth Sign-In flow
        const result = await signInWithGoogle();
        if (result) {
          setIsGoogleConnected(true);
          Alert.alert("Connected", "Google Calendar linked successfully!");
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Authentication Error",
        error?.message || "Failed to update Google connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleLocalSwitch = (key: keyof typeof connections) => {
    setConnections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Safe back navigation handler
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connected Apps</Text>
      <Text style={styles.subtitle}>
        Manage third-party services linked with VoiAst.
      </Text>

      <View style={styles.list}>
        {/* Google Calendar Toggle */}
        <View style={styles.appRow}>
          <View style={styles.textContainer}>
            <Text style={styles.appName}>📅 Google Calendar</Text>
            <Text style={styles.appDesc}>
              Sync meetings and set automated schedule reminders
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Switch
              value={isGoogleConnected}
              onValueChange={handleGoogleToggle}
              trackColor={{ false: "#374151", true: "#2563EB" }}
            />
          )}
        </View>

        {/* Local Notes Toggle */}
        <View style={styles.appRow}>
          <View style={styles.textContainer}>
            <Text style={styles.appName}>📄 Notes</Text>
            <Text style={styles.appDesc}>
              Create voice notes and capture quick thoughts
            </Text>
          </View>
          <Switch
            value={connections.notes}
            onValueChange={() => toggleLocalSwitch("notes")}
            trackColor={{ false: "#374151", true: "#2563EB" }}
          />
        </View>

        {/* Automate Runner Toggle */}
        <View style={styles.appRow}>
          <View style={styles.textContainer}>
            <Text style={styles.appName}>🤖 Automate Runner</Text>
            <Text style={styles.appDesc}>Execute multi-step task flows</Text>
          </View>
          <Switch
            value={connections.automate}
            onValueChange={() => toggleLocalSwitch("automate")}
            trackColor={{ false: "#374151", true: "#2563EB" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F19", padding: 24 },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backText: { color: "#9CA3AF", fontSize: 16, fontWeight: "500" },
  title: { color: "#FFF", fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#9CA3AF", fontSize: 14, marginBottom: 24 },
  list: { backgroundColor: "#111827", borderRadius: 16, padding: 16 },
  appRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  textContainer: { flex: 1, paddingRight: 12 },
  appName: { color: "#FFF", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  appDesc: { color: "#9CA3AF", fontSize: 12 },
});
