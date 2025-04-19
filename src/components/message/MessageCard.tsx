
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Message } from '@/types/turf';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import MessageHeader from './MessageHeader';
import MessageStats from './MessageStats';
import LinkedMessage from './LinkedMessage';
import MessageReactions from './MessageReactions';
import MessageActions from './MessageActions';
import MessageReplyForm from './MessageReplyForm';
import { useMessageActions } from '@/hooks/useMessageActions';

interface MessageCardProps {
  message: Message;
  isPinned?: boolean;
  isSequence?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ 
  message, 
  isPinned = false, 
  isSequence = false 
}) => {
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
  
  const linkedMessage = message.linkTo && messages
    ? messages.find(m => m.id === message.linkTo) 
    : null;
  
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], { 
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div 
      className={cn(
        "px-4 py-2 hover:bg-muted/30 transition-colors group relative rounded-sm",
        message.isAi && "bg-ai/20",
        isPinned && "bg-gold-light/10 border-l-4 border-gold animate-pulse",
        isSequence && "pt-0.5 mt-0"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3">
        {!isSequence ? (
          <Avatar className="h-10 w-10 shrink-0 mt-0.5">
            <AvatarImage src={message.avatarUrl} alt={message.username} />
            <AvatarFallback>{message.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 shrink-0"></div>
        )}
        
        <div className="flex-1 min-w-0">
          <MessageHeader 
            username={message.username}
            isAi={message.isAi}
            timestamp={formattedTime}
            tags={message.tags}
            isSequence={isSequence}
          />
          
          <div className={cn("break-words", isSequence && "mt-0")}>
            {message.content}
          </div>
          
          {linkedMessage && (
            <LinkedMessage 
              username={linkedMessage.username}
              content={linkedMessage.content}
            />
          )}
          
          <MessageStats 
            upvotes={message.upvotes}
            downvotes={message.downvotes}
            brainAwards={message.brainAwards}
          />
          
          <MessageReactions reactions={message.reactions} />
          
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
