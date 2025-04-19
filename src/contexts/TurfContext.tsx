
import React, { createContext, useContext, useState } from 'react';
import { TurfContextType, User } from '@/types/turf';
import { MOCK_CURRENT_USER } from '../constants/turf';
import { MessagesProvider } from './MessagesContext';
import { NotificationsProvider } from './NotificationsContext';
import { TopicsProvider } from './TopicsContext';
import { useMessages } from './MessagesContext';
import { useNotifications } from './NotificationsContext';
import { useTopics } from './TopicsContext';

const TurfContext = createContext<TurfContextType | null>(null);

export const TurfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <NotificationsProvider>
      <TopicsProvider>
        <TurfContext.Provider value={{
          currentUser,
          darkMode,
          toggleDarkMode
        } as TurfContextType}>
          <MessagesProvider 
            currentUser={currentUser}
            onNotification={(notification) => {
              const notificationsContext = useNotifications();
              notificationsContext.addNotification(notification);
              
              if (notification.type === 'mention' && notification.userId === currentUser.id) {
                setCurrentUser(prev => ({
                  ...prev,
                  harmonyPoints: prev.harmonyPoints + 1
                }));
              }
              
              if (notification.type === 'award' && notification.userId === currentUser.id) {
                setCurrentUser(prev => ({
                  ...prev,
                  brainAwardsReceived: prev.brainAwardsReceived + 1
                }));
              }
            }}
          >
            <TurfConsumer>
              {children}
            </TurfConsumer>
          </MessagesProvider>
        </TurfContext.Provider>
      </TopicsProvider>
    </NotificationsProvider>
  );
};

// TurfConsumer combines all context values
const TurfConsumer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const messagesContext = useMessages();
  const notificationsContext = useNotifications();
  const topicsContext = useTopics();
  const turfContext = useTurf();

  const combinedContext: TurfContextType = {
    ...turfContext,
    ...messagesContext,
    ...notificationsContext,
    ...topicsContext
  };

  return (
    <TurfContext.Provider value={combinedContext}>
      {children}
    </TurfContext.Provider>
  );
};

export const useTurf = () => {
  const context = useContext(TurfContext);
  if (!context) {
    throw new Error("useTurf must be used within a TurfProvider");
  }
  return context;
};
