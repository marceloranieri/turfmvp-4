
import React, { createContext, useContext, useState } from 'react';
import { DebateTopic } from '@/types/turf';
import { INITIAL_TOPIC_FIXED } from '@/constants/turf';

interface TopicsContextType {
  currentTopic: DebateTopic | null;
}

const TopicsContext = createContext<TopicsContextType | null>(null);

export const TopicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTopic] = useState<DebateTopic>(INITIAL_TOPIC_FIXED);

  return (
    <TopicsContext.Provider value={{ currentTopic }}>
      {children}
    </TopicsContext.Provider>
  );
};

export const useTopics = () => {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error("useTopics must be used within a TopicsProvider");
  }
  return context;
};
