
import React, { useEffect, useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Pin, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const PinnedHighlightBanner: React.FC = () => {
  const { pinnedMessageId, messages } = useTurf();
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Only show pinned message if it exists and hasn't been dismissed
    if (pinnedMessageId && !dismissed) {
      setVisible(true);
      setTimeLeft(30);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto hide after time expires
            setVisible(false);
            setDismissed(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (!pinnedMessageId) {
      setVisible(false);
      setDismissed(false);
    }
  }, [pinnedMessageId, dismissed]);
  
  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };
  
  if (!visible || !pinnedMessageId || dismissed) return null;
  
  const pinnedMessage = messages?.find(msg => msg.id === pinnedMessageId);
  if (!pinnedMessage) return null;
  
  return (
    <div className="bg-background border-b border-gold animate-pulse">
      <div className="px-4 py-2 flex items-center">
        <Pin className="h-5 w-5 text-gold mr-2 shrink-0" />
        
        <div className="flex items-center flex-1 min-w-0">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={pinnedMessage.avatarUrl} alt={pinnedMessage.username} />
            <AvatarFallback>{pinnedMessage.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gold font-medium flex items-center">
              <span>PINNED MESSAGE · {timeLeft}s</span>
            </div>
            <div className="text-base truncate">
              <span className="font-medium mr-1">{pinnedMessage.username}:</span>
              {pinnedMessage.content}
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 h-6 w-6" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
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
