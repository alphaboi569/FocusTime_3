import { useEffect, useCallback } from 'react';
import { useActivity } from '../contexts/ActivityContext';

// Check if we're running as an extension
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

// Mock functions for development environment
const mockTimers = new Map();
let mockTimerId = 1;

const mockExtensionAPI = {
  startTimer: (type: 'work' | 'break', duration: number) => {
    const timerId = String(mockTimerId++);
    mockTimers.set(timerId, { type, duration, active: true });
    return Promise.resolve({ success: true, timerId });
  },
  stopTimer: (timerId: string) => {
    mockTimers.delete(timerId);
    return Promise.resolve({ success: true });
  },
  getTimerStatus: () => {
    const isWorkActive = Array.from(mockTimers.values()).some(t => t.type === 'work' && t.active);
    const isBreakActive = Array.from(mockTimers.values()).some(t => t.type === 'break' && t.active);
    return Promise.resolve({ isWorkActive, isBreakActive });
  }
};

export function useExtension() {
  const { isReady } = useActivity();

  const sendMessage = useCallback((message: any): Promise<any> => {
    if (!isExtension) {
      // Use mock API in development
      switch (message.type) {
        case 'START_TIMER':
          return mockExtensionAPI.startTimer(message.timerType, message.duration);
        case 'STOP_TIMER':
          return mockExtensionAPI.stopTimer(message.timerId);
        case 'GET_TIMER_STATUS':
          return mockExtensionAPI.getTimerStatus();
        default:
          return Promise.reject(new Error('Unknown message type'));
      }
    }

    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        reject(new Error('Extension API not available'));
      }
    });
  }, []);

  const startTimer = useCallback(async (
    timerType: 'work' | 'break',
    duration: number,
    presetId: string
  ) => {
    try {
      const response = await sendMessage({
        type: 'START_TIMER',
        timerType,
        duration,
        presetId
      });
      return response.timerId;
    } catch (error) {
      console.warn('Timer started in development mode');
      return 'dev-timer-' + Date.now();
    }
  }, [sendMessage]);

  const stopTimer = useCallback(async (timerId: string) => {
    try {
      await sendMessage({
        type: 'STOP_TIMER',
        timerId
      });
    } catch (error) {
      console.warn('Timer stopped in development mode');
    }
  }, [sendMessage]);

  const getTimerStatus = useCallback(async () => {
    try {
      const response = await sendMessage({
        type: 'GET_TIMER_STATUS'
      });
      return {
        isWorkActive: response.isWorkActive,
        isBreakActive: response.isBreakActive
      };
    } catch (error) {
      // Return mock status in development
      return {
        isWorkActive: false,
        isBreakActive: false
      };
    }
  }, [sendMessage]);

  // Check connection on mount
  useEffect(() => {
    if (!isReady) return;

    const checkConnection = async () => {
      try {
        await getTimerStatus();
      } catch (error) {
        // Silently fail in development
        if (process.env.NODE_ENV === 'development') {
          console.info('Running in development mode without extension APIs');
        } else {
          console.error('Extension connection error:', error);
        }
      }
    };

    checkConnection();
  }, [isReady, getTimerStatus]);

  return {
    startTimer,
    stopTimer,
    getTimerStatus,
    isExtension
  };
}