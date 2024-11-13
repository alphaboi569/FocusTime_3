import React from 'react';
import { Home, Lock, BarChart, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: t('focusTime') },
  ];

  const otherItems = [
    { id: 'blocked', icon: Lock, label: t('blockedSites') },
    { id: 'stats', icon: BarChart, label: t('statistics') },
    { id: 'profile', icon: User, label: t('profile') }
  ];

  return (
    <nav className="h-16 bg-indigo-600 dark:bg-indigo-800 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-lime-400 text-indigo-900'
                    : 'text-white hover:bg-indigo-500 dark:hover:bg-indigo-700'
                }`}
                title={item.label}
              >
                <Icon size={24} />
              </button>
            );
          })}
        </div>
        <div className="w-px h-6 bg-indigo-400" />
        <div className="flex space-x-2">
          {otherItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-lime-400 text-indigo-900'
                    : 'text-white hover:bg-indigo-500 dark:hover:bg-indigo-700'
                }`}
                title={item.label}
              >
                <Icon size={24} />
              </button>
            );
          })}
        </div>
      </div>
      <LanguageSwitch />
    </nav>
  );
};

export default TopNav;