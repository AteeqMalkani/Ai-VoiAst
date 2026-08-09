import { Ionicons } from "@expo/vector-icons";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [assistantName, setAssistantName] = useState("VoiAst");
  const [userName, setUserName] = useState("Ateeq Malkani");

  const menuItems = [
    { id: "profile", label: "Profile", icon: "person-outline" },
    { id: "theme", label: "Theme", icon: "color-palette-outline" },
    { id: "voice", label: "Voice", icon: "mic-outline" },
    { id: "language", label: "Language", icon: "language-outline" },
    { id: "connected_apps", label: "Connected Apps", icon: "apps-outline" },
    {
      id: "logout",
      label: "Logout",
      icon: "log-out-outline",
      isDestructive: true,
    },
  ];

  const handlePress = (id: string) => {
    if (onSavePreferences) {
      onSavePreferences(assistantName, userName);
    }
    setModalVisible(false);
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
                  placeholder="e.g. Gem, Jarvis"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Your Name / Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="e.g. Boss, Sir"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.divider} />

              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionRow,
                    index === menuItems.length - 1 && styles.lastRow,
                  ]}
                  onPress={() => handlePress(item.id)}
                  activeOpacity={0.6}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.isDestructive ? "#EF4444" : "#94A3B8"}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        item.isDestructive && styles.destructiveLabel,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={item.isDestructive ? "#EF4444" : "#334155"}
                  />
                </TouchableOpacity>
              ))}
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
    width: 260,
    backgroundColor: "#111827",
    borderRadius: 16,
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
    fontWeight: "600",
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
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#0B0F19",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 8,
    color: "#F8FAFC",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  lastRow: {
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    marginTop: 4,
    paddingTop: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  destructiveLabel: {
    color: "#EF4444",
  },
});
