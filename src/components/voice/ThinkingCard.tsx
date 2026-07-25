import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

interface ThinkingCardProps {
  steps?: string[];
  currentStepIndex?: number;
  thoughtTimeSeconds?: number;
}

export function ThinkingCard({
  steps = ['Analyzing speech input', 'Parsing intent and parameters', 'Formulating action plan'],
  currentStepIndex = 0,
  thoughtTimeSeconds = 0,
}: ThinkingCardProps) {
  const theme = useTheme();

  // Spinning logic for thinking ring
  const spinValue = useSharedValue(0);

  useEffect(() => {
    spinValue.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, [spinValue]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinValue.value}deg` }],
  }));

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <Animated.View style={[styles.loadingCircle, spinStyle, { borderColor: theme.accent }]} />
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>Assistant is thinking</ThemedText>
          {thoughtTimeSeconds > 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              {thoughtTimeSeconds.toFixed(1)}s elapsed
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <View key={index} style={styles.stepRow}>
              {/* Node indicator */}
              <View style={styles.timelineNode}>
                {isCompleted ? (
                  <View style={[styles.dot, styles.completedDot, { backgroundColor: theme.success }]} />
                ) : isActive ? (
                  <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.accent }]} />
                ) : (
                  <View style={[styles.dot, styles.pendingDot, { backgroundColor: theme.border }]} />
                )}
                {index < steps.length - 1 && <View style={[styles.line, { backgroundColor: theme.border }]} />}
              </View>

              {/* Text description */}
              <View style={styles.stepTextContainer}>
                <ThemedText
                  type="small"
                  themeColor={isActive ? 'text' : 'textSecondary'}
                  style={[
                    styles.stepText,
                    isCompleted && styles.completedStepText,
                    isActive && styles.activeStepText,
                  ]}>
                  {step}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)', // Soft purple border
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  loadingCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepsContainer: {
    paddingLeft: Spacing.two,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 36,
  },
  timelineNode: {
    alignItems: 'center',
    marginRight: Spacing.three,
    width: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  completedDot: {
    // Green
  },
  activeDot: {
    // Indigo/accent
  },
  pendingDot: {
    // Gray
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 16,
    marginTop: 4,
  },
  stepTextContainer: {
    flex: 1,
    paddingBottom: Spacing.two,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 18,
  },
  completedStepText: {
    textDecorationLine: 'none',
    opacity: 0.6,
  },
  activeStepText: {
    fontWeight: '600',
  },
});
