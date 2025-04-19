import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Message, MessageTag } from '@/types/turf';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import MessageReactions from './MessageReactions';
import MessageActions from './MessageActions';
import MessageReplyForm from './MessageReplyForm';
import { useMessageActions } from '@/hooks/useMessageActions';

interface MessageCardProps {
  message: Message;
  isPinned?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, isPinned = false }) => {
  const { messages } = useTurf();
  const {
    showActions,
    setShowActions,
    isReplying,
    setIsReplying,
    canAwardBrain,
    brainAwardsLeft,
    handleUpvote,
    handleDownvote,
    handleReplySubmit,
    handleBrainAward,
    handleReaction,
    toggleReply
  } = useMessageActions(message);
  
  const parentMessage = message.parentId 
    ? messages.find(m => m.id === message.parentId) 
    : null;
  
  const linkedMessage = message.linkTo 
    ? messages.find(m => m.id === message.linkTo) 
    : null;
  
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], { 
    hour: 'numeric',
    minute: '2-digit'
  });
  
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
      {parentMessage && (
        <div className="flex items-center text-xs text-muted-foreground mb-1 ml-12 border-l-2 border-border pl-2">
          <span className="mr-1">Replying to</span>
          <span className="font-medium text-primary">{parentMessage.username}</span>
        </div>
      )}
      
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 mt-0.5">
          <AvatarImage src={message.avatarUrl} alt={message.username} />
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
          
          <MessageReactions reactions={message.reactions} />
          
          {message.brainAwards > 0 && (
            <div className="flex items-center gap-1 mt-1.5 text-gold">
              <BrainCircuit className="h-4 w-4" />
              <span className="text-xs font-medium">
                {message.brainAwards} Brain Award{message.brainAwards > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <MessageActions
            upvotes={message.upvotes}
            downvotes={message.downvotes}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onReplyClick={toggleReply}
            onEmojiSelect={(emoji: string) => handleReaction('emoji', emoji)}
            onGifSelect={(gifUrl: string) => handleReaction('gif', gifUrl)}
            onBrainAward={handleBrainAward}
            canAwardBrain={canAwardBrain}
            brainAwardsLeft={brainAwardsLeft}
            showActions={showActions}
          />
          
          {isReplying && (
            <MessageReplyForm
              username={message.username}
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
