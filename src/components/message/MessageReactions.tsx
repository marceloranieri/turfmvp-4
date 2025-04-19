
import React from 'react';
import { Reaction } from '@/types/turf';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageReactionsProps {
  reactions: Reaction[];
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions }) => {
  if (reactions.length === 0) return null;

  // Group reactions by value
  const groupedReactions = reactions.reduce((acc: Record<string, number>, reaction) => {
    acc[reaction.value] = (acc[reaction.value] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(groupedReactions).map(([value, count], index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-muted rounded-full px-2 py-0.5 text-sm flex items-center gap-1 cursor-pointer hover:bg-muted/80">
                <span>{value}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {reactions
                  .filter(r => r.value === value)
                  .map(r => r.username)
                  .join(', ')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default MessageReactions;
