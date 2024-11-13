import React, { useState } from 'react';
import { Timer, Clock, Plus, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useActivity } from '../contexts/ActivityContext';
import { useTimer } from '../contexts/TimerContext';
import CircularProgress from './common/CircularProgress';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { dailyProgress } = useActivity();
  const {
    workdayActive,
    focusActive,
    workdayTimeLeft,
    focusTimeLeft,
    breakTimeLeft,
    isBreakActive,
    selectedPreset,
    presets,
    customPresets,
    cycleCount,
    maxCycles,
    startWorkday,
    stopWorkday,
    startFocus,
    stopFocus,
    setSelectedPreset,
    addCustomPreset
  } = useTimer();

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    work: '',
    break: ''
  });

  const handleCustomSubmit = () => {
    if (customForm.name && customForm.work && customForm.break) {
      addCustomPreset({
        id: customForm.name.toLowerCase().replace(/\s+/g, '-'),
        name: customForm.name,
        work: parseInt(customForm.work),
        break: parseInt(customForm.break)
      });
      setCustomForm({ name: '', work: '', break: '' });
      setShowCustomForm(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 
      ? `${hours}h ${minutes}m ${secs}s`
      : `${minutes}m ${secs}s`;
  };

  const workdayProgress = ((8 * 3600 - workdayTimeLeft) / (8 * 3600)) * 100;
  const focusProgress = isBreakActive
    ? ((selectedPreset.break * 60 - breakTimeLeft) / (selectedPreset.break * 60)) * 100
    : ((selectedPreset.work * 60 - focusTimeLeft) / (selectedPreset.work * 60)) * 100;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('focusTime')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('manageWellbeing')}</p>
      </header>

      {/* Workday Mode */}
      <div className="bg-gradient-to-r from-lime-600 to-lime-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(132,204,22,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Home size={24} />
            <div>
              <h2 className="text-xl font-semibold">{t('workdayMode')}</h2>
              <p className="text-sm text-white/80">{t('workdayDescription')}</p>
            </div>
          </div>
          <button
            onClick={workdayActive ? stopWorkday : startWorkday}
            className={`px-4 py-2 rounded-lg transition-colors ${
              workdayActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {workdayActive ? t('stop') : t('start')}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <CircularProgress
              progress={workdayProgress}
              size={120}
              strokeWidth={8}
              circleColor="rgba(255,255,255,0.2)"
              progressColor="white"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{formatTime(workdayTimeLeft)}</span>
              <span className="text-sm opacity-80">{t('remaining')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Timer */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Timer size={24} />
            <h2 className="text-xl font-semibold">{t('focusTimer')}</h2>
          </div>
          <button
            onClick={focusActive ? stopFocus : startFocus}
            className={`px-4 py-2 rounded-lg transition-colors ${
              focusActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {focusActive ? t('stop') : t('enable')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Clock size={20} className="mb-2" />
            <p className="font-medium">{isBreakActive ? t('breakTime') : t('workTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {formatTime(isBreakActive ? breakTimeLeft : focusTimeLeft)}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Timer size={20} className="mb-2" />
            <p className="font-medium">{t('nextPhase')}</p>
            <p className="text-2xl font-bold mt-1">
              {isBreakActive ? selectedPreset.work : selectedPreset.break}m
            </p>
          </div>
        </div>
      </div>

      {/* Timer Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('timerPresets')}</h3>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1.5"
          >
            <Plus size={18} />
            <span className="text-sm">{t('addCustom')}</span>
          </button>
        </div>

        {showCustomForm && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder={t('presetName')}
              value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-600 border dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('workMinutes')}
                value={customForm.work}
                onChange={(e) => setCustomForm({ ...customForm, work: e.target.value })}
                className="px-3 py-2 bg-white dark:bg-gray-600 border dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder={t('breakMinutes')}
                value={customForm.break}
                onChange={(e) => setCustomForm({ ...customForm, break: e.target.value })}
                className="px-3 py-2 bg-white dark:bg-gray-600 border dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleCustomSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('addPreset')}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[...presets, ...customPresets].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedPreset.id === preset.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <p className="font-medium text-sm mb-1">{preset.name}</p>
              <p className={`text-xs ${
                selectedPreset.id === preset.id 
                  ? 'text-indigo-200' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {preset.work}m/{preset.break}m
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('dailyProgress')}</h2>
          <div className="text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
            <Timer size={20} />
            <span>{t('completedCycles')}: {cycleCount}/{maxCycles}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">{t('timeSpentOnSites')}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {dailyProgress.totalTimeSpent} / {dailyProgress.dailyLimit}
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${dailyProgress.percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {dailyProgress.sites.map((site) => (
              <div key={site.site} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {site.site}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {site.timeSpent} / {site.dailyLimit}
                </p>
                <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${site.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;