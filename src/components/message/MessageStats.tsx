
import React from 'react';
import { ThumbsUp, ThumbsDown, BrainCircuit } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageStatsProps {
  upvotes: number;
  downvotes: number;
  brainAwards: number;
}

const MessageStats: React.FC<MessageStatsProps> = ({
  upvotes,
  downvotes,
  brainAwards
}) => {
  return (
    <>
      <div className="flex items-center mt-1 gap-2">
        {upvotes > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs">
                  <ThumbsUp className="h-3 w-3 text-primary" />
                  <span>{upvotes}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{upvotes} {upvotes === 1 ? 'upvote' : 'upvotes'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {downvotes > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs">
                  <ThumbsDown className="h-3 w-3 text-destructive" />
                  <span>{downvotes}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{downvotes} {downvotes === 1 ? 'downvote' : 'downvotes'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {brainAwards > 0 && (
        <div className="flex items-center gap-1 mt-1.5 text-gold">
          <BrainCircuit className="h-4 w-4" />
          <span className="text-xs font-medium">
            {brainAwards} Genius Award{brainAwards > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </>
  );
};

export default MessageStats;
