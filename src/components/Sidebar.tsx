import React from 'react';
import { Home, Focus, Lock, Activity, Church } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'focus', icon: Focus, label: 'Focus Mode' },
    { id: 'blocked', icon: Lock, label: 'Blocked Sites' },
    { id: 'prayer', icon: Church, label: 'Prayer Times' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
  ];

  return (
    <aside className="w-20 bg-indigo-600 flex flex-col items-center pt-4">
      <div className="flex flex-col items-center space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-lime-400 text-indigo-900'
                  : 'text-white hover:bg-indigo-500'
              }`}
              title={item.label}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;