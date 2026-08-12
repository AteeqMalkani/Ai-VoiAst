// src/screens/ProfileScreen.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topNav}>
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

        <Text style={styles.screenHeader}>Profile Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Holographic Avatar Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarGlowContainer}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>AM</Text>
            </View>
          </View>

          <Text style={styles.name}>Ateeq Malkani</Text>
          <Text style={styles.email}>ateeq@example.com</Text>

          {/* Voice Engine ID Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.voiceBadge}>
              <MaterialCommunityIcons
                name="account-voice"
                size={14}
                color="#38BDF8"
              />
              <Text style={styles.voiceBadgeText}>Voice OS ID: #8802</Text>
            </View>
          </View>
        </View>

        {/* Cyber-Grid Account Stats */}
        <Text style={styles.sectionTitle}>System Status & Account</Text>

        <View style={styles.gridContainer}>
          {/* Status Box */}
          <View style={styles.gridCard}>
            <View style={styles.gridHeader}>
              <MaterialCommunityIcons name="pulse" size={20} color="#10B981" />
              <Text style={styles.gridLabel}>Engine Status</Text>
            </View>
            <Text style={styles.statusActive}>ONLINE</Text>
            <Text style={styles.gridSub}>Latency: 12ms</Text>
          </View>

          {/* Plan Box */}
          <View style={styles.gridCard}>
            <View style={styles.gridHeader}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color="#38BDF8"
              />
              <Text style={styles.gridLabel}>Identity</Text>
            </View>
            <Text style={styles.gridValue}>Primary User</Text>
            <Text style={styles.gridSub}>Full Access Tier</Text>
          </View>
        </View>

        {/* Detail List */}
        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>Ateeq Malkani</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Default Voice AI</Text>
            <Text style={styles.value}>VoiAst Core v2</Text>
          </View>
          <View style={styles.rowBorderNone}>
            <Text style={styles.label}>STT Provider</Text>
            <Text style={styles.valueCyan}>ElevenLabs STT</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },
  topNav: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
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
  screenHeader: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#38BDF8",
    marginTop: 8,
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarGlowContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#818CF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#818CF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
    backgroundColor: "#1E1B4B",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#38BDF8",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  email: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 4,
  },
  badgeRow: {
    marginTop: 16,
  },
  voiceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.3)",
    gap: 6,
  },
  voiceBadgeText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  gridLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  statusActive: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  gridValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  gridSub: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  rowBorderNone: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  valueCyan: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "600",
  },
});
