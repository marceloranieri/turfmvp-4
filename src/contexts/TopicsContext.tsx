
import React, { createContext, useContext, useState } from 'react';
import { DebateTopic } from '@/types/turf';
import { INITIAL_TOPIC } from '@/constants/turf';

interface TopicsContextType {
  currentTopic: DebateTopic | null;
}

const TopicsContext = createContext<TopicsContextType | null>(null);

// Expose the context for direct access
TopicsProvider.context = TopicsContext;

export function TopicsProvider({ children }: { children: React.ReactNode }) {
  const [currentTopic] = useState<DebateTopic>(INITIAL_TOPIC);

  return (
    <TopicsContext.Provider value={{ currentTopic }}>
      {children}
    </TopicsContext.Provider>
  );
}

export const useTopics = () => {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error("useTopics must be used within a TopicsProvider");
  }
  return context;
};
