import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile Settings</Text>

      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>AM</Text>
        </View>
        <Text style={styles.name}>Ateeq Malkani</Text>
        <Text style={styles.email}>ateeq@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>Ateeq Malkani</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Active</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F19", padding: 24 },
  backButton: { marginBottom: 20 },
  backText: { color: "#9CA3AF", fontSize: 16 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "700", marginBottom: 24 },
  card: {
    alignItems: "center",
    backgroundColor: "#111827",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  name: { color: "#FFF", fontSize: 20, fontWeight: "600" },
  email: { color: "#9CA3AF", fontSize: 14, marginTop: 4 },
  section: { backgroundColor: "#111827", padding: 20, borderRadius: 16 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  label: { color: "#9CA3AF" },
  value: { color: "#FFF", fontWeight: "500" },
});
