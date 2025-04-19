
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import MessageCard from './MessageCard';

const MessageThread: React.FC = () => {
  const { messages, pinnedMessageId } = useTurf();
  
  return (
    <div className="flex-1 overflow-y-auto px-0 py-2">
      <div className="flex flex-col">
        {messages.map(message => (
          <MessageCard 
            key={message.id} 
            message={message}
            isPinned={message.id === pinnedMessageId}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageThread;
