import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export type ColorSchemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  colorScheme: ColorSchemeType;
}

const listeners = new Set<(state: ThemeState) => void>();

let state: ThemeState = {
  colorScheme: 'system',
};

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

export const themeStore = {
  getState() {
    return state;
  },
  
  setColorScheme(colorScheme: ColorSchemeType) {
    state = { ...state, colorScheme };
    notify();
  },

  toggleColorScheme() {
    const current = state.colorScheme;
    let next: ColorSchemeType = 'light';
    if (current === 'light') next = 'dark';
    else if (current === 'dark') next = 'system';
    
    state = { ...state, colorScheme: next };
    notify();
  },

  subscribe(listener: (state: ThemeState) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useThemeStore() {
  const [currentState, setCurrentState] = useState(themeStore.getState());

  useEffect(() => {
    return themeStore.subscribe(setCurrentState);
  }, []);

  return currentState;
}
