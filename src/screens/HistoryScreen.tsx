import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutomationStore, VoiceInteraction } from '@/store';
import { Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HistoryScreen() {
  const theme = useTheme();
  const { history } = useAutomationStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusBadge = (status: VoiceInteraction['status']) => {
    let color = theme.textSecondary;
    let label = 'Canceled';

    if (status === 'success') {
      color = theme.success;
      label = 'Success';
    } else if (status === 'failed') {
      color = theme.error;
      label = 'Failed';
    }

    return (
      <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
        <ThemedText style={[styles.badgeText, { color }]}>{label}</ThemedText>
      </View>
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderHistoryItem = ({ item }: { item: VoiceInteraction }) => {
    const isExpanded = expandedId === item.id;
    const hasPlan = !!item.plan;

    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => hasPlan && toggleExpand(item.id)}
          disabled={!hasPlan}
          style={styles.cardHeader}
        >
          <View style={styles.headerTop}>
            <ThemedText type="small" themeColor="textSecondary">
              {item.timestamp}
            </ThemedText>
            {getStatusBadge(item.status)}
          </View>

          <ThemedText style={styles.transcriptText}>
            "{item.transcript}"
          </ThemedText>

          {item.response !== '' && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.responseText}>
              {item.response}
            </ThemedText>
          )}

          {hasPlan && (
            <View style={styles.expandRow}>
              <ThemedText type="smallBold" themeColor="primary">
                {isExpanded ? 'Hide Action Steps ▲' : 'Show Action Steps ▼'}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {isExpanded && item.plan && (
          <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
            <ThemedText type="smallBold" style={styles.planTitle}>
              {item.plan.title}
            </ThemedText>
            <View style={styles.stepsContainer}>
              {item.plan.steps.map((step, idx) => {
                const isStepSuccess = step.status === 'success';
                const bulletColor = isStepSuccess ? theme.success : step.status === 'failed' ? theme.error : theme.textSecondary;

                return (
                  <View key={step.id} style={styles.stepRow}>
                    <View style={[styles.stepBullet, { backgroundColor: bulletColor }]} />
                    <View style={styles.stepInfo}>
                      <ThemedText type="smallBold">{step.action}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {step.description}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Interaction History</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Review past voice sequences & action logs
          </ThemedText>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">No past interactions recorded</ThemedText>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.one,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  cardHeader: {
    padding: Spacing.four,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    marginBottom: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  transcriptText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  expandRow: {
    marginTop: Spacing.three,
    alignItems: 'flex-start',
  },
  expandedContent: {
    borderTopWidth: 1,
    padding: Spacing.four,
    backgroundColor: 'rgba(128, 128, 128, 0.03)',
  },
  planTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.three,
  },
  stepsContainer: {
    gap: Spacing.three,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  stepBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  stepInfo: {
    flex: 1,
    gap: 2,
  },
});
