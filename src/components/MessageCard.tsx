
import React, { useState } from 'react';
import { useTurf, Message, MessageTag, ReactionType } from '@/contexts/TurfContext';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Link as LinkIcon, MessageSquare, Smile, BrainCircuit, Image } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [replyText, setReplyText] = useState('');
  
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
  
  // Function to get tag color
  const getTagColor = (tag: MessageTag): string => {
    switch (tag) {
      case 'Sharp Wit': return 'bg-orange-400 text-black';
      case 'Deep Insight': return 'bg-blue-400 text-white';
      case 'Valid Question': return 'bg-purple-400 text-white';
      case 'Strong Evidence': return 'bg-green-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };
  
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
  
  const handleAddReaction = () => {
    // In a real app, would open emoji picker
    // For demo, let's just add a random emoji
    const emojis = ['👍', '❤️', '🔥', '🎉', '😂', '🙌', '👏', '🤔'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    addReaction(message.id, 'emoji' as ReactionType, randomEmoji);
  };
  
  const canAwardBrain = !isFromCurrentUser && currentUser?.brainAwardsGiven < 3;
  
  return (
    <div 
      className={cn(
        "px-4 py-2 hover:bg-muted/30 transition-colors group relative",
        message.isAi && "bg-ai/20",
        isPinned && "bg-gold/10 border-l-4 border-gold"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Parent message reference */}
      {parentMessage && (
        <div className="flex items-center text-xs text-muted-foreground mb-1 ml-12 border-l-2 border-border pl-2">
          <span className="mr-1">Replying to</span>
          <span className="font-medium text-primary">{parentMessage.username}</span>
        </div>
      )}
      
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 mt-0.5">
          <AvatarImage src={message.avatarUrl} />
          <AvatarFallback>{message.username.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium",
              message.isAi && "text-primary flex items-center gap-1"
            )}>
              {message.username}
              {message.isAi && (
                <span className="text-xs bg-primary text-primary-foreground rounded px-1 py-0.5">
                  BOT
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
            
            {/* Tags */}
            {message.tags.length > 0 && (
              <div className="flex gap-1">
                {message.tags.map((tag, index) => (
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
          
          <div className="mt-1 break-words">
            {message.content}
          </div>
          
          {/* Linked message reference */}
          {linkedMessage && (
            <div className="mt-2 border-l-2 border-primary/30 pl-2 py-1 text-sm bg-muted/30 rounded">
              <div className="text-xs text-primary">
                <LinkIcon className="inline-block h-3 w-3 mr-1" />
                <span>Linked to {linkedMessage.username}'s message:</span>
              </div>
              <div className="text-muted-foreground line-clamp-1">
                {linkedMessage.content}
              </div>
            </div>
          )}
          
          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {/* Group reactions by value */}
              {Object.entries(
                message.reactions.reduce((acc: Record<string, number>, reaction) => {
                  acc[reaction.value] = (acc[reaction.value] || 0) + 1;
                  return acc;
                }, {})
              ).map(([value, count], index) => (
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
                        {message.reactions
                          .filter(r => r.value === value)
                          .map(r => r.username)
                          .join(', ')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
          
          {/* Awards */}
          {message.brainAwards > 0 && (
            <div className="flex items-center gap-1 mt-1.5 text-gold">
              <BrainCircuit className="h-4 w-4" />
              <span className="text-xs font-medium">{message.brainAwards} Brain Award{message.brainAwards > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {/* Message actions */}
          <div 
            className={cn(
              "flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
              showActions && "opacity-100"
            )}
          >
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={handleUpvote}>
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">{message.upvotes > 0 ? message.upvotes : ''}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={handleDownvote}>
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span className="text-xs">{message.downvotes > 0 ? message.downvotes : ''}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={handleReply}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-muted-foreground"
              onClick={handleAddReaction}
            >
              <Image className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-7 px-2",
                canAwardBrain ? "text-gold hover:text-gold/90" : "text-muted-foreground opacity-50"
              )}
              onClick={handleAwardBrain}
              disabled={!canAwardBrain}
            >
              <BrainCircuit className="h-4 w-4" />
              <span className="text-xs ml-1">
                Award Brain ({3 - (currentUser?.brainAwardsGiven || 0)} left)
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
