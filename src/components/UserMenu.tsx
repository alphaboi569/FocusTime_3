import React from 'react';
import { 
  User, Settings, Bell, Moon, CreditCard, 
  HelpCircle, Smartphone, Trophy, LogOut, 
  Check, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const achievements = [
    { id: 1, name: 'Focus Master', completed: true },
    { id: 2, name: 'Digital Balance', completed: true },
    { id: 3, name: 'Productivity Guru', completed: false },
  ];

  const menuSections = [
    {
      title: t('profile'),
      items: [
        {
          icon: User,
          label: t('editProfile'),
          onClick: () => {},
          info: user?.name
        },
        {
          icon: Bell,
          label: t('notifications'),
          onClick: toggleNotifications,
          toggle: true,
          enabled: notificationsEnabled
        },
        {
          icon: Moon,
          label: t('darkMode'),
          onClick: toggleTheme,
          toggle: true,
          enabled: theme === 'dark'
        }
      ]
    },
    {
      title: t('subscription'),
      items: [
        {
          icon: CreditCard,
          label: t('plan'),
          onClick: () => window.location.hash = '#plan',
          info: user?.subscription === 'pro' ? 'Pro' : 'Free'
        }
      ]
    },
    {
      title: t('system'),
      items: [
        {
          icon: Smartphone,
          label: t('devices'),
          onClick: () => {},
          info: '2 active'
        },
        {
          icon: HelpCircle,
          label: t('support'),
          onClick: () => {}
        }
      ]
    },
    {
      title: t('achievements'),
      items: achievements.map(achievement => ({
        icon: Trophy,
        label: achievement.name,
        completed: achievement.completed
      }))
    }
  ];

  return (
    <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xl font-semibold text-indigo-600">
              {user?.name?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="py-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {menuSections.map((section, index) => (
          <div key={index} className="py-2">
            <div className="px-4 py-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {section.title}
              </h4>
            </div>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  {item.toggle !== undefined ? (
                    <div className={`w-8 h-5 rounded-full transition-colors ${
                      item.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform transform ${
                        item.enabled ? 'translate-x-3' : ''
                      }`} />
                    </div>
                  ) : item.completed !== undefined ? (
                    <div className={`w-5 h-5 rounded-full ${
                      item.completed ? 'bg-green-500' : 'bg-gray-200'
                    } flex items-center justify-center`}>
                      {item.completed ? (
                        <Check size={12} className="text-white" />
                      ) : (
                        <X size={12} className="text-gray-400" />
                      )}
                    </div>
                  ) : item.info ? (
                    <span className="text-sm text-gray-500">{item.info}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full px-4 py-2 flex items-center space-x-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;