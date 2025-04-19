import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWizardAI } from '../hooks/useWizardAI';
import { MOCK_CURRENT_USER, INITIAL_TOPIC } from '../constants/turf';
import { 
  TurfContextType, 
  Message, 
  User, 
  Notification,
  ReactionType,
  DebatePhase,
  DebateTopic
} from '../types/turf';

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

// Update INITIAL_TOPIC to use the DebatePhase enum
const INITIAL_TOPIC_FIXED: DebateTopic = {
  id: "topic-1",
  title: "Is remote work here to stay post-pandemic?",
  description: "Discuss the long-term viability of remote work arrangements and their impact on productivity, well-being, and organizational culture.",
  currentPhase: DebatePhase.OPENING_ARGUMENTS,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

export const TurfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [currentTopic, setCurrentTopic] = useState<DebateTopic>(INITIAL_TOPIC_FIXED);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Setup AI wizard
  const { checkForLull } = useWizardAI(
    messages,
    currentUser.id,
    (message) => setMessages(prev => [...prev, message]),
    (notification) => setNotifications(prev => [...prev, notification])
  );

  // Effect for pinning messages
  useEffect(() => {
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
  useEffect(() => {
    const interval = setInterval(checkForLull, 5000);
    return () => clearInterval(interval);
  }, [checkForLull]);

  // Message actions
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
        setCurrentUser(prev => ({
          ...prev,
          harmonyPoints: prev.harmonyPoints + 1
        }));
        
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

  const addReaction = (messageId: string, type: ReactionType, value: string) => {
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
      
      setNotifications(prev => [...prev, notification]);
    }
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

  const awardBrain = (messageId: string) => {
    if (currentUser.brainAwardsGiven >= 3) return;
    
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, brainAwards: message.brainAwards + 1 }
          : message
      )
    );
    
    setCurrentUser(prev => ({
      ...prev,
      brainAwardsGiven: prev.brainAwardsGiven + 1
    }));
    
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

  const upvoteMessage = (messageId: string) => {
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
      
      setNotifications(prev => [...prev, notification]);
    }
  };

  const downvoteMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId
          ? { ...message, downvotes: message.downvotes + 1 }
          : message
      )
    );
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

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

export const useTurf = () => {
  const context = useContext(TurfContext);
  if (!context) {
    throw new Error("useTurf must be used within a TurfProvider");
  }
  return context;
};
