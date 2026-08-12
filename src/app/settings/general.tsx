// src/app/settings/general.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SETTINGS_STORAGE_KEY = "@voiast_general_settings";

export default function GeneralSettingsScreen() {
  const router = useRouter();

  // Settings state configurations
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [wakeWordValue, setWakeWordValue] = useState("");
  const [sleepWordEnabled, setSleepWordEnabled] = useState(true);
  const [sleepWordValue, setSleepWordValue] = useState("");

  const [selectedVoice, setSelectedVoice] = useState("Default Voice");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [responseStyle, setResponseStyle] = useState<
    "Concise" | "Balanced" | "Detailed"
  >("Balanced");

  // Modal visibility & available options state
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);

  // Load saved settings and speech voices on mount
  useEffect(() => {
    async function initSettings() {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.wakeWordEnabled !== undefined)
            setWakeWordEnabled(parsed.wakeWordEnabled);
          if (parsed.wakeWordValue !== undefined)
            setWakeWordValue(parsed.wakeWordValue);
          if (parsed.sleepWordEnabled !== undefined)
            setSleepWordEnabled(parsed.sleepWordEnabled);
          if (parsed.sleepWordValue !== undefined)
            setSleepWordValue(parsed.sleepWordValue);
          if (parsed.selectedVoice) setSelectedVoice(parsed.selectedVoice);
          if (parsed.selectedLanguage)
            setSelectedLanguage(parsed.selectedLanguage);
          if (parsed.responseStyle) setResponseStyle(parsed.responseStyle);
        }

        const voices = await Speech.getAvailableVoicesAsync();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (error) {
        console.error("Failed to load general settings or voices:", error);
      }
    }
    initSettings();
  }, []);

  // Save settings helper function
  const updateSetting = async (key: string, value: any) => {
    try {
      const currentSettings = {
        wakeWordEnabled,
        wakeWordValue,
        sleepWordEnabled,
        sleepWordValue,
        selectedVoice,
        selectedLanguage,
        responseStyle,
        [key]: value,
      };
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(currentSettings),
      );
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };

  const languages = [
    { label: "English (US)", code: "en-US" },
    { label: "English (UK)", code: "en-GB" },
    { label: "Spanish", code: "es-ES" },
    { label: "French", code: "fr-FR" },
    { label: "German", code: "de-DE" },
    { label: "Urdu", code: "ur-PK" },
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation */}
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

        <Text style={styles.screenHeader}>General Settings</Text>
        <Text style={styles.subtitle}>
          Configure voice behavior, triggers, and response styles.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section: Voice Triggers */}
        <Text style={styles.sectionTitle}>Triggers & Control</Text>

        <View style={styles.card}>
          {/* Wake Word */}
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={20}
                  color="#38BDF8"
                />
              </View>
              <View>
                <Text style={styles.rowTitle}>Wake Word</Text>
                <Text style={styles.rowDesc}>Enable phrase activation</Text>
              </View>
            </View>
            <Switch
              value={wakeWordEnabled}
              onValueChange={(val) => {
                setWakeWordEnabled(val);
                updateSetting("wakeWordEnabled", val);
              }}
              trackColor={{ false: "#1E293B", true: "#38BDF8" }}
              thumbColor="#FFFFFF"
            />
          </View>
          {wakeWordEnabled && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={wakeWordValue}
                onChangeText={(val) => {
                  setWakeWordValue(val);
                  updateSetting("wakeWordValue", val);
                }}
                placeholder='e.g. "VoiAst, wake up"'
                placeholderTextColor="#64748B"
              />
            </View>
          )}

          <View style={styles.divider} />

          {/* Sleep Word */}
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="power-sleep"
                  size={20}
                  color="#818CF8"
                />
              </View>
              <View>
                <Text style={styles.rowTitle}>Sleep Word</Text>
                <Text style={styles.rowDesc}>Phrase to pause assistant</Text>
              </View>
            </View>
            <Switch
              value={sleepWordEnabled}
              onValueChange={(val) => {
                setSleepWordEnabled(val);
                updateSetting("sleepWordEnabled", val);
              }}
              trackColor={{ false: "#1E293B", true: "#818CF8" }}
              thumbColor="#FFFFFF"
            />
          </View>
          {sleepWordEnabled && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={sleepWordValue}
                onChangeText={(val) => {
                  setSleepWordValue(val);
                  updateSetting("sleepWordValue", val);
                }}
                placeholder='e.g. "VoiAst, go to sleep"'
                placeholderTextColor="#64748B"
              />
            </View>
          )}
        </View>

        {/* Section: Output & Speech */}
        <Text style={styles.sectionTitle}>Voice & Audio (Expo Speech)</Text>

        <View style={styles.card}>
          {/* Voice Model Selection Modal Trigger */}
          <TouchableOpacity
            style={styles.rowItem}
            activeOpacity={0.7}
            onPress={() => setVoiceModalVisible(true)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="mic-outline" size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Voice Model</Text>
                <Text style={styles.rowDesc} numberOfLines={1}>
                  {selectedVoice}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Language Selection Modal Trigger */}
          <TouchableOpacity
            style={styles.rowItem}
            activeOpacity={0.7}
            onPress={() => setLangModalVisible(true)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="language-outline" size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Language</Text>
                <Text style={styles.rowDesc}>{selectedLanguage}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Section: Behavior */}
        <Text style={styles.sectionTitle}>Assistant Behavior</Text>

        <View style={styles.card}>
          <View style={styles.responseContainer}>
            <View style={styles.rowLeftFull}>
              <View style={styles.iconCircle}>
                <Ionicons name="options-outline" size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Response Style</Text>
                <Text style={styles.rowDesc}>
                  Choose how verbose VoiAst replies
                </Text>
              </View>
            </View>

            {/* Segmented Style Buttons */}
            <View style={styles.segmentedControl}>
              {(["Concise", "Balanced", "Detailed"] as const).map((style) => {
                const isActive = responseStyle === style;
                return (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.segmentBtn,
                      isActive && styles.segmentActive,
                    ]}
                    onPress={() => {
                      setResponseStyle(style);
                      updateSetting("responseStyle", style);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isActive && styles.segmentTextActive,
                      ]}
                    >
                      {style}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Voice Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={voiceModalVisible}
        onRequestClose={() => setVoiceModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVoiceModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Device Voice</Text>
              <TouchableOpacity onPress={() => setVoiceModalVisible(false)}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableVoices}
              keyExtractor={(item) => item.identifier}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedVoice(item.name);
                    updateSetting("selectedVoice", item.name);
                    setVoiceModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemSub}>{item.language}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No local voices detected.</Text>
              }
            />
          </View>
        </Pressable>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={langModalVisible}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLangModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedLanguage(item.code);
                    updateSetting("selectedLanguage", item.code);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  <Text style={styles.modalItemSub}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 8,
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
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  sectionTitle: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  rowLeftFull: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  rowDesc: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  inputWrapper: {
    paddingBottom: 14,
  },
  textInput: {
    backgroundColor: "#070B14",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 10,
    color: "#F8FAFC",
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
  },
  responseContainer: {
    paddingVertical: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#070B14",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: "#38BDF8",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#070B14",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 11, 20, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "#1E293B",
    maxHeight: "60%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 12,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  modalItemText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  modalItemSub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 20,
  },
});
