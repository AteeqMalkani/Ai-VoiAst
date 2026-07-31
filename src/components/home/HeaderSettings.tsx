import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderSettingsProps {
  onSelectOption?: (key: string) => void;
}

export const HeaderSettings = ({ onSelectOption }: HeaderSettingsProps) => {
  const [modalVisible, setModalVisible] = useState(false);

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
    width: 240,
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
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lastRow: {
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    marginTop: 4,
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
