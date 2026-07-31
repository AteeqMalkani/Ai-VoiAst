import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Profile</Text>
      <Text style={styles.label}>Email: {user?.email ?? "N/A"}</Text>
      <Text style={styles.label}>User ID: {user?.uid ?? "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#070B14" },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: { color: "#94A3B8", fontSize: 16, marginBottom: 8 },
});
