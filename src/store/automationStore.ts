import { useState, useEffect } from 'react';
import { ExecutionStep } from '@/components/voice';

export interface Automation {
  id: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun?: string;
  category: 'productivity' | 'home' | 'media';
}

export interface VoiceInteraction {
  id: string;
  timestamp: string;
  transcript: string;
  response: string;
  status: 'success' | 'failed' | 'canceled';
  plan?: {
    title: string;
    steps: ExecutionStep[];
  };
}

interface AutomationState {
  automations: Automation[];
  activeExecutionPlan: {
    title: string;
    steps: ExecutionStep[];
    isExecuting: boolean;
    hasRun: boolean;
  } | null;
  history: VoiceInteraction[];
}

const listeners = new Set<(state: AutomationState) => void>();

// Premium mock data
const initialAutomations: Automation[] = [
  {
    id: 'auto-1',
    title: 'Focus Mode Activation',
    description: 'Enables Do Not Disturb, launches code editor, and sets slack status to active coding.',
    trigger: 'activate focus mode',
    action: 'DND: On | App: VS Code | Slack: "Coding..."',
    isActive: true,
    lastRun: 'Yesterday at 9:00 AM',
    category: 'productivity',
  },
  {
    id: 'auto-2',
    title: 'Smart Office Startup',
    description: 'Powers desk light, starts monitor displays, and turns on desk fan.',
    trigger: 'turn on my desk',
    action: 'IoT Switch: Power On | Desk Fan: On',
    isActive: true,
    lastRun: 'Today at 8:45 AM',
    category: 'home',
  },
  {
    id: 'auto-3',
    title: 'Morning Briefing',
    description: 'Reads calendar appointments, checks local weather, and summarizes mail notifications.',
    trigger: 'start morning routine',
    action: 'Calendar API: Fetch | Weather API: Get temp | Speech synthesis',
    isActive: false,
    category: 'productivity',
  },
  {
    id: 'auto-4',
    title: 'Chill Music Session',
    description: 'Sets ambient room lights to blue color and starts lofi playlist on smart speaker.',
    trigger: 'time to chill',
    action: 'Philips Hue: Blue | Spotify API: Play Lofi Beats',
    isActive: true,
    lastRun: '2 days ago',
    category: 'media',
  },
];

const initialHistory: VoiceInteraction[] = [
  {
    id: 'hist-1',
    timestamp: 'Today at 10:15 AM',
    transcript: 'activate focus mode',
    response: 'Focus mode is now fully configured. Slack is updated and VS Code is open.',
    status: 'success',
    plan: {
      title: 'Focus Mode Sequence',
      steps: [
        { id: 'step-1', action: 'Set System DND', description: 'Enable system-wide Do Not Disturb', status: 'success' },
        { id: 'step-2', action: 'Open Workspace App', description: 'Launch VS Code editor', status: 'success' },
        { id: 'step-3', action: 'Update Slack', description: 'Set status to "In a flow state"', status: 'success' },
      ],
    },
  },
  {
    id: 'hist-2',
    timestamp: 'Today at 8:45 AM',
    transcript: 'turn on my desk',
    response: 'Smart Desk initiated. Lights and fan are running.',
    status: 'success',
  },
];

let state: AutomationState = {
  automations: initialAutomations,
  activeExecutionPlan: null,
  history: initialHistory,
};

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

export const automationStore = {
  getState() {
    return state;
  },

  addAutomation(automation: Omit<Automation, 'id'>) {
    const newAuto: Automation = {
      ...automation,
      id: `auto-${Date.now()}`,
    };
    state = {
      ...state,
      automations: [newAuto, ...state.automations],
    };
    notify();
  },

  toggleAutomation(id: string) {
    state = {
      ...state,
      automations: state.automations.map((auto) =>
        auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
      ),
    };
    notify();
  },

  deleteAutomation(id: string) {
    state = {
      ...state,
      automations: state.automations.filter((auto) => auto.id !== id),
    };
    notify();
  },

  setExecutionPlan(title: string, steps: ExecutionStep[]) {
    state = {
      ...state,
      activeExecutionPlan: {
        title,
        steps,
        isExecuting: false,
        hasRun: false,
      },
    };
    notify();
  },

  startExecutingPlan() {
    if (!state.activeExecutionPlan) return;
    
    state = {
      ...state,
      activeExecutionPlan: {
        ...state.activeExecutionPlan,
        isExecuting: true,
      },
    };
    notify();
  },

  updateStepStatus(stepId: string, status: ExecutionStep['status']) {
    if (!state.activeExecutionPlan) return;

    state = {
      ...state,
      activeExecutionPlan: {
        ...state.activeExecutionPlan,
        steps: state.activeExecutionPlan.steps.map((step) =>
          step.id === stepId ? { ...step, status } : step
        ),
      },
    };
    notify();
  },

  completeExecutionPlan(success: boolean) {
    if (!state.activeExecutionPlan) return;

    const plan = state.activeExecutionPlan;
    
    // Add to history log
    const newHist: VoiceInteraction = {
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
      transcript: 'voice pilot custom sequence',
      response: success ? 'Automation workflow completed successfully.' : 'Some parts of the automation failed.',
      status: success ? 'success' : 'failed',
      plan: {
        title: plan.title,
        steps: plan.steps,
      },
    };

    state = {
      ...state,
      activeExecutionPlan: {
        ...plan,
        isExecuting: false,
        hasRun: true,
      },
      history: [newHist, ...state.history],
    };
    notify();
  },

  cancelExecutionPlan() {
    if (!state.activeExecutionPlan) return;

    const plan = state.activeExecutionPlan;
    const newHist: VoiceInteraction = {
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
      transcript: 'voice pilot sequence',
      response: 'Execution plan was canceled by user.',
      status: 'canceled',
    };

    state = {
      ...state,
      activeExecutionPlan: null,
      history: [newHist, ...state.history],
    };
    notify();
  },

  clearExecutionPlan() {
    state = {
      ...state,
      activeExecutionPlan: null,
    };
    notify();
  },

  addHistory(transcript: string, response: string, status: VoiceInteraction['status']) {
    const newHist: VoiceInteraction = {
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
      transcript,
      response,
      status,
    };
    state = {
      ...state,
      history: [newHist, ...state.history],
    };
    notify();
  },

  subscribe(listener: (state: AutomationState) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useAutomationStore() {
  const [currentState, setCurrentState] = useState(automationStore.getState());

  useEffect(() => {
    return automationStore.subscribe(setCurrentState);
  }, []);

  return currentState;
}
