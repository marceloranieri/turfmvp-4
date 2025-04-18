
import React from 'react';
import { useTurf, DebatePhase } from '@/contexts/TurfContext';
import { formatDistanceToNow } from 'date-fns';
import { HashIcon, Clock } from 'lucide-react';

const CurrentTopicHeader: React.FC = () => {
  const { currentTopic } = useTurf();
  
  if (!currentTopic) return null;
  
  const timeRemaining = formatDistanceToNow(
    new Date(currentTopic.endTime),
    { addSuffix: true }
  );
  
  const phaseColors: Record<DebatePhase, string> = {
    [DebatePhase.OPENING_ARGUMENTS]: 'bg-blue-500',
    [DebatePhase.REBUTTALS]: 'bg-orange-500',
    [DebatePhase.COUNTERPOINTS]: 'bg-purple-500',
    [DebatePhase.CONCLUSION]: 'bg-green-500'
  };
  
  const phaseColor = phaseColors[currentTopic.currentPhase] || 'bg-primary';
  
  return (
    <div className="border-b border-border flex items-center px-4 py-3 bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <HashIcon className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">{currentTopic.title}</h1>
        </div>
        <div className="text-muted-foreground text-sm flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${phaseColor}`}></span>
            <span>{currentTopic.currentPhase}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Ends {timeRemaining}</span>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-2">
        <div className="border border-border rounded px-3 py-1.5 text-xs font-medium flex items-center gap-2">
          <span>{currentTopic.currentPhase}</span>
          <div className={`h-2 w-2 rounded-full ${phaseColor}`}></div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTopicHeader;
