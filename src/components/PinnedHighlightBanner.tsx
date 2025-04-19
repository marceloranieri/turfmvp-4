
import React, { useEffect, useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';

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
    <div className="border-b border-gold">
      <div className="px-4 py-3">
        <div className="text-xs text-gold mb-1">
          PINNED MESSAGE · {timeLeft}s
        </div>
        <div className="text-sm">
          <span className="font-medium mr-1">{pinnedMessage.username}:</span>
          {pinnedMessage.content}
        </div>
      </div>
      
      {/* Timer bar */}
      <div className="h-0.5 bg-secondary">
        <div className="h-full bg-gold animate-countdown" />
      </div>
    </div>
  );
};

export default PinnedHighlightBanner;
