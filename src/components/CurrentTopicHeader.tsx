
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { formatDistanceToNow } from 'date-fns';

const CurrentTopicHeader: React.FC = () => {
  const { currentTopic } = useTurf();
  
  if (!currentTopic) return null;
  
  const timeRemaining = formatDistanceToNow(
    new Date(currentTopic.endTime),
    { addSuffix: true }
  );
  
  return (
    <div className="py-4 border-b border-border">
      <h1 className="font-bold text-2xl text-center">{currentTopic.title}</h1>
      <div className="text-muted-foreground text-center text-sm mt-1">
        <span className="mr-2">{currentTopic.currentPhase}</span>
        <span>· Ends {timeRemaining}</span>
      </div>
    </div>
  );
};

export default CurrentTopicHeader;
