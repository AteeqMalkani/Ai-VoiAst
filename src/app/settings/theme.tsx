import { View, Text, StyleSheet } from "react-native";

export default function theme() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Assistant Settings</Text>
      <Text style={styles.subtitle}>
        Configure voice engine, speech rate, and pitch.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#070B14" },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#94A3B8", fontSize: 15 },
});
