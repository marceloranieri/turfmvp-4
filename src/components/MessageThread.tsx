
import React, { useEffect, useRef } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import MessageCard from './message/MessageCard';
import { Message } from '@/types/turf';
import { cn } from '@/lib/utils';

const MessageThread: React.FC = () => {
  const { messages, pinnedMessageId } = useTurf();
  const threadEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages?.length && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by timeframe
  const groupMessages = (msgs: Message[]) => {
    if (!msgs || !msgs.length) return [];
    
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    
    msgs.forEach(msg => {
      const messageDate = new Date(msg.createdAt).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [msg]
        });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    
    return groups;
  };
  
  const messageGroups = groupMessages(messages || []);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
      {messageGroups.length > 0 ? (
        <div className="flex flex-col gap-1">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date} className="mb-2">
              <div className="flex items-center my-2">
                <div className="h-px flex-1 bg-border"></div>
                <div className="px-2 text-xs text-muted-foreground">{group.date}</div>
                <div className="h-px flex-1 bg-border"></div>
              </div>
              
              {group.messages.map((message, messageIndex) => {
                // Check if this message is part of a sequence from the same user
                const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                const isSequence = prevMessage && 
                                  prevMessage.userId === message.userId && 
                                  !message.parentId &&
                                  (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 5 * 60 * 1000);
                
                return (
                  <MessageCard 
                    key={message.id} 
                    message={message}
                    isPinned={message.id === pinnedMessageId}
                    isSequence={isSequence}
                  />
                );
              })}
            </div>
          ))}
          <div ref={threadEndRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="mb-1">No messages yet.</p>
            <p>Start the conversation!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageThread;
