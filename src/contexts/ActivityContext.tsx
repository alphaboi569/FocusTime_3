import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { getDB } from '../database';

interface SiteStats {
  site: string;
  timeSpent: string;
  dailyLimit: string;
  percentage: number;
  color: string;
  colorClass: string;
}

interface DailyProgress {
  totalTimeSpent: string;
  dailyLimit: string;
  percentage: number;
  sites: SiteStats[];
  completedCycles: number;
  totalCycles: number;
}

interface ActivityContextType {
  startTimer: (type: 'work' | 'break', durationMinutes: number, presetId: string) => Promise<void>;
  completeTimer: (sessionId: number) => Promise<void>;
  recordCycle: (workSessionId: number, breakSessionId: number) => Promise<void>;
  trackSiteVisit: (siteUrl: string) => Promise<() => Promise<void>>;
  dailyProgress: DailyProgress;
  isReady: boolean;
  refreshProgress: () => Promise<void>;
}

const DEFAULT_DAILY_PROGRESS: DailyProgress = {
  totalTimeSpent: '0h 0m',
  dailyLimit: '4h',
  percentage: 0,
  completedCycles: 0,
  totalCycles: 12,
  sites: [
    {
      site: 'youtube.com',
      timeSpent: '0m',
      dailyLimit: '1h',
      percentage: 0,
      color: 'fill-indigo-500',
      colorClass: 'bg-indigo-500'
    },
    {
      site: 'facebook.com',
      timeSpent: '0m',
      dailyLimit: '1h',
      percentage: 0,
      color: 'fill-indigo-400',
      colorClass: 'bg-indigo-400'
    },
    {
      site: 'twitter.com',
      timeSpent: '0m',
      dailyLimit: '1h',
      percentage: 0,
      color: 'fill-indigo-300',
      colorClass: 'bg-indigo-300'
    }
  ]
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDB] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(DEFAULT_DAILY_PROGRESS);

  // Initialize database
  useEffect(() => {
    let mounted = true;

    const initDB = async () => {
      try {
        const database = await getDB();
        if (mounted) {
          setDB(database);
          setIsReady(true);
          refreshProgress(); // Initial progress update
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        if (mounted) {
          setIsReady(true); // Still set ready to allow fallback functionality
        }
      }
    };

    initDB();

    return () => {
      mounted = false;
    };
  }, []);

  const formatTime = (minutes: number): string => {
    if (!minutes || isNaN(minutes)) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const refreshProgress = async () => {
    if (!db || !isReady) return;

    try {
      // Get daily stats with fallback
      const stats = await db.getDailyStats() || { 
        total_time_minutes: 0,
        completed_cycles: 0 
      };

      // Get site visits with error handling for each site
      const siteVisits = await Promise.all(
        dailyProgress.sites.map(async (site) => {
          try {
            const siteStats = await db.getSiteVisitStats(site.site) || {
              duration_minutes: 0
            };
            
            return {
              ...site,
              timeSpent: formatTime(siteStats.duration_minutes || 0),
              percentage: Math.min(100, ((siteStats.duration_minutes || 0) / 60) * 100)
            };
          } catch (error) {
            console.warn(`Failed to get stats for ${site.site}:`, error);
            return site;
          }
        })
      );

      setDailyProgress(prev => ({
        ...prev,
        totalTimeSpent: formatTime(stats.total_time_minutes || 0),
        percentage: Math.min(100, ((stats.total_time_minutes || 0) / 240) * 100),
        completedCycles: stats.completed_cycles || 0,
        sites: siteVisits
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Keep existing progress on error
    }
  };

  // Update progress periodically
  useEffect(() => {
    if (!db || !isReady) return;

    const interval = setInterval(refreshProgress, 60000);
    return () => clearInterval(interval);
  }, [db, isReady]);

  const startTimer = useCallback(async (type: 'work' | 'break', durationMinutes: number, presetId: string) => {
    if (!db) return;
    try {
      await db.startTimerSession(type, durationMinutes, presetId);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }, [db]);

  const completeTimer = useCallback(async (sessionId: number) => {
    if (!db) return;
    try {
      await db.completeTimerSession(sessionId);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to complete timer:', error);
    }
  }, [db]);

  const recordCycle = useCallback(async (workSessionId: number, breakSessionId: number) => {
    if (!db) return;
    try {
      await db.recordCompletedCycle(workSessionId, breakSessionId);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to record cycle:', error);
    }
  }, [db]);

  const trackSiteVisit = useCallback(async (siteUrl: string) => {
    if (!db) return () => Promise.resolve();
    try {
      const visitId = await db.startSiteVisit(siteUrl);
      await refreshProgress();
      return async () => {
        try {
          await db.endSiteVisit(visitId);
          await refreshProgress();
        } catch (error) {
          console.error('Failed to end site visit:', error);
        }
      };
    } catch (error) {
      console.error('Failed to start site visit:', error);
      return () => Promise.resolve();
    }
  }, [db]);

  return (
    <ActivityContext.Provider value={{
      startTimer,
      completeTimer,
      recordCycle,
      trackSiteVisit,
      dailyProgress,
      isReady,
      refreshProgress
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};