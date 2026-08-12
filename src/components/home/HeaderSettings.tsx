// src/components/home/HeaderSettings.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderSettingsProps {
  onSelectOption?: (key: string) => void;
  onSavePreferences?: (assistantName: string, userName: string) => void;
}

export const HeaderSettings = ({
  onSelectOption,
  onSavePreferences,
}: HeaderSettingsProps) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [assistantName, setAssistantName] = useState("VoiAst");
  const [userName, setUserName] = useState("Ateeq Malkani");

  const handlePress = (id: string) => {
    if (onSavePreferences) {
      onSavePreferences(assistantName, userName);
    }
    setModalVisible(false);

    if (id === "general") {
      router.push("/settings/general" as any);
      return;
    }

    if (onSelectOption) {
      onSelectOption(id);
    }
  };

  return (
    <>
      {/* Top Right Settings Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Settings Modal Overlay */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.menuCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView bounces={false} style={styles.optionsList}>
              {/* Personalization Inputs */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Assistant Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={assistantName}
                  onChangeText={setAssistantName}
                  placeholder="e.g. VoiAst"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Your Name / Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="e.g. Ateeq"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.divider} />

              {/* General Option */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handlePress("general")}
                activeOpacity={0.6}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="options-outline" size={18} color="#94A3B8" />
                  <Text style={styles.optionLabel}>General</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#334155" />
              </TouchableOpacity>

              {/* Profile */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handlePress("profile")}
                activeOpacity={0.6}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="person-outline" size={18} color="#94A3B8" />
                  <Text style={styles.optionLabel}>Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#334155" />
              </TouchableOpacity>

              {/* Connected Apps */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handlePress("connected_apps")}
                activeOpacity={0.6}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="apps-outline" size={18} color="#94A3B8" />
                  <Text style={styles.optionLabel}>Connected Apps</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#334155" />
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={styles.logoutRow}
                onPress={() => handlePress("logout")}
                activeOpacity={0.6}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text style={styles.destructiveLabel}>Logout</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#EF4444" />
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 11, 20, 0.75)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
  },
  menuCard: {
    width: 270,
    backgroundColor: "#0F172A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  menuTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  optionsList: {
    paddingVertical: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  textInput: {
    backgroundColor: "#070B14",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 8,
    color: "#F8FAFC",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    marginTop: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "500",
  },
  destructiveLabel: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
