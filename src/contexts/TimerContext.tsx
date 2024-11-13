import React, { createContext, useContext, useState, useEffect } from 'react';
import { useExtension } from '../hooks/useExtension';

interface TimerPreset {
  id: string;
  name: string;
  work: number;
  break: number;
}

interface TimerState {
  workdayActive: boolean;
  focusActive: boolean;
  workdayTimeLeft: number;
  focusTimeLeft: number;
  breakTimeLeft: number;
  isBreakActive: boolean;
  selectedPreset: TimerPreset;
  presets: TimerPreset[];
  customPresets: TimerPreset[];
  cycleCount: number;
  maxCycles: number;
}

interface TimerContextType extends TimerState {
  startWorkday: () => Promise<void>;
  stopWorkday: () => Promise<void>;
  startFocus: () => Promise<void>;
  stopFocus: () => Promise<void>;
  setSelectedPreset: (preset: TimerPreset) => void;
  addCustomPreset: (preset: TimerPreset) => void;
}

const WORKDAY_DURATION = 8 * 60 * 60; // 8 hours in seconds
const MAX_WORKDAY_MINUTES = 720; // 12 hours in minutes

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: 'default', name: 'Default', work: 40, break: 20 },
  { id: 'pomodoro', name: 'Pomodoro', work: 25, break: 5 },
  { id: 'long', name: 'Long Focus', work: 60, break: 15 },
];

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { startTimer, stopTimer } = useExtension();

  const calculateMaxCycles = (preset: TimerPreset) => {
    const cycleDuration = preset.work + preset.break;
    return Math.floor(MAX_WORKDAY_MINUTES / cycleDuration);
  };

  const [state, setState] = useState<TimerState>(() => {
    const savedState = localStorage.getItem('timerState');
    const savedCustomPresets = localStorage.getItem('customPresets');
    const initialPreset = DEFAULT_PRESETS[0];
    
    const parsedState = savedState ? JSON.parse(savedState) : null;
    
    return {
      workdayActive: false,
      focusActive: false,
      workdayTimeLeft: WORKDAY_DURATION,
      focusTimeLeft: initialPreset.work * 60,
      breakTimeLeft: initialPreset.break * 60,
      isBreakActive: false,
      selectedPreset: initialPreset,
      presets: DEFAULT_PRESETS,
      customPresets: savedCustomPresets ? JSON.parse(savedCustomPresets) : [],
      cycleCount: parsedState?.cycleCount || 0,
      maxCycles: calculateMaxCycles(initialPreset)
    };
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({
      ...state,
      cycleCount: state.cycleCount
    }));
  }, [state]);

  // Timer update intervals
  useEffect(() => {
    let interval: number;

    if (state.workdayActive || state.focusActive) {
      interval = window.setInterval(() => {
        setState(prev => {
          if (state.workdayActive && prev.workdayTimeLeft > 0) {
            return { ...prev, workdayTimeLeft: prev.workdayTimeLeft - 1 };
          }
          if (state.focusActive) {
            if (prev.isBreakActive && prev.breakTimeLeft > 0) {
              return { ...prev, breakTimeLeft: prev.breakTimeLeft - 1 };
            }
            if (!prev.isBreakActive && prev.focusTimeLeft > 0) {
              return { ...prev, focusTimeLeft: prev.focusTimeLeft - 1 };
            }
            // Complete cycle and increment counter when break ends
            if (prev.breakTimeLeft === 0 && prev.isBreakActive) {
              return {
                ...prev,
                isBreakActive: false,
                focusTimeLeft: prev.selectedPreset.work * 60,
                cycleCount: Math.min(prev.cycleCount + 1, prev.maxCycles)
              };
            }
            // Switch to break mode when work time ends
            if (prev.focusTimeLeft === 0 && !prev.isBreakActive) {
              return {
                ...prev,
                isBreakActive: true,
                breakTimeLeft: prev.selectedPreset.break * 60
              };
            }
          }
          return prev;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.workdayActive, state.focusActive, state.isBreakActive]);

  // Reset cycle count at midnight
  useEffect(() => {
    const checkDate = () => {
      const lastDate = localStorage.getItem('lastActiveDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        setState(prev => ({ ...prev, cycleCount: 0 }));
        localStorage.setItem('lastActiveDate', today);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const startWorkday = async () => {
    const timerId = await startTimer('work', WORKDAY_DURATION / 60, 'workday');
    setState(prev => ({
      ...prev,
      workdayActive: true,
      workdayTimeLeft: prev.workdayTimeLeft || WORKDAY_DURATION
    }));
  };

  const stopWorkday = async () => {
    await stopTimer('workday');
    setState(prev => ({ ...prev, workdayActive: false }));
  };

  const startFocus = async () => {
    const timerId = await startTimer(
      state.isBreakActive ? 'break' : 'work',
      state.isBreakActive ? state.selectedPreset.break : state.selectedPreset.work,
      state.selectedPreset.id
    );
    setState(prev => ({ ...prev, focusActive: true }));
  };

  const stopFocus = async () => {
    await stopTimer(state.selectedPreset.id);
    setState(prev => ({ ...prev, focusActive: false }));
  };

  const setSelectedPreset = (preset: TimerPreset) => {
    setState(prev => ({
      ...prev,
      selectedPreset: preset,
      focusTimeLeft: preset.work * 60,
      breakTimeLeft: preset.break * 60,
      maxCycles: calculateMaxCycles(preset),
      cycleCount: 0 // Reset cycle count when changing preset
    }));
  };

  const addCustomPreset = (preset: TimerPreset) => {
    setState(prev => ({
      ...prev,
      customPresets: [...prev.customPresets, preset]
    }));
    localStorage.setItem('customPresets', JSON.stringify([...state.customPresets, preset]));
  };

  return (
    <TimerContext.Provider value={{
      ...state,
      startWorkday,
      stopWorkday,
      startFocus,
      stopFocus,
      setSelectedPreset,
      addCustomPreset
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};