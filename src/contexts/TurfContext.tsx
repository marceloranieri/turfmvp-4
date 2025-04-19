import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

// Define the debate phases
export enum DebatePhase {
  OPENING_ARGUMENTS = "Opening Arguments",
  REBUTTALS = "Rebuttals",
  COUNTERPOINTS = "Counterpoints",
  CONCLUSION = "Conclusion"
}

// Define the message reaction types
export type ReactionType = 'emoji' | 'gif';

// Tags that can be applied to messages
export type MessageTag = 'Sharp Wit' | 'Deep Insight' | 'Valid Question' | 'Strong Evidence';

// Define AI notification lines for the Wizard of Mods
export const AI_NOTIFICATION_LINES = [
  "Wiz just tossed a thought grenade.",
  "The Wizard has entered the chat.",
  "Wizard of Mods just pulled a mic drop.",
  "Wiz is stirring the pot.",
  "The Wizard challenges your thinking.",
  "Perspective shift, courtesy of Wiz.",
  "The Wizard spices up the debate.",
  "Wiz just played devil's advocate.",
  "Wizard alert: new angle detected.",
  "The Wizard asks what if..."
];

// Define types for our entities
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  harmonyPoints: number;
  brainAwardsGiven: number;
  brainAwardsReceived: number;
}

export interface Reaction {
  id: string;
  userId: string;
  username: string;
  type: ReactionType;
  value: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  parentId?: string;
  isAi: boolean;
  createdAt: string;
  reactions: Reaction[];
  upvotes: number;
  downvotes: number;
  tags: MessageTag[];
  brainAwards: number;
  linkTo?: string;
}

export interface Notification {
  id: string;
  userId: string;
  messageId?: string;
  type: 'reaction' | 'reply' | 'mention' | 'award' | 'pin' | 'ai';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  currentPhase: DebatePhase;
  startTime: string;
  endTime: string;
}

// Type for the Turf context
interface TurfContextType {
  currentUser: User | null;
  messages: Message[];
  notifications: Notification[];
  currentTopic: DebateTopic | null;
  pinnedMessageId: string | null;
  unreadNotificationsCount: number;
  darkMode: boolean;
  
  // Actions
  sendMessage: (content: string, parentId?: string, linkToId?: string) => void;
  addReaction: (messageId: string, type: ReactionType, value: string) => void;
  removeReaction: (messageId: string, reactionId: string) => void;
  awardBrain: (messageId: string) => void;
  upvoteMessage: (messageId: string) => void;
  downvoteMessage: (messageId: string) => void;
  markNotificationsAsRead: () => void;
  toggleDarkMode: () => void;
}

// Mock current user for development
const MOCK_CURRENT_USER: User = {
  id: "user-1",
  username: "YourUsername",
  avatarUrl: "https://i.pravatar.cc/150?u=user-1",
  harmonyPoints: 42,
  brainAwardsGiven: 0,
  brainAwardsReceived: 2
};

// Create the context with default values
const TurfContext = createContext<TurfContextType>({
  currentUser: null,
  messages: [],
  notifications: [],
  currentTopic: null,
  pinnedMessageId: null,
  unreadNotificationsCount: 0,
  darkMode: true,
  
  sendMessage: () => {},
  addReaction: () => {},
  removeReaction: () => {},
  awardBrain: () => {},
  upvoteMessage: () => {},
  downvoteMessage: () => {},
  markNotificationsAsRead: () => {},
  toggleDarkMode: () => {}
});

// Initial topic for demonstration
const INITIAL_TOPIC: DebateTopic = {
  id: "topic-1",
  title: "Is remote work here to stay post-pandemic?",
  description: "Discuss the long-term viability of remote work arrangements and their impact on productivity, well-being, and organizational culture.",
  currentPhase: DebatePhase.OPENING_ARGUMENTS,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
};

