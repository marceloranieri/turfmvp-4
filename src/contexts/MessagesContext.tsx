
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, ReactionType, User, Notification } from '@/types/turf';
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

// Sample initial message
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    userId: 'system',
    username: 'Turf System',
    avatarUrl: '/wizard.png',
    content: 'Welcome to the debate! Share your thoughts on the topic.',
    isAi: false,
    createdAt: new Date().toISOString(),
    reactions: [],
    upvotes: 2,
    downvotes: 0,
    tags: [],
    brainAwards: 0
  },
  {
    id: 'msg-2',
    userId: 'wizard',
    username: 'Wizard of Mods',
    avatarUrl: '/wizard.png',
    content: 'Today\'s topic explores the future of remote work post-pandemic. Research suggests mixed impacts on productivity depending on job type and personality. What\'s your experience?',
    isAi: true,
    createdAt: new Date(Date.now() - 60000).toISOString(),
    reactions: [],
    upvotes: 3,
    downvotes: 0,
    tags: [],
    brainAwards: 1
  },
  {
    id: 'msg-3',
    userId: 'user-2',
    username: 'DebateMaster',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
    content: 'Remote work has definitely boosted my productivity. No commute means more time for deep work and fewer distractions.',
    isAi: false,
    createdAt: new Date(Date.now() - 45000).toISOString(),
    reactions: [{
      id: 'reaction-1',
      userId: 'user-3',
      username: 'ThoughtLeader',
      type: 'emoji',
      value: '👍'
    }],
    upvotes: 5,
    downvotes: 1,
    tags: ['Deep Insight'],
    brainAwards: 2
  },
  {
    id: 'msg-4',
    userId: 'user-3',
    username: 'ThoughtLeader',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
    content: 'I disagree. Team cohesion suffers significantly without in-person interaction. Productivity might look good on paper, but innovation and collaboration take a hit.',
    isAi: false,
    createdAt: new Date(Date.now() - 30000).toISOString(),
    reactions: [],
    upvotes: 3,
    downvotes: 2,
    tags: ['Valid Question'],
    brainAwards: 0,
    parentId: 'msg-3'
  }
];

export function MessagesProvider({ 
  children,
  currentUser,
  onNotification
}: { 
  children: React.ReactNode;
  currentUser: User;
  onNotification: (notification: any) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [lastPinTime, setLastPinTime] = useState<number>(0);
  const notificationsContext = useNotifications();

  // Log messages every time they change
  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);

  const { checkForLull } = useWizardAI(
    messages,
    currentUser.id,
    (message) => setMessages(prev => [...prev, message]),
    onNotification
  );

  // Effect for pinning messages - modified to be every 5 minutes
  React.useEffect(() => {
    const pinMessage = () => {
      const currentTime = Date.now();
      
      // Check if 5 minutes (300000ms) have passed since the last pin
      if (currentTime - lastPinTime < 300000) {
        console.log("Skipping pin - not yet 5 minutes since last pin");
        return;
      }
      
      const lastMessages = messages
        .filter(msg => !msg.isAi && new Date(msg.createdAt).getTime() > Date.now() - 20 * 60 * 1000)
        .sort((a, b) => {
          // Calculate engagement score: upvotes + replies + reactions
          const getRepliesCount = (msgId: string) => 
            messages.filter(m => m.parentId === msgId).length;
            
          const engagementA = a.upvotes + getRepliesCount(a.id) + a.reactions.length;
          const engagementB = b.upvotes + getRepliesCount(b.id) + b.reactions.length;
          
          return engagementB - engagementA;
        });
      
      if (lastMessages.length > 0) {
        const topMessage = lastMessages[0];
        const topMessageReplies = messages.filter(m => m.parentId === topMessage.id).length;
        console.log(`Pinning message with ${topMessage.upvotes} upvotes and ${topMessageReplies} replies`);
        
        setPinnedMessageId(topMessage.id);
        setLastPinTime(currentTime);
        
        // Create a notification for the pin
        const notification: Notification = {
          id: `notif-pin-${Date.now()}`,
          userId: topMessage.userId,
          messageId: topMessage.id,
          type: "pin",
          content: `Your message was pinned as Pincredible for high engagement!`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notificationsContext.addNotification(notification);
        
        // Unpin after 30 seconds
        setTimeout(() => {
          setPinnedMessageId(null);
          console.log("Unpinned message after 30 seconds");
        }, 30000);
      }
    };

    // Initial pin after 5 minutes instead of immediately
    const initialPin = setTimeout(pinMessage, 300000);
    
    // Set interval to run every minute to check if 5 minutes have passed
    const interval = setInterval(pinMessage, 60000);
    
    return () => {
      clearTimeout(initialPin);
      clearInterval(interval);
    };
  }, [messages, notificationsContext, lastPinTime]);

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
        const notification: Notification = {
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
        const notification: Notification = {
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
        const notification: Notification = {
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
