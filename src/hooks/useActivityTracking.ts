import { useEffect, useCallback } from 'react';
import { db } from '../database';

export function useActivityTracking() {
  // Start timer session
  const startTimer = useCallback((type: 'work' | 'break', durationMinutes: number, presetId: string) => {
    return db.startTimerSession(type, durationMinutes, presetId);
  }, []);

  // Complete timer session
  const completeTimer = useCallback((sessionId: number) => {
    return db.completeTimerSession(sessionId);
  }, []);

  // Record completed cycle
  const recordCycle = useCallback((workSessionId: number, breakSessionId: number) => {
    return db.recordCompletedCycle(workSessionId, breakSessionId);
  }, []);

  // Track site visit
  const trackSiteVisit = useCallback((siteUrl: string) => {
    const visitId = db.startSiteVisit(siteUrl);
    
    // Return function to end visit tracking
    return () => {
      db.endSiteVisit(visitId);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      db.cleanup();
    };
  }, []);

  return {
    startTimer,
    completeTimer,
    recordCycle,
    trackSiteVisit
  };
}