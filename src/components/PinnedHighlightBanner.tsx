
import React, { useEffect, useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Pin } from 'lucide-react';

const PinnedHighlightBanner: React.FC = () => {
  const { pinnedMessageId, messages } = useTurf();
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    if (pinnedMessageId) {
      setVisible(true);
      setTimeLeft(30);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      setVisible(false);
    }
  }, [pinnedMessageId]);
  
  if (!visible || !pinnedMessageId) return null;
  
  const pinnedMessage = messages.find(msg => msg.id === pinnedMessageId);
  if (!pinnedMessage) return null;
  
  return (
    <div className="bg-background border-b border-gold">
      <div className="px-4 py-2 flex items-center">
        <Pin className="h-5 w-5 text-gold mr-2 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gold font-medium">
            PINNED MESSAGE · {timeLeft}s
          </div>
          <div className="text-base truncate">
            <span className="font-medium mr-1">{pinnedMessage.username}:</span>
            {pinnedMessage.content}
          </div>
        </div>
      </div>
      
      {/* Gold timer bar */}
      <div className="h-1 bg-gold/30 w-full">
        <div 
          className="h-full bg-gold transition-all duration-1000 ease-linear" 
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PinnedHighlightBanner;
