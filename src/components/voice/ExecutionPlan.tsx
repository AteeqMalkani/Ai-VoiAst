import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ExecutionStep {
  id: string;
  action: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed';
}

interface ExecutionPlanProps {
  title: string;
  steps: ExecutionStep[];
  onConfirm?: () => void;
  onCancel?: () => void;
  isExecuting?: boolean;
  hasRun?: boolean;
}

export function ExecutionPlan({
  title,
  steps,
  onConfirm,
  onCancel,
  isExecuting = false,
  hasRun = false,
}: ExecutionPlanProps) {
  const theme = useTheme();

  const getStatusColor = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'success':
        return theme.success;
      case 'failed':
        return theme.error;
      case 'running':
        return theme.accent;
      case 'pending':
      default:
        return theme.textSecondary;
    }
  };

  const getStatusLabel = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'success':
        return 'Done';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running...';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title || 'Proposed Actions'}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.stepCount}>
          {steps.length} {steps.length === 1 ? 'action' : 'actions'}
        </ThemedText>
      </View>

      <View style={styles.stepsList}>
        {steps.map((step, index) => {
          const statusColor = getStatusColor(step.status);
          const isRunning = step.status === 'running';

          return (
            <View key={step.id} style={[styles.stepItem, { borderBottomColor: theme.border }]}>
              <View style={styles.stepInfo}>
                <View style={styles.stepHeaderRow}>
                  <ThemedText style={styles.stepAction}>{step.action}</ThemedText>
                  <View style={[styles.badge, { backgroundColor: `${statusColor}15` }]}>
                    <ThemedText style={[styles.badgeText, { color: statusColor }]}>
                      {getStatusLabel(step.status)}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.stepDescription}>
                  {step.description}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>

      {/* Control Buttons */}
      {!hasRun && (onConfirm || onCancel) && (
        <View style={styles.actionsContainer}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onCancel}
              disabled={isExecuting}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.buttonText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: theme.primary }]}
              onPress={onConfirm}
              disabled={isExecuting}>
              <ThemedText type="small" style={[styles.buttonText, styles.confirmButtonText]}>
                {isExecuting ? 'Executing...' : 'Approve & Run'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepCount: {
    marginLeft: 'auto',
    opacity: 0.8,
  },
  stepsList: {
    marginVertical: Spacing.two,
  },
  stepItem: {
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  stepInfo: {
    flexDirection: 'column',
    gap: Spacing.one,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
  },
  stepAction: {
    fontSize: 15,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  button: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
});
