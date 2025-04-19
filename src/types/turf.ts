export enum DebatePhase {
  REBUTTALS = "Rebuttals",
  COUNTERPOINTS = "Counterpoints",
  CONCLUSION = "Conclusion"
}

export type ReactionType = 'emoji' | 'gif';
export type MessageTag = 'Sharp Wit' | 'Deep Insight' | 'Valid Question' | 'Strong Evidence' | 'Opening Argument';

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

export interface TurfContextType {
  currentUser: User | null;
  messages: Message[];
  notifications: Notification[];
  currentTopic: DebateTopic | null;
  pinnedMessageId: string | null;
  unreadNotificationsCount: number;
  darkMode: boolean;
  
  sendMessage: (content: string, parentId?: string, linkToId?: string) => void;
  addReaction: (messageId: string, type: ReactionType, value: string) => void;
  removeReaction: (messageId: string, reactionId: string) => void;
  awardBrain: (messageId: string) => void;
  upvoteMessage: (messageId: string) => void;
  downvoteMessage: (messageId: string) => void;
  markNotificationsAsRead: () => void;
  toggleDarkMode: () => void;
  
  // Add these methods to match what's being used in TurfContext.tsx
  updateHarmonyPoints: (points: number) => void;
  updateBrainAwards: () => void;
}
