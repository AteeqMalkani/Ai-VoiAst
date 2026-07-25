import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeStore, themeStore, ColorSchemeType } from '@/store';
import { Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { colorScheme } = useThemeStore();

  // Assistant Configuration Mock States
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [autoRunPlans, setAutoRunPlans] = useState(false);
  const [voiceAccent, setVoiceAccent] = useState<'standard' | 'british' | 'futuristic' | 'deep'>('futuristic');
  const [voiceSpeed, setVoiceSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const themeOptions: { label: string; value: ColorSchemeType }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Settings</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Configure app theme and voice assistant features
            </ThemedText>
          </View>

          {/* Theme Section */}
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Theme Preference
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <View style={styles.themeSelectorRow}>
                {themeOptions.map((opt) => {
                  const isSelected = colorScheme === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.8}
                      onPress={() => themeStore.setColorScheme(opt.value)}
                      style={[
                        styles.themeButton,
                        { borderColor: theme.border },
                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={[styles.themeText, isSelected && { color: '#FFF', fontWeight: 'bold' }]}
                      >
                        {opt.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ThemedView>
          </View>

          {/* Assistant Audio Section */}
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Vocal System
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              
              {/* Wake word toggle */}
              <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>Wake Word Activation</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.settingDesc}>
                    Listen for "Hey Pilot" in the background
                  </ThemedText>
                </View>
                <Switch
                  value={wakeWordActive}
                  onValueChange={setWakeWordActive}
                  trackColor={{ false: '#767577', true: theme.primaryLight }}
                  thumbColor={wakeWordActive ? theme.primary : '#f4f3f4'}
                />
              </View>

              {/* Auto Run Approval toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>Auto-Approve Actions</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.settingDesc}>
                    Run generated plans without clicking "Approve"
                  </ThemedText>
                </View>
                <Switch
                  value={autoRunPlans}
                  onValueChange={setAutoRunPlans}
                  trackColor={{ false: '#767577', true: theme.primaryLight }}
                  thumbColor={autoRunPlans ? theme.primary : '#f4f3f4'}
                />
              </View>

            </ThemedView>
          </View>

          {/* Assistant Voice Style Section */}
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Voice Accent Model
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <View style={styles.accentGrid}>
                {([
                  { id: 'standard', label: 'Standard US' },
                  { id: 'british', label: 'British RP' },
                  { id: 'futuristic', label: 'AI Synthesis' },
                  { id: 'deep', label: 'Deep Bass' },
                ] as const).map((accent) => {
                  const isSelected = voiceAccent === accent.id;
                  return (
                    <TouchableOpacity
                      key={accent.id}
                      onPress={() => setVoiceAccent(accent.id)}
                      style={[
                        styles.gridButton,
                        { borderColor: theme.border },
                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={[styles.gridButtonText, isSelected && { color: '#FFF', fontWeight: 'bold' }]}
                      >
                        {accent.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ThemedView>
          </View>

          {/* Voice Speech Speed Section */}
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              Speech Output Speed
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <View style={styles.themeSelectorRow}>
                {(['slow', 'normal', 'fast'] as const).map((speed) => {
                  const isSelected = voiceSpeed === speed;
                  return (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => setVoiceSpeed(speed)}
                      style={[
                        styles.themeButton,
                        { borderColor: theme.border },
                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={[styles.themeText, isSelected && { color: '#FFF', fontWeight: 'bold' }]}
                      >
                        {speed.toUpperCase()}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ThemedView>
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              System Information
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              <View style={styles.infoRow}>
                <ThemedText type="small" themeColor="textSecondary">App Version</ThemedText>
                <ThemedText type="smallBold">1.0.0 (VoiAst-Agent)</ThemedText>
              </View>
              <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: Spacing.two }]}>
                <ThemedText type="small" themeColor="textSecondary">Target Platform</ThemedText>
                <ThemedText type="smallBold">Expo SDK 57 (v57.0.8)</ThemedText>
              </View>
              <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: Spacing.two }]}>
                <ThemedText type="small" themeColor="textSecondary">Powered by</ThemedText>
                <ThemedText type="smallBold" themeColor="primary">Gemini 3.5 Flash</ThemedText>
              </View>
            </ThemedView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  header: {
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: Spacing.one,
  },
  sectionCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  themeButton: {
    flex: 1,
    height: 38,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: {
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingVertical: Spacing.two,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
  },
  accentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  gridButton: {
    width: '48%',
    height: 40,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonText: {
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    paddingVertical: 4,
  },
});
