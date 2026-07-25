import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutomationStore, automationStore, Automation } from '@/store';
import { Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AutomationScreen() {
  const theme = useTheme();
  const { automations } = useAutomationStore();
  
  // Category tabs filtering
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'productivity' | 'home' | 'media'>('all');
  
  // Custom automation form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newCategory, setNewCategory] = useState<'productivity' | 'home' | 'media'>('productivity');

  const filteredAutomations = automations.filter((auto) => {
    if (selectedCategory === 'all') return true;
    return auto.category === selectedCategory;
  });

  const handleAddAutomation = () => {
    if (!newTitle || !newTrigger || !newAction) return;

    automationStore.addAutomation({
      title: newTitle,
      description: newDesc || 'Custom voice-triggered workspace command.',
      trigger: newTrigger.toLowerCase().trim(),
      action: newAction,
      isActive: true,
      category: newCategory,
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewTrigger('');
    setNewAction('');
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    automationStore.deleteAutomation(id);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Automations</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Manage vocal shortcut actions & task sequences
            </ThemedText>
          </View>

          {/* Form to Add Custom Automation */}
          <ThemedView type="backgroundElement" style={styles.formContainer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setIsFormOpen(!isFormOpen)}
              style={styles.formHeader}
            >
              <ThemedText style={styles.formTitle}>
                {isFormOpen ? 'Cancel Custom Action' : '＋ Add Custom Automation'}
              </ThemedText>
            </TouchableOpacity>

            {isFormOpen && (
              <View style={[styles.formBody, { borderTopColor: theme.border }]}>
                {/* Title */}
                <ThemedText type="smallBold" style={styles.label}>Automation Name</ThemedText>
                <TextInput
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="e.g. Turn On Studio Lights"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                />

                {/* Trigger */}
                <ThemedText type="smallBold" style={styles.label}>Voice Trigger Phrase</ThemedText>
                <TextInput
                  value={newTrigger}
                  onChangeText={setNewTrigger}
                  placeholder="e.g. ignite studio lights"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                />

                {/* Action */}
                <ThemedText type="smallBold" style={styles.label}>Execution Script / Action</ThemedText>
                <TextInput
                  value={newAction}
                  onChangeText={setNewAction}
                  placeholder="e.g. IoT SmartSwitch: On | hue: 100%"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                />

                {/* Description */}
                <ThemedText type="smallBold" style={styles.label}>Description (Optional)</ThemedText>
                <TextInput
                  value={newDesc}
                  onChangeText={setNewDesc}
                  placeholder="Briefly state what this rule achieves"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                />

                {/* Category select */}
                <ThemedText type="smallBold" style={styles.label}>Category</ThemedText>
                <View style={styles.categorySelectRow}>
                  {(['productivity', 'home', 'media'] as const).map((cat) => {
                    const isActive = newCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setNewCategory(cat)}
                        style={[
                          styles.catSelectButton,
                          { borderColor: theme.border },
                          isActive && { backgroundColor: theme.primary, borderColor: theme.primary },
                        ]}
                      >
                        <ThemedText
                          type="small"
                          style={[styles.catSelectText, isActive && { color: '#FFF', fontWeight: 'bold' }]}
                        >
                          {cat}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Submit button */}
                <TouchableOpacity
                  onPress={handleAddAutomation}
                  disabled={!newTitle || !newTrigger || !newAction}
                  style={[
                    styles.submitButton, 
                    { backgroundColor: theme.primary },
                    (!newTitle || !newTrigger || !newAction) && { opacity: 0.5 }
                  ]}
                >
                  <ThemedText type="smallBold" style={styles.submitText}>Save Automation</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </ThemedView>

          {/* Category Filter Tabs */}
          <View style={styles.tabRow}>
            {(['all', 'productivity', 'home', 'media'] as const).map((tab) => {
              const isSelected = selectedCategory === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedCategory(tab)}
                  style={[
                    styles.tabButton,
                    isSelected && [styles.tabButtonActive, { borderBottomColor: theme.primary }],
                  ]}
                >
                  <ThemedText
                    type="small"
                    themeColor={isSelected ? 'text' : 'textSecondary'}
                    style={[isSelected && styles.tabTextActive]}
                  >
                    {tab.toUpperCase()}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Automations Cards List */}
          <View style={styles.listContainer}>
            {filteredAutomations.map((auto) => (
              <ThemedView key={auto.id} type="backgroundElement" style={styles.autoCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleInfo}>
                    <ThemedText style={styles.autoTitle}>{auto.title}</ThemedText>
                    <View style={[styles.categoryBadge, { borderColor: theme.border }]}>
                      <ThemedText type="code" style={styles.badgeText}>
                        {auto.category}
                      </ThemedText>
                    </View>
                  </View>
                  <Switch
                    value={auto.isActive}
                    onValueChange={() => automationStore.toggleAutomation(auto.id)}
                    trackColor={{ false: '#767577', true: theme.primaryLight }}
                    thumbColor={auto.isActive ? theme.primary : '#f4f3f4'}
                  />
                </View>

                <ThemedText type="small" themeColor="textSecondary" style={styles.autoDesc}>
                  {auto.description}
                </ThemedText>

                <View style={styles.metaRow}>
                  <View style={styles.triggerContainer}>
                    <ThemedText type="smallBold" themeColor="primary">Say: </ThemedText>
                    <ThemedText type="code" style={styles.triggerText}>
                      "{auto.trigger}"
                    </ThemedText>
                  </View>
                  
                  {auto.lastRun && (
                    <ThemedText type="small" themeColor="textSecondary" style={styles.lastRunText}>
                      Run: {auto.lastRun}
                    </ThemedText>
                  )}
                </View>

                {/* Delete button */}
                <TouchableOpacity 
                  onPress={() => handleDelete(auto.id)}
                  style={styles.deleteButton}
                >
                  <ThemedText type="small" themeColor="error">Delete</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))}
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
  formContainer: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  formHeader: {
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  formBody: {
    borderTopWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  label: {
    fontSize: 12,
    opacity: 0.8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  categorySelectRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  catSelectButton: {
    flex: 1,
    height: 36,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catSelectText: {
    textTransform: 'capitalize',
  },
  submitButton: {
    height: 40,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitText: {
    color: '#FFFFFF',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    marginVertical: Spacing.two,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 3,
  },
  tabTextActive: {
    fontWeight: '700',
  },
  listContainer: {
    gap: Spacing.four,
  },
  autoCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
    flex: 1,
  },
  autoTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryBadge: {
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  autoDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  triggerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastRunText: {
    fontSize: 11,
    opacity: 0.6,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
});
