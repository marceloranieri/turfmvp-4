
import React, { useEffect, useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Pin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PinnedHighlightBanner: React.FC = () => {
  const { pinnedMessageId, messages } = useTurf();
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (pinnedMessageId) {
      setVisible(true);
      setTimeLeft(30);
      setProgress(100);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
        
        // Update progress bar
        setProgress(prev => {
          const newProgress = (prev - (100 / 30));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 1000);
      
      // Don't hide automatically - TurfContext will handle unpinning after 30 seconds
      return () => clearInterval(timer);
    } else {
      setVisible(false);
    }
  }, [pinnedMessageId]);
  
  if (!visible || !pinnedMessageId) return null;
  
  const pinnedMessage = messages.find(msg => msg.id === pinnedMessageId);
  if (!pinnedMessage) return null;
  
  return (
    <div className="bg-black border border-gold animate-fade-in fixed top-0 left-0 right-0 z-50">
      <div className="px-4 py-2 flex items-center">
        <Pin className="h-5 w-5 text-gold mr-2 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gold font-medium">
            PINNED MESSAGE · {timeLeft}s
          </div>
          <div className="text-white truncate">
            <span className="font-medium mr-1">{pinnedMessage.username}:</span>
            {pinnedMessage.content}
          </div>
        </div>
      </div>
      
      {/* Progress bar timer */}
      <div className="h-1 w-full bg-gold/30">
        <div 
          className="h-full bg-gold transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default PinnedHighlightBanner;
