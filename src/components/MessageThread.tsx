
import React, { useEffect } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import MessageCard from './message/MessageCard';

const MessageThread: React.FC = () => {
  const { messages, pinnedMessageId } = useTurf();
  
  // Add a debug message for messages
  useEffect(() => {
    console.log("Messages in thread:", messages);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages && messages.length > 0 ? (
        <div className="flex flex-col gap-3">
          {messages.map(message => (
            <MessageCard 
              key={message.id} 
              message={message}
              isPinned={message.id === pinnedMessageId}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
};

export default MessageThread;
