
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
    case 'Sharp Wit': return 'bg-[#E3F2FD] text-[#2C2F33] dark:bg-[#5865F2]/80 dark:text-white';
    case 'Deep Insight': return 'bg-[#E3F2FD] text-[#2C2F33] dark:bg-[#5865F2]/80 dark:text-white';
    case 'Valid Question': return 'bg-[#E3F2FD] text-[#2C2F33] dark:bg-[#5865F2]/80 dark:text-white';
    case 'Strong Evidence': return 'bg-[#E3F2FD] text-[#2C2F33] dark:bg-[#5865F2]/80 dark:text-white';
    default: return 'bg-[#E3F2FD] text-[#2C2F33] dark:bg-[#5865F2]/80 dark:text-white';
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
        "dark:text-white text-[#2C2F33]",
        isAi && "text-[#00A8FC] dark:text-[#5865F2] flex items-center gap-1"
      )}>
        {username}
        {isAi && (
          <span className="text-xs bg-[#00A8FC] dark:bg-[#5865F2] text-white rounded px-1 py-0.5 ml-1">
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
