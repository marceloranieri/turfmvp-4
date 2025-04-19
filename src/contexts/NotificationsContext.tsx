
import React, { createContext, useContext, useState } from 'react';
import { Notification } from '@/types/turf';

interface NotificationsContextType {
  notifications: Notification[];
  unreadNotificationsCount: number;
  addNotification: (notification: Notification) => void;
  markNotificationsAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications,
      unreadNotificationsCount,
      addNotification,
      markNotificationsAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
