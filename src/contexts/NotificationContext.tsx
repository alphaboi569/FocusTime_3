import React, { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('notifications', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  const toggleNotifications = () => {
    setNotificationsEnabled(current => !current);
  };

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};