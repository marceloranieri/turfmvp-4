
import React, { useState, useMemo } from 'react';
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
import { useSubscription } from '@/hooks/useSubscription';

interface MessageCardProps {
  message: Message;
  isPinned?: boolean;
  isSequence?: boolean;
}

// Memo component to prevent unnecessary re-renders
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
  
  // Real-time reaction updates for this specific message
  useSubscription(
    `message-reactions-${message.id}`,
    'message_reactions',
    'INSERT',
    (payload) => {
      if (payload.new.message_id === message.id) {
        console.log('New reaction:', payload.new);
        // The context will handle the actual state update
      }
    }
  );
  
  // Memoize linked message lookup to prevent recalculation
  const linkedMessage = useMemo(() => {
    if (!message.linkTo || !messages) return null;
    return messages.find(m => m.id === message.linkTo);
  }, [message.linkTo, messages]);
  
  // Memoize time formatting
  const formattedTime = useMemo(() => {
    return new Date(message.createdAt).toLocaleTimeString([], { 
      hour: 'numeric',
      minute: '2-digit'
    });
  }, [message.createdAt]);

  // Group reactions by type for more efficient rendering
  const groupedReactions = useMemo(() => {
    return message.reactions.reduce((acc: Record<string, number>, reaction) => {
      acc[reaction.value] = (acc[reaction.value] || 0) + 1;
      return acc;
    }, {});
  }, [message.reactions]);

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
      <div className="flex gap-3 flex-col sm:flex-row">
        {!isSequence ? (
          <Avatar className="h-10 w-10 shrink-0 mt-0.5">
            <AvatarImage src={message.avatarUrl} alt={message.username} />
            <AvatarFallback>{message.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 shrink-0 hidden sm:block"></div>
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
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-1">
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
          </div>
          
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

// Use React.memo with custom comparison to prevent unnecessary re-renders
export default React.memo(MessageCard, (prevProps, nextProps) => {
  // Only re-render when these properties change
  return prevProps.message.id === nextProps.message.id &&
         prevProps.isPinned === nextProps.isPinned &&
         prevProps.isSequence === nextProps.isSequence &&
         prevProps.message.upvotes === nextProps.message.upvotes &&
         prevProps.message.downvotes === nextProps.message.downvotes &&
         prevProps.message.brainAwards === nextProps.message.brainAwards &&
         prevProps.message.reactions.length === nextProps.message.reactions.length;
});
