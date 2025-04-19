
import React, { useEffect, useRef } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import MessageCard from './MessageCard';
import PinnedHighlightBanner from './PinnedHighlightBanner';

const MessageThread: React.FC = () => {
  const { messages, pinnedMessageId } = useTurf();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto px-0 py-2">
      <PinnedHighlightBanner />
      <div className="flex flex-col max-w-3xl mx-auto">
        {messages.map(message => (
          <MessageCard 
            key={message.id} 
            message={message}
            isPinned={message.id === pinnedMessageId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageThread;
