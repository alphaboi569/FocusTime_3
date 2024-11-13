import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

interface Translations {
  [key: string]: {
    en: string | string[];
    ru: string | string[];
  };
}

const translations: Translations = {
  // General
  welcome: { en: 'Welcome', ru: 'Добро пожаловать' },
  manageWellbeing: { en: 'Manage your digital wellbeing', ru: 'Управляйте цифровым благополучием' },
  focusTime: { en: 'Focus Time', ru: 'Время фокусировки' },
  statistics: { en: 'Statistics', ru: 'Статистика' },
  
  // Focus Mode
  focusMode: { en: 'Focus Mode', ru: 'Режим фокусировки' },
  focusTimer: { en: 'Focus Timer', ru: 'Таймер фокусировки' },
  workTime: { en: 'Work Time', ru: 'Рабочее время' },
  breakTime: { en: 'Break Time', ru: 'Перерыв' },
  start: { en: 'Start', ru: 'Начать' },
  stop: { en: 'Stop', ru: 'Остановить' },
  remainingTime: { en: 'Remaining Time', ru: 'Оставшееся время' },
  
  // Workday Mode
  workdayMode: { en: 'Workday Mode', ru: 'Режим рабочего дня' },
  workdayDescription: { 
    en: 'Blocks all restricted sites for 8 hours', 
    ru: 'Блокирует все ограниченные сайты на 8 часов' 
  },
  
  // Timer Presets
  timerPresets: { en: 'Timer Presets', ru: 'Пресеты таймера' },
  addCustom: { en: 'Add Custom', ru: 'Добавить свой' },
  presetName: { en: 'Preset Name', ru: 'Название пресета' },
  workMinutes: { en: 'Work Minutes', ru: 'Минуты работы' },
  breakMinutes: { en: 'Break Minutes', ru: 'Минуты перерыва' },
  addPreset: { en: 'Add Preset', ru: 'Добавить пресет' },

  // Blocked Sites
  blockedSites: { en: 'Blocked Sites', ru: 'Заблокированные сайты' },
  manageRestrictions: { en: 'Manage your site restrictions', ru: 'Управление ограничениями сайтов' },
  blockingStatus: { en: 'Blocking Status', ru: 'Статус блокировки' },
  activeBlocks: { en: 'Active Blocks', ru: 'Активные блокировки' },
  timeSaved: { en: 'Time Saved', ru: 'Сэкономлено времени' },
  enterWebsite: { en: 'Enter website URL', ru: 'Введите URL сайта' },
  minutesPerDay: { en: 'Minutes per day', ru: 'Минут в день' },
  add: { en: 'Add', ru: 'Добавить' },
  minutesUsed: { en: 'minutes used', ru: 'минут использовано' },

  // Analytics
  analyticsTitle: { en: 'Analytics', ru: 'Аналитика' },
  trackWellbeing: { en: 'Track your digital wellbeing', ru: 'Отслеживайте цифровое благополучие' },
  completedCycles: { en: 'Completed Cycles', ru: 'Завершённые циклы' },
  effectiveWorkTime: { en: 'Effective Work Time', ru: 'Эффективное рабочее время' },
  restrictedSites: { en: 'Restricted Sites', ru: 'Сайты с ограничениями' },
  timeSpent: { en: 'Time Spent', ru: 'Потраченное время' },
  weeklyDynamics: { en: 'Weekly Dynamics', ru: 'Недельная динамика' },
  hoursSpent: { en: 'Hours Spent', ru: 'Затраченные часы' },
  ofDailyLimit: { en: 'of daily limit', ru: 'от дневного лимита' },
  timeSpentOnSites: { en: 'Time Spent on Restricted Sites', ru: 'Время на ограниченных сайтах' },
  vsLastWeek: { en: 'vs last week', ru: 'по сравнению с прошлой неделей' },
  dailyProgress: { en: 'Daily Progress', ru: 'Дневной прогресс' },
  totalTime: { en: 'Total Time', ru: 'Общее время' },
  blockedTime: { en: 'Blocked Time', ru: 'Заблокированное время' },
  weekdays: {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string | string[] => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};