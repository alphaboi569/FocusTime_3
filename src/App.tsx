import React, { useState } from 'react';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import BlockedSites from './components/BlockedSites';
import Analytics from './components/Analytics';
import SubscriptionPlan from './components/SubscriptionPlan';
import Profile from './components/Profile';
import { LanguageProvider } from './contexts/LanguageContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { TimerProvider } from './contexts/TimerContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AuthProvider>
      <LanguageProvider>
        <ActivityProvider>
          <ThemeProvider>
            <NotificationProvider>
              <TimerProvider>
                <div className="w-[400px] h-[600px] bg-white dark:bg-gray-900 flex flex-col">
                  <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
                  <main className="flex-1 overflow-y-auto">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'blocked' && <BlockedSites />}
                    {activeTab === 'stats' && <Analytics />}
                    {activeTab === 'plan' && <SubscriptionPlan />}
                    {activeTab === 'profile' && <Profile />}
                  </main>
                </div>
              </TimerProvider>
            </NotificationProvider>
          </ThemeProvider>
        </ActivityProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;