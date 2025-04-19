
import React, { createContext, useContext, useState } from 'react';
import { Message, ReactionType, User, Notification } from '@/types/turf';
import { useWizardAI } from '../hooks/useWizardAI';
import { useNotifications } from './NotificationsContext';
import { usePinnedMessage } from '../hooks/usePinnedMessage';
import { useMessageOperations } from '../hooks/useMessageOperations';
import { INITIAL_MESSAGES } from '@/constants/turf';

interface MessagesContextType {
  messages: Message[];
  pinnedMessageId: string | null;
  sendMessage: (content: string, parentId?: string, linkToId?: string) => void;
  addReaction: (messageId: string, type: ReactionType, value: string) => void;
  removeReaction: (messageId: string, reactionId: string) => void;
  upvoteMessage: (messageId: string) => void;
  downvoteMessage: (messageId: string) => void;
  awardBrain: (messageId: string) => void;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

MessagesProvider.context = MessagesContext;

export function MessagesProvider({ 
  children,
  currentUser,
  onNotification
}: { 
  children: React.ReactNode;
  currentUser: User;
  onNotification: (notification: Notification) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const notificationsContext = useNotifications();
  
  const { pinnedMessageId } = usePinnedMessage(messages, onNotification);
  const { addReaction, upvoteMessage, awardBrain } = useMessageOperations(
    messages,
    currentUser.id,
    onNotification
  );

  const { checkForLull } = useWizardAI(
    messages,
    currentUser.id,
    (message) => setMessages(prev => [...prev, message]),
    onNotification
  );

  const sendMessage = (content: string, parentId?: string, linkToId?: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      content,
      parentId,
      linkTo: linkToId,
      isAi: false,
      createdAt: new Date().toISOString(),
      reactions: [],
      upvotes: 0,
      downvotes: 0,
      tags: [],
      brainAwards: 0
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (linkToId) {
      const linkedMessage = messages.find(m => m.id === linkToId);
      if (linkedMessage && linkedMessage.upvotes > 0) {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          userId: linkedMessage.userId,
          messageId: newMessage.id,
          type: "mention",
          content: `${currentUser.username} linked to your message, earning you harmony points!`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notificationsContext.addNotification(notification);
        onNotification(notification);
      }
    }
  };

  const handleReaction = (messageId: string, type: ReactionType, value: string) => {
    const newReaction = addReaction(messageId, type, value);
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, reactions: [...message.reactions, newReaction] }
          : message
      )
    );
  };

  const removeReaction = (messageId: string, reactionId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, reactions: message.reactions.filter(r => r.id !== reactionId) }
          : message
      )
    );
  };

  const handleUpvote = (messageId: string) => {
    upvoteMessage(messageId);
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, upvotes: message.upvotes + 1 }
          : message
      )
    );
  };

  const handleDownvote = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, downvotes: message.downvotes + 1 }
          : message
      )
    );
  };

  const handleAwardBrain = (messageId: string) => {
    if (currentUser.brainAwardsGiven >= 3) return;
    
    awardBrain(messageId);
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, brainAwards: message.brainAwards + 1 }
          : message
      )
    );
  };

  return (
    <MessagesContext.Provider value={{ 
      messages, 
      pinnedMessageId,
      sendMessage,
      addReaction: handleReaction,
      removeReaction,
      upvoteMessage: handleUpvote,
      downvoteMessage: handleDownvote,
      awardBrain: handleAwardBrain
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
