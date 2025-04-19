
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TurfContextType, User } from '@/types/turf';
import { MOCK_CURRENT_USER } from '../constants/turf';
import { MessagesProvider } from './MessagesContext';
import { NotificationsProvider } from './NotificationsContext';
import { TopicsProvider } from './TopicsContext';

const TurfContext = createContext<Partial<TurfContextType> | null>(null);

export const TurfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Store base context values here
  const baseContextValue = {
    currentUser,
    darkMode,
    toggleDarkMode,
    // Include update functions for the currentUser
    updateHarmonyPoints: (points: number) => {
      setCurrentUser(prev => ({
        ...prev,
        harmonyPoints: prev.harmonyPoints + points
      }));
    },
    updateBrainAwards: () => {
      setCurrentUser(prev => ({
        ...prev,
        brainAwardsReceived: prev.brainAwardsReceived + 1
      }));
    }
  };

  return (
    <TurfContext.Provider value={baseContextValue}>
      <NotificationsProvider>
        <TopicsProvider>
          <MessagesProvider 
            currentUser={currentUser}
            onNotification={(notification) => {
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
            {children}
          </MessagesProvider>
        </TopicsProvider>
      </NotificationsProvider>
    </TurfContext.Provider>
  );
};

export const useTurf = () => {
  const turfContext = useContext(TurfContext);
  const notificationsContext = useContext(NotificationsProvider.context);
  const topicsContext = useContext(TopicsProvider.context);
  const messagesContext = useContext(MessagesProvider.context);

  if (!turfContext || !notificationsContext || !topicsContext || !messagesContext) {
    throw new Error("useTurf must be used within TurfProvider");
  }

  return {
    ...turfContext,
    ...notificationsContext,
    ...topicsContext,
    ...messagesContext
  };
};