// Initial messages for demonstration
const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    userId: "user-2",
    username: "AliceDebater",
    avatarUrl: "https://i.pravatar.cc/150?u=user-2",
    content: "Remote work clearly improves work-life balance and allows greater flexibility in where people can live. The pandemic showed us it's viable for many knowledge workers.",
    isAi: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    reactions: [
      {
        id: "reaction-1",
        userId: "user-3",
        username: "BobTheThinker",
        type: "emoji",
        value: "👍"
      }
    ],
    upvotes: 3,
    downvotes: 0,
    tags: ["Deep Insight"],
    brainAwards: 1
  },
  {
    id: "msg-2",
    userId: "user-3",
    username: "BobTheThinker",
    avatarUrl: "https://i.pravatar.cc/150?u=user-3",
    content: "While remote work has benefits, we can't ignore the value of in-person collaboration and spontaneous innovation that happens in shared spaces.",
    isAi: false,
    createdAt: new Date(Date.now() - 1500000).toISOString(), // 25 minutes ago
    reactions: [],
    upvotes: 2,
    downvotes: 1,
    tags: [],
    brainAwards: 0
  },
  {
    id: "msg-3",
    userId: "wizard",
    username: "Wizard of Mods",
    avatarUrl: "/wizard.png", // Would need to add this asset
    content: "Have you considered that hybrid models might outperform both fully remote and fully in-office arrangements? Studies suggest that 2-3 days in office may provide optimal results. [Source: https://example.com/hybrid-work-study]",
    isAi: true,
    createdAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    reactions: [],
    upvotes: 4,
    downvotes: 0,
    tags: [],
    brainAwards: 0
  }
];

// Initial notifications for demonstration
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: MOCK_CURRENT_USER.id,
    messageId: "msg-1",
    type: "reaction",
    content: "BobTheThinker reacted to your message with 👍",
    isRead: false,
    createdAt: new Date(Date.now() - 1700000).toISOString() // 28 minutes ago
  },
  {
    id: "notif-2",
    userId: MOCK_CURRENT_USER.id,
    messageId: "msg-3",
    type: "ai",
    content: "The Wizard challenges your thinking.",
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  }
];

