import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

interface WaveformProps {
  isAnimating: boolean;
  volume?: number;      // Real-time audio volume (0 to 1)
  barCount?: number;    // Number of visual bars in the waveform
  color?: string;       // Custom bar color
  maxBarHeight?: number; // Maximum height of the bars
}

export function Waveform({
  isAnimating,
  volume = 0,
  barCount = 15,
  color,
  maxBarHeight = 50,
}: WaveformProps) {
  const theme = useTheme();
  
  // Shared time value to drive the continuous wave function
  const waveTime = useSharedValue(0);

  useEffect(() => {
    if (isAnimating) {
      // Loop a time counter continuously to drive sine wave offsets
      waveTime.value = withRepeat(
        withTiming(Math.PI * 2, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      waveTime.value = withTiming(0, { duration: 300 });
    }
  }, [isAnimating, waveTime]);

  const activeColor = color || theme.primary || Colors.light.primary;

  // Create an array of bars and render them
  return (
    <View style={styles.container}>
      {Array.from({ length: barCount }).map((_, index) => {
        return (
          <WaveBar
            key={index}
            index={index}
            totalBars={barCount}
            waveTime={waveTime}
            volume={volume}
            isAnimating={isAnimating}
            color={activeColor}
            maxBarHeight={maxBarHeight}
          />
        );
      })}
    </View>
  );
}

interface WaveBarProps {
  index: number;
  totalBars: number;
  waveTime: Animated.SharedValue<number>;
  volume: number;
  isAnimating: boolean;
  color: string;
  maxBarHeight: number;
}

function WaveBar({
  index,
  totalBars,
  waveTime,
  volume,
  isAnimating,
  color,
  maxBarHeight,
}: WaveBarProps) {
  const minBarHeight = 4;
  const barWidth = 4;
  const barGap = 3;

  const animatedStyle = useAnimatedStyle(() => {
    if (!isAnimating) {
      return {
        height: withTiming(minBarHeight),
      };
    }

    // Phase offset so bars peak sequentially, creating a wave traversal effect
    const phase = (index / totalBars) * Math.PI * 2;
    // Base wave motion between 0.1 and 0.6
    let amplitude = 0.25 + Math.sin(waveTime.value * 2 + phase) * 0.25;

    // Scale up the wave based on microphone/audio volume input
    if (volume > 0) {
      amplitude += volume * 0.5;
    }

    // Cap the wave factor to maximum limits
    const waveFactor = Math.min(Math.max(amplitude, 0.1), 1.0);
    const targetHeight = minBarHeight + (maxBarHeight - minBarHeight) * waveFactor;

    return {
      height: targetHeight,
    };
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        animatedStyle,
        {
          width: barWidth,
          marginHorizontal: barGap / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  bar: {
    borderRadius: 2,
  },
});
