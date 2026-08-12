// src/app/settings/connected-apps.tsx
import { auth } from "@/firebase/config";
import {
  checkGoogleConnectionState,
  signInWithGoogle,
} from "@/services/googleAuth";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
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
        try {
          await GoogleSignin.signOut();
        } catch {
          // Ignore if no native session existed
        }
        await auth.signOut();
        setIsGoogleConnected(false);
        Alert.alert("Disconnected", "Google Calendar unlinked.");
      } else {
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      {/* Styled Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={18} color="#94A3B8" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connected Apps</Text>
      <Text style={styles.subtitle}>
        Manage third-party services linked with VoiAst.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.gridContainer}>
          {/* Google Calendar Card */}
          <View
            style={[
              styles.card,
              isGoogleConnected
                ? styles.connectedCardGlow
                : styles.disconnectedCard,
            ]}
          >
            <View style={styles.iconCircle}>
              <FontAwesome5 name="calendar-alt" size={28} color="#4285F4" />
            </View>
            <Text style={styles.appName}>Google Calendar</Text>
            <Text style={styles.appDesc}>
              Sync meetings and set automated schedule reminders
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleGoogleToggle}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#38BDF8" />
              ) : (
                <Text
                  style={[
                    styles.actionBtnText,
                    isGoogleConnected
                      ? styles.disconnectText
                      : styles.connectText,
                  ]}
                >
                  {isGoogleConnected ? "DISCONNECT" : "CONNECT"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Notes Card */}
          <View
            style={[
              styles.card,
              connections.notes
                ? styles.connectedCardGlow
                : styles.disconnectedCard,
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="document-text" size={32} color="#94A3B8" />
            </View>
            <Text style={styles.appName}>Notes</Text>
            <Text style={styles.appDesc}>
              Create voice notes and capture quick thoughts
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLocalSwitch("notes")}
            >
              <Text
                style={[
                  styles.actionBtnText,
                  connections.notes
                    ? styles.disconnectText
                    : styles.connectText,
                ]}
              >
                {connections.notes ? "DISCONNECT" : "CONNECT"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Automate Runner Card */}
          <View
            style={[
              styles.card,
              connections.automate
                ? styles.connectedCardGlow
                : styles.disconnectedCard,
            ]}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="robot" size={34} color="#818CF8" />
            </View>
            <Text style={styles.appName}>Automate Runner</Text>
            <Text style={styles.appDesc}>Execute multi-step task flows</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLocalSwitch("automate")}
            >
              <Text
                style={[
                  styles.actionBtnText,
                  connections.automate
                    ? styles.disconnectText
                    : styles.connectText,
                ]}
              >
                {connections.automate ? "DISCONNECT" : "CONNECT"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  backText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: "47.5%",
    minHeight: 220,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  disconnectedCard: {
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  connectedCardGlow: {
    borderWidth: 1.5,
    borderColor: "#38BDF8",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  appDesc: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  actionButton: {
    marginTop: "auto",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  connectText: {
    color: "#38BDF8",
  },
  disconnectText: {
    color: "#818CF8",
  },
});