// Provider component
export const TurfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [currentTopic, setCurrentTopic] = useState<DebateTopic | null>(INITIAL_TOPIC);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [lastPinTime, setLastPinTime] = useState<number>(0);

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Effect for pinning messages every 5 minutes
  useEffect(() => {
    const pinMessage = () => {
      const now = Date.now();
      
      // Only run pinning logic if it's been at least 5 minutes since the last pin
      if (now - lastPinTime < 5 * 60 * 1000) {
        return;
      }
      
      // Find message with most engagement from the last 20 minutes (excluding AI messages)
      const lastMessages = messages
        .filter(msg => 
          !msg.isAi && 
          new Date(msg.createdAt).getTime() > now - 20 * 60 * 1000
        )
        .sort((a, b) => {
          // Calculate engagement score: upvotes + reactions.length + number of replies
          const repliesA = messages.filter(m => m.parentId === a.id).length;
          const repliesB = messages.filter(m => m.parentId === b.id).length;
          
          const engagementA = a.upvotes + a.reactions.length + repliesA;
          const engagementB = b.upvotes + b.reactions.length + repliesB;
          
          return engagementB - engagementA;
        });
      
      if (lastMessages.length > 0) {
        const topMessage = lastMessages[0];
        setPinnedMessageId(topMessage.id);
        setLastPinTime(now);
        
        // Unpin after exactly 30 seconds
        setTimeout(() => {
          setPinnedMessageId(null);
        }, 30 * 1000);
      }
    };

    // Initial pin after 5 seconds (for demo)
    const initialPin = setTimeout(() => {
      pinMessage();
    }, 5000);
    
    // Setup interval for checking every minute
    // (we'll check if 5 minutes have passed inside the function)
    const interval = setInterval(pinMessage, 60 * 1000);
    
    return () => {
      clearTimeout(initialPin);
      clearInterval(interval);
    };
  }, [messages, lastPinTime]);

  // Effect to simulate AI (Wizard of Mods) posting during lulls
  useEffect(() => {
    const checkForLull = () => {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;
      
      const lastMessageTime = new Date(lastMessage.createdAt).getTime();
      const timeSinceLastMessage = Date.now() - lastMessageTime;
      
      // If there's been 20+ seconds since last message (in real system would be longer)
      if (timeSinceLastMessage > 20000 && Math.random() < 0.7) { // 70% chance of AI responding
        // AI response
        const wizardMessage: Message = {
          id: `msg-${Date.now()}`,
          userId: "wizard",
          username: "Wizard of Mods",
          avatarUrl: "/wizard.png",
          content: getAIMessage(),
          isAi: true,
          createdAt: new Date().toISOString(),
          reactions: [],
          upvotes: 0,
          downvotes: 0,
          tags: [],
          brainAwards: 0
        };
        
        setMessages(prev => [...prev, wizardMessage]);
        
        // Add AI notification
        const randomLine = AI_NOTIFICATION_LINES[Math.floor(Math.random() * AI_NOTIFICATION_LINES.length)];
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          messageId: wizardMessage.id,
          type: "ai",
          content: randomLine,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        setNotifications(prev => [...prev, notification]);
      }
    };
    
    // Check for lulls in conversation every 5 seconds
    const interval = setInterval(checkForLull, 5000);
    
    return () => clearInterval(interval);
  }, [messages, currentUser.id]);

  // Helper for AI messages
  const getAIMessage = (): string => {
    const aiMessages = [
      "Have you considered the impact of remote work on company culture? Some studies suggest it can lead to isolation and disconnection. [Source: https://example.com/remote-work-culture]",
      "Remote work may increase productivity for some, but decrease it for others - personality factors play a key role in determining who thrives remotely. [Source: https://example.com/remote-productivity]",
      "What about accessibility? Remote work opens opportunities for people with mobility challenges but may create barriers for those with limited home technology. [Source: https://example.com/remote-accessibility]",
      "Environmental impact is worth considering - less commuting means reduced carbon emissions, but what about increased home energy usage? [Source: https://example.com/remote-environment]",
      "Remote work could reshape urban centers. If knowledge workers leave cities, how might that affect local economies and housing markets? [Source: https://example.com/remote-urban-impact]"
    ];
    
    return aiMessages[Math.floor(Math.random() * aiMessages.length)];
  };

  // Send a message
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
    
    // If linking, potentially award harmony points (simplified for demo)
    if (linkToId) {
      const linkedMessage = messages.find(m => m.id === linkToId);
      if (linkedMessage && linkedMessage.upvotes > 0) {
        // Both users get points
        setCurrentUser(prev => ({
          ...prev,
          harmonyPoints: prev.harmonyPoints + 1
        }));
        
        // Add notification for the linked message author
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          userId: linkedMessage.userId,
          messageId: newMessage.id,
          type: "mention",
          content: `${currentUser.username} linked to your message, earning you harmony points!`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        setNotifications(prev => [...prev, notification]);
      }
    }
  };

  // Add a reaction to a message
  const addReaction = (messageId: string, type: ReactionType, value: string) => {
    const newReaction: Reaction = {
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
    
    // Add notification for the message author
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
      
      setNotifications(prev => [...prev, notification]);
    }
  };

  // Remove a reaction from a message
  const removeReaction = (messageId: string, reactionId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { 
              ...message, 
              reactions: message.reactions.filter(r => r.id !== reactionId) 
            }
          : message
      )
    );
  };

  // Award a Brain to a message
  const awardBrain = (messageId: string) => {
    // Check if user has brain awards left to give
    if (currentUser.brainAwardsGiven >= 3) return; // Limit of 3 per day
    
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, brainAwards: message.brainAwards + 1 }
          : message
      )
    );
    
    // Update current user's brain awards given count
    setCurrentUser(prev => ({
      ...prev,
      brainAwardsGiven: prev.brainAwardsGiven + 1
    }));
    
    // Add notification for the message author
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
      
      setNotifications(prev => [...prev, notification]);
    }
  };

  // Upvote a message
  const upvoteMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, upvotes: message.upvotes + 1 }
          : message
      )
    );
    
    // Update harmony points for message author
    const targetMessage = messages.find(m => m.id === messageId);
    if (targetMessage && targetMessage.userId !== currentUser.id) {
      // Add notification
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetMessage.userId,
        messageId,
        type: "reaction",
        content: `${currentUser.username} upvoted your message (+1 harmony point)`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      setNotifications(prev => [...prev, notification]);
    }
  };

  // Downvote a message
  const downvoteMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, downvotes: message.downvotes + 1 }
          : message
      )
    );
  };

  // Mark all notifications as read
  const markNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const contextValue: TurfContextType = {
    currentUser,
    messages,
    notifications,
    currentTopic,
    pinnedMessageId,
    unreadNotificationsCount,
    darkMode,
    sendMessage,
    addReaction,
    removeReaction,
    awardBrain,
    upvoteMessage,
    downvoteMessage,
    markNotificationsAsRead,
    toggleDarkMode
  };

  return (
    <TurfContext.Provider value={contextValue}>
      {children}
    </TurfContext.Provider>
  );
};

// Custom hook to use the Turf context
export const useTurf = () => {
  const context = useContext(TurfContext);
  if (!context) {
    throw new Error("useTurf must be used within a TurfProvider");
  }
  return context;
};
