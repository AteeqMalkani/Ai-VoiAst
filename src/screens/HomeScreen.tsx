import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VoiceOrb, Waveform, TranscriptCard, ThinkingCard, ExecutionPlan, ExecutionStep } from '@/components/voice';
import { useVoiceStore, voiceStore, useAutomationStore, automationStore } from '@/store';
import { Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  
  // Connect to state stores
  const { state: orbState, transcript, isFinal, volume, thinkingSteps, currentThinkingStepIndex, thoughtTimeSeconds, assistantResponse } = useVoiceStore();
  const { activeExecutionPlan } = useAutomationStore();
  
  // Simulated sound timer
  const volumeInterval = useRef<NodeJS.Timeout | null>(null);
  const flowTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (volumeInterval.current) clearInterval(volumeInterval.current);
      if (flowTimeout.current) clearTimeout(flowTimeout.current);
    };
  }, []);

  // Helper to start fake microphone volume oscillation
  const startVolumeOscillation = () => {
    if (volumeInterval.current) clearInterval(volumeInterval.current);
    volumeInterval.current = setInterval(() => {
      voiceStore.setVolume(0.1 + Math.random() * 0.7);
    }, 120);
  };

  const stopVolumeOscillation = () => {
    if (volumeInterval.current) {
      clearInterval(volumeInterval.current);
      volumeInterval.current = null;
    }
    voiceStore.setVolume(0);
  };

  // Run the full simulation walkthrough
  const startAssistantSimulation = () => {
    voiceStore.reset();
    automationStore.clearExecutionPlan();
    if (flowTimeout.current) clearTimeout(flowTimeout.current);

    // 1. Enter listening state
    voiceStore.setOrbState('listening');
    startVolumeOscillation();
    
    // Simulate speech-to-text word by word
    const words = ['activate', 'focus', 'mode'];
    words.forEach((word, idx) => {
      const accumulativeText = words.slice(0, idx + 1).join(' ');
      flowTimeout.current = setTimeout(() => {
        voiceStore.setTranscript(accumulativeText, idx === words.length - 1);
        
        // When transcription is finished, transition to thinking
        if (idx === words.length - 1) {
          stopVolumeOscillation();
          startThinkingSimulation();
        }
      }, (idx + 1) * 900);
    });
  };

  // Thinking state simulation
  const startThinkingSimulation = () => {
    voiceStore.setThinkingState(
      ['Parsing voice commands', 'Authenticating DND privileges', 'Locating local workspace apps', 'Configuring Slack integration'],
      0,
      0.1
    );

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < 4) {
        voiceStore.setThinkingState(
          voiceStore.getState().thinkingSteps,
          step,
          step * 0.8
        );
      } else {
        clearInterval(interval);
        startPlanPreparation();
      }
    }, 1200);
  };

  // Preparation of execution plan
  const startPlanPreparation = () => {
    voiceStore.setOrbState('idle');
    
    const steps: ExecutionStep[] = [
      { id: 'hstep-1', action: 'Toggle System DND', description: 'Enable system-wide Do Not Disturb', status: 'pending' },
      { id: 'hstep-2', action: 'Launch VS Code', description: 'Open local React Native workspace', status: 'pending' },
      { id: 'hstep-3', action: 'Status Update', description: 'Set Slack status to "In code workflow"', status: 'pending' },
    ];
    
    automationStore.setExecutionPlan('Focus Mode Sequence', steps);
  };

  // User confirms the action plan
  const executePlan = () => {
    if (!activeExecutionPlan) return;
    
    automationStore.startExecutingPlan();
    voiceStore.setOrbState('thinking');
    
    let stepIndex = 0;
    const runNextStep = () => {
      if (stepIndex < activeExecutionPlan.steps.length) {
        const step = activeExecutionPlan.steps[stepIndex];
        automationStore.updateStepStatus(step.id, 'running');
        
        flowTimeout.current = setTimeout(() => {
          automationStore.updateStepStatus(step.id, 'success');
          stepIndex++;
          runNextStep();
        }, 1500);
      } else {
        // Complete plan and speak response
        automationStore.completeExecutionPlan(true);
        startSpeakingSimulation();
      }
    };
    
    runNextStep();
  };

  // Speaking state simulation
  const startSpeakingSimulation = () => {
    voiceStore.setAssistantResponse(
      'Focus mode sequence executed successfully. System alerts are muted and VS Code is running. Let me know if you need anything else.'
    );
    startVolumeOscillation();
    
    // Speak for 5 seconds and then return to idle
    flowTimeout.current = setTimeout(() => {
      stopVolumeOscillation();
      voiceStore.reset();
      automationStore.clearExecutionPlan();
    }, 5500);
  };

  const handleOrbPress = () => {
    if (orbState === 'idle') {
      startAssistantSimulation();
    } else {
      // Cancel/Reset
      stopVolumeOscillation();
      voiceStore.reset();
      automationStore.clearExecutionPlan();
      if (flowTimeout.current) clearTimeout(flowTimeout.current);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.greetingText}>VoicePilot</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Agentic Assistant Cockpit
              </ThemedText>
            </View>
            <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />
          </View>

          {/* Assistant Action Center */}
          <View style={styles.centerSection}>
            <TouchableOpacity 
              activeOpacity={0.85} 
              onPress={handleOrbPress}
              style={styles.orbButton}
            >
              <VoiceOrb state={orbState} volume={volume} size={150} />
            </TouchableOpacity>

            <Waveform isAnimating={orbState === 'listening' || orbState === 'speaking'} volume={volume} />

            {orbState === 'idle' && !activeExecutionPlan && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.hintText}>
                Tap the center orb to simulate "activate focus mode" command
              </ThemedText>
            )}
          </View>

          {/* Cards & Status Overlays */}
          <View style={styles.statusSection}>
            {/* Live speech transcription */}
            {transcript !== '' && (
              <TranscriptCard text={transcript} isFinal={isFinal} timestamp="Just now" />
            )}

            {/* AI agent thinking logs */}
            {orbState === 'thinking' && !activeExecutionPlan && (
              <ThinkingCard 
                steps={thinkingSteps} 
                currentStepIndex={currentThinkingStepIndex}
                thoughtTimeSeconds={thoughtTimeSeconds}
              />
            )}

            {/* AI Proposed action execution plans */}
            {activeExecutionPlan && (
              <ExecutionPlan
                title={activeExecutionPlan.title}
                steps={activeExecutionPlan.steps}
                onConfirm={executePlan}
                onCancel={() => {
                  automationStore.cancelExecutionPlan();
                  voiceStore.reset();
                }}
                isExecuting={activeExecutionPlan.isExecuting}
                hasRun={activeExecutionPlan.hasRun}
              />
            )}

            {/* Text display of spoken agent speech output */}
            {orbState === 'speaking' && assistantResponse !== '' && (
              <ThemedView type="backgroundElement" style={styles.speakingCard}>
                <View style={styles.speakingHeader}>
                  <View style={[styles.speakerDot, { backgroundColor: theme.success }]} />
                  <ThemedText type="smallBold" themeColor="success">VoicePilot Response</ThemedText>
                </View>
                <ThemedText style={styles.speakingText}>
                  "{assistantResponse}"
                </ThemedText>
              </ThemedView>
            )}
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
    gap: Spacing.five,
    alignItems: 'center',
    paddingBottom: Spacing.six,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    width: '100%',
    maxWidth: 500,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.three,
    gap: Spacing.two,
    width: '100%',
  },
  orbButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    textAlign: 'center',
    marginTop: Spacing.two,
    opacity: 0.7,
  },
  statusSection: {
    width: '100%',
    maxWidth: 500,
    gap: Spacing.four,
  },
  speakingCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)', // Soft green border
  },
  speakingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  speakerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  speakingText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
});
