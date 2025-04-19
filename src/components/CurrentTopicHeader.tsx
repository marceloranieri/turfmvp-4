
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Progress } from '@/components/ui/progress';
import { Clock, Users } from 'lucide-react';

const CurrentTopicHeader: React.FC = () => {
  const { currentTopic } = useTurf();

  if (!currentTopic) return null;

  const startDate = new Date(currentTopic.startTime);
  const endDate = new Date(currentTopic.endTime);
  const now = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  const formattedTimeLeft = () => {
    const timeLeftMs = endDate.getTime() - now.getTime();
    if (timeLeftMs <= 0) return "Ended";
    
    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
    if (hoursLeft > 23) {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
    }
    return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} left`;
  };

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">{currentTopic.title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{currentTopic.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 mr-1" />
          <span>12 participants</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{formattedTimeLeft()}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
};

export default CurrentTopicHeader;
