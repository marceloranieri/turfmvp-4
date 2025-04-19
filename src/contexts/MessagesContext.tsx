
import React, { createContext, useContext, useState } from 'react';
import { Message, ReactionType, User } from '@/types/turf';
import { useWizardAI } from '../hooks/useWizardAI';
import { useNotifications } from './NotificationsContext';

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

// Expose the context for direct access
MessagesProvider.context = MessagesContext;

export function MessagesProvider({ 
  children,
  currentUser,
  onNotification
}: { 
  children: React.ReactNode;
  currentUser: User;
  onNotification: (notification: any) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const notificationsContext = useNotifications();

  const { checkForLull } = useWizardAI(
    messages,
    currentUser.id,
    (message) => setMessages(prev => [...prev, message]),
    onNotification
  );

  // Effect for pinning messages
  React.useEffect(() => {
    const pinMessage = () => {
      const lastMessages = messages
        .filter(msg => !msg.isAi && new Date(msg.createdAt).getTime() > Date.now() - 20 * 60 * 1000)
        .sort((a, b) => {
          const engagementA = a.upvotes + a.reactions.length;
          const engagementB = b.upvotes + b.reactions.length;
          return engagementB - engagementA;
        });
      
      if (lastMessages.length > 0) {
        setPinnedMessageId(lastMessages[0].id);
        setTimeout(() => setPinnedMessageId(null), 30000);
      }
    };

    const initialPin = setTimeout(pinMessage, 5000);
    const interval = setInterval(pinMessage, 5 * 60 * 1000);
    
    return () => {
      clearTimeout(initialPin);
      clearInterval(interval);
    };
  }, [messages]);

  // Effect for AI responses
  React.useEffect(() => {
    const interval = setInterval(checkForLull, 5000);
    return () => clearInterval(interval);
  }, [checkForLull]);

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
        const notification = {
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

  const messageActions = {
    addReaction: (messageId: string, type: ReactionType, value: string) => {
      const newReaction = {
        id: `reaction-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        type,
        value
      };
      
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, reactions: [...message.reactions, newReaction] }
            : message
        )
      );
      
      const targetMessage = messages.find(m => m.id === messageId);
      if (targetMessage && targetMessage.userId !== currentUser.id) {
        const notification = {
          id: `notif-${Date.now()}`,
          userId: targetMessage.userId,
          messageId,
          type: "reaction",
          content: `${currentUser.username} reacted to your message with ${value}`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notificationsContext.addNotification(notification);
        onNotification(notification);
      }
    },

    removeReaction: (messageId: string, reactionId: string) => {
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, reactions: message.reactions.filter(r => r.id !== reactionId) }
            : message
        )
      );
    },

    upvoteMessage: (messageId: string) => {
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, upvotes: message.upvotes + 1 }
            : message
        )
      );
      
      const targetMessage = messages.find(m => m.id === messageId);
      if (targetMessage && targetMessage.userId !== currentUser.id) {
        const notification = {
          id: `notif-${Date.now()}`,
          userId: targetMessage.userId,
          messageId,
          type: "reaction",
          content: `${currentUser.username} upvoted your message (+1 harmony point)`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notificationsContext.addNotification(notification);
        onNotification(notification);
      }
    },

    downvoteMessage: (messageId: string) => {
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, downvotes: message.downvotes + 1 }
            : message
        )
      );
    },

    awardBrain: (messageId: string) => {
      if (currentUser.brainAwardsGiven >= 3) return;
      
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, brainAwards: message.brainAwards + 1 }
            : message
        )
      );
      
      const targetMessage = messages.find(m => m.id === messageId);
      if (targetMessage) {
        const notification = {
          id: `notif-${Date.now()}`,
          userId: targetMessage.userId,
          messageId,
          type: "award",
          content: `${currentUser.username} awarded your message a Brain! 🧠`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notificationsContext.addNotification(notification);
        onNotification(notification);
      }
    }
  };

  return (
    <MessagesContext.Provider value={{ 
      messages, 
      pinnedMessageId,
      sendMessage,
      ...messageActions
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
