import React from 'react';
import { Timer, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimer } from '../contexts/TimerContext';
import TimeDistribution from './analytics/TimeDistribution';
import WeeklyChart from './analytics/WeeklyChart';

const Analytics = () => {
  const { t } = useLanguage();
  const { 
    selectedPreset,
    cycleCount,
    maxCycles,
    workdayTimeLeft
  } = useTimer();

  const calculateEffectiveWorkTime = () => {
    return cycleCount * selectedPreset.work; // in minutes
  };

  const effectiveWorkTime = calculateEffectiveWorkTime();
  const totalPossibleWorkTime = maxCycles * selectedPreset.work;
  const effectiveWorkPercentage = (effectiveWorkTime / totalPossibleWorkTime) * 100;

  const weeklyData = [
    { day: t('weekdays')[0], hours: 4.5, blocked: 2.3 },
    { day: t('weekdays')[1], hours: 3.8, blocked: 1.9 },
    { day: t('weekdays')[2], hours: 5.2, blocked: 2.8 },
    { day: t('weekdays')[3], hours: 4.0, blocked: 2.1 },
    { day: t('weekdays')[4], hours: 3.5, blocked: 1.7 },
    { day: t('weekdays')[5], hours: 2.8, blocked: 1.4 },
    { day: t('weekdays')[6], hours: 2.2, blocked: 1.1 },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('analyticsTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('trackWellbeing')}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Completed Cycles Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,white,transparent_70%)]" />
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Timer size={20} />
              </div>
              <div>
                <h3 className="font-medium">{t('completedCycles')}</h3>
                <p className="text-sm text-white/70">
                  {selectedPreset.name} ({selectedPreset.work}m/{selectedPreset.break}m)
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold mb-1">
                  {cycleCount}
                  <span className="text-lg text-white/70 ml-1">/ {maxCycles}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                    {Math.round((cycleCount / maxCycles) * 100)}%
                  </div>
                  <span className="text-white/70">completion rate</span>
                </div>
              </div>
              
              <div className="w-20 h-20">
                <svg viewBox="0 0 36 36" className="transform rotate-[-90deg]">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(cycleCount / maxCycles) * 100} 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Effective Work Time Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 to-lime-800 rounded-xl p-6 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,white,transparent_70%)]" />
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-medium">{t('effectiveWorkTime')}</h3>
                <p className="text-sm text-white/70">{t('todayProgress')}</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold mb-1">
                  {Math.floor(effectiveWorkTime / 60)}h {effectiveWorkTime % 60}m
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                    {Math.round(effectiveWorkPercentage)}%
                  </div>
                  <span className="text-white/70">of daily goal</span>
                </div>
              </div>
              
              <div className="w-20 h-20">
                <svg viewBox="0 0 36 36" className="transform rotate-[-90deg]">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${effectiveWorkPercentage} 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TimeDistribution className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700" />

      <WeeklyChart
        data={weeklyData}
        trend={{ value: '-2.5h', isPositive: false }}
        className="from-indigo-600 to-indigo-800"
      />
    </div>
  );
};

export default Analytics;