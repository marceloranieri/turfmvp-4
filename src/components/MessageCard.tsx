
import React, { useState } from 'react';
import { useTurf, Message, MessageTag, ReactionType } from '@/contexts/TurfContext';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageCardProps {
  message: Message;
  isPinned?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, isPinned = false }) => {
  const { 
    currentUser, 
    upvoteMessage, 
    downvoteMessage, 
    awardBrain, 
    messages,
    addReaction
  } = useTurf();
  
  const [showActions, setShowActions] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  
  // Find the message this is replying to
  const parentMessage = message.parentId 
    ? messages.find(m => m.id === message.parentId) 
    : null;
  
  // Find the linked message
  const linkedMessage = message.linkTo 
    ? messages.find(m => m.id === message.linkTo) 
    : null;
  
  const formattedTime = format(new Date(message.createdAt), 'h:mm a');
  const isFromCurrentUser = currentUser?.id === message.userId;
  
  const handleUpvote = () => {
    upvoteMessage(message.id);
  };
  
  const handleDownvote = () => {
    downvoteMessage(message.id);
  };
  
  const handleAwardBrain = () => {
    if (currentUser?.brainAwardsGiven < 3) {
      awardBrain(message.id);
    }
  };
  
  const handleReply = () => {
    setIsReplying(!isReplying);
  };
  
  return (
    <div 
      className={cn(
        "px-4 py-3 group relative border-b border-border",
        message.isAi && "bg-ai",
        isPinned && "border-l-2 border-gold"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Parent message reference */}
      {parentMessage && (
        <div className="text-xs text-muted-foreground mb-2 border-l border-muted-foreground pl-2">
          <span className="mr-1">Reply to</span>
          <span>{parentMessage.username}</span>
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium",
            message.isAi && "text-ai-foreground"
          )}>
            {message.username}
            {message.isAi && (
              <span className="text-xs ml-1">
                [AI]
              </span>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        
        <div className="mt-1 text-foreground">
          {message.content}
        </div>
        
        {/* Linked message reference */}
        {linkedMessage && (
          <div className="mt-2 border-l pl-2 py-1 text-sm text-muted-foreground">
            <div className="text-xs">
              <span>Linked to {linkedMessage.username}'s message:</span>
            </div>
            <div className="line-clamp-1">
              {linkedMessage.content}
            </div>
          </div>
        )}
        
        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(
              message.reactions.reduce((acc: Record<string, number>, reaction) => {
                acc[reaction.value] = (acc[reaction.value] || 0) + 1;
                return acc;
              }, {})
            ).map(([value, count], index) => (
              <div key={index} className="text-sm">
                <span>{value}</span>
                <span className="text-muted-foreground ml-1">{count}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Awards */}
        {message.brainAwards > 0 && (
          <div className="mt-1.5 text-gold text-xs">
            {message.brainAwards} Brain Award{message.brainAwards > 1 ? 's' : ''}
          </div>
        )}
        
        {/* Message actions */}
        <div 
          className={cn(
            "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
            showActions && "opacity-100"
          )}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-muted-foreground" 
            onClick={handleUpvote}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">{message.upvotes > 0 ? message.upvotes : ''}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-muted-foreground" 
            onClick={handleDownvote}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span className="text-xs">{message.downvotes > 0 ? message.downvotes : ''}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-muted-foreground" 
            onClick={handleReply}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-7 px-2",
              !isFromCurrentUser ? "text-gold" : "text-muted-foreground opacity-50"
            )}
            onClick={handleAwardBrain}
            disabled={isFromCurrentUser || (currentUser?.brainAwardsGiven || 0) >= 3}
          >
            Brain ({3 - (currentUser?.brainAwardsGiven || 0)} left)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
