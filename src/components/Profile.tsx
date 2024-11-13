import React, { useState } from 'react';
import { 
  User, Bell, Moon, CreditCard, Languages,
  HelpCircle, Smartphone, Trophy, LogOut,
  Camera, Mail, Edit2, Crown, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Profile = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, updateProfile } = useAuth();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const devices = [
    { id: 1, name: 'Chrome - MacBook Pro', lastActive: 'Now' },
    { id: 2, name: 'Safari - iPhone 13', lastActive: '2 hours ago' }
  ];

  const achievements = [
    { id: 1, name: 'Focus Master', description: '10 completed focus sessions', completed: true },
    { id: 2, name: 'Digital Balance', description: 'Maintained daily limits for a week', completed: true },
    { id: 3, name: 'Productivity Guru', description: 'Achieved 90% productivity score', completed: false },
  ];

  const handleProfileUpdate = async () => {
    await updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-3xl font-semibold">
                  {user?.name?.[0] || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Your name"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Your email"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                <p className="text-white/80">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2 py-1 bg-white/10 rounded-lg text-sm backdrop-blur-sm">
                    Pro Plan
                  </div>
                  <div className="px-2 py-1 bg-white/10 rounded-lg text-sm backdrop-blur-sm">
                    {language.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Edit2 size={20} />
          </button>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-900 dark:text-white">{t('notifications')}</span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-900 dark:text-white">{t('darkMode')}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          {t('achievements')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border ${
                achievement.completed 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-medium ${
                    achievement.completed 
                      ? 'text-green-900 dark:text-green-400' 
                      : 'text-gray-900 dark:text-gray-300'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.completed && (
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Smartphone className="text-indigo-600 dark:text-indigo-400" />
          {t('devices')}
        </h3>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {device.lastActive}
                  </p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                <LogOut size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle size={24} />
            <div>
              <h3 className="text-lg font-semibold">{t('support')}</h3>
              <p className="text-white/80">{t('needHelp')}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
            {t('contactSupport')}
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full p-4 flex items-center justify-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <LogOut size={20} />
        <span className="font-medium">{t('logout')}</span>
      </button>
    </div>
  );
};

export default Profile;