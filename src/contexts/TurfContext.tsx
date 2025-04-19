
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TurfContextType, User, HarmonyPointReason, HarmonyPointEvent } from '@/types/turf';
import { MOCK_CURRENT_USER } from '../constants/turf';
import { MessagesProvider } from './MessagesContext';
import { NotificationsProvider } from './NotificationsContext';
import { TopicsProvider } from './TopicsContext';

const TurfContext = createContext<Partial<TurfContextType>>({});

export const TurfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    ...MOCK_CURRENT_USER,
    harmonyPointEvents: [],
    totalHarmonyPoints: 0
  });
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const calculateUserHarmonyPoints = (userId: string) => {
    // Complex point calculation logic
    const userEvents = currentUser.harmonyPointEvents;
    
    const totalPoints = userEvents.reduce((total, event) => {
      switch(event.reason) {
        case 'initial_post': return total + 1;
        case 'quality_contribution': return total + 2;
        case 'audience_reaction': return total + 1;
        case 'audience_engagement': return total + 3;
        case 'brain_award': return total + 5;
        default: return total;
      }
    }, 0);

    return totalPoints;
  };

  const awardHarmonyPoints = (
    userId: string, 
    amount: number, 
    reason: HarmonyPointReason,
    relatedMessageId?: string
  ) => {
    const newPointEvent: HarmonyPointEvent = {
      id: `point-${Date.now()}`,
      userId,
      amount,
      reason,
      createdAt: new Date().toISOString(),
      relatedMessageId
    };

    setCurrentUser(prev => ({
      ...prev,
      harmonyPointEvents: [...prev.harmonyPointEvents, newPointEvent],
      totalHarmonyPoints: calculateUserHarmonyPoints(userId)
    }));
  };

  const baseContextValue: Partial<TurfContextType> = {
    currentUser,
    darkMode,
    toggleDarkMode,
    // Remove the updateHarmonyPoints method since it's not in the TurfContextType interface
    awardHarmonyPoints,
    calculateUserHarmonyPoints
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

  if (!notificationsContext || !topicsContext || !messagesContext) {
    throw new Error("useTurf must be used within TurfProvider");
  }

  return {
    ...turfContext,
    ...notificationsContext,
    ...topicsContext,
    ...messagesContext
  } as TurfContextType;
};
