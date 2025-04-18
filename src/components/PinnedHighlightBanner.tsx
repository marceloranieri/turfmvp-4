
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
    <div className="bg-gold/10 border-b border-gold/40 animate-slide-in overflow-hidden">
      <div className="px-4 py-2 flex items-center">
        <Pin className="h-4 w-4 text-gold mr-2 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gold/80 font-medium">
            PINNED MESSAGE · {timeLeft}s
          </div>
          <div className="text-sm truncate">
            <span className="font-medium mr-1">{pinnedMessage.username}:</span>
            {pinnedMessage.content}
          </div>
        </div>
      </div>
      
      {/* Timer bar */}
      <div className="h-0.5 bg-gold/30">
        <div className="h-full bg-gold animate-countdown" />
      </div>
    </div>
  );
};

export default PinnedHighlightBanner;
