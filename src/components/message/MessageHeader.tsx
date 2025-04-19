
import React from 'react';
import { MessageTag } from '@/types/turf';
import { cn } from '@/lib/utils';

interface MessageHeaderProps {
  username: string;
  isAi: boolean;
  timestamp: string;
  tags: MessageTag[];
  isSequence?: boolean;
}

const getTagColor = (tag: MessageTag): string => {
  switch (tag) {
    case 'Sharp Wit': return 'bg-orange-400 text-black';
    case 'Deep Insight': return 'bg-blue-400 text-white';
    case 'Valid Question': return 'bg-purple-400 text-white';
    case 'Strong Evidence': return 'bg-green-400 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const MessageHeader: React.FC<MessageHeaderProps> = ({
  username,
  isAi,
  timestamp,
  tags,
  isSequence
}) => {
  if (isSequence) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={cn(
        "font-medium",
        isAi && "text-primary flex items-center gap-1"
      )}>
        {username}
        {isAi && (
          <span className="text-xs bg-primary text-primary-foreground rounded px-1 py-0.5 ml-1">
            🧙 BOT
          </span>
        )}
      </span>
      
      {tags.length > 0 && (
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                getTagColor(tag)
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageHeader;
