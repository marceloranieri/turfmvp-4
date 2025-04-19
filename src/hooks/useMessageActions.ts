
import { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Message } from '@/types/turf';

export const useMessageActions = (message: Message) => {
  const { 
    currentUser, 
    upvoteMessage, 
    downvoteMessage, 
    awardBrain, 
    addReaction,
    sendMessage 
  } = useTurf();
  
  const [showActions, setShowActions] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  
  const isFromCurrentUser = currentUser?.id === message.userId;
  const canAwardBrain = !isFromCurrentUser && (currentUser?.brainAwardsGiven || 0) < 3;
  const brainAwardsLeft = 3 - (currentUser?.brainAwardsGiven || 0);

  const handleUpvote = () => {
    upvoteMessage(message.id);
  };

  const handleDownvote = () => {
    downvoteMessage(message.id);
  };

  const handleReplySubmit = (content: string) => {
    sendMessage(content, message.id);
    setIsReplying(false);
  };

  const handleBrainAward = () => {
    awardBrain(message.id);
  };

  const handleReaction = (type: 'emoji' | 'gif', value: string) => {
    addReaction(message.id, type, value);
  };

  const toggleReply = () => {
    setIsReplying(!isReplying);
  };

  return {
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
  };
};
