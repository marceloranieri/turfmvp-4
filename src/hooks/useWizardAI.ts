
import { useCallback } from 'react';
import { Message, Notification } from '../types/turf';
import { AI_MESSAGES, AI_NOTIFICATION_LINES } from '../constants/turf';

export const useWizardAI = (
  messages: Message[],
  currentUserId: string,
  onNewMessage: (message: Message) => void,
  onNewNotification: (notification: Notification) => void
) => {
  const checkForLull = useCallback(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;
    
    const lastMessageTime = new Date(lastMessage.createdAt).getTime();
    const timeSinceLastMessage = Date.now() - lastMessageTime;
    
    if (timeSinceLastMessage > 20000 && Math.random() < 0.7) {
      const wizardMessage: Message = {
        id: `msg-${Date.now()}`,
        userId: "wizard",
        username: "Wizard of Mods",
        avatarUrl: "/wizard.png",
        content: AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)],
        isAi: true,
        createdAt: new Date().toISOString(),
        reactions: [],
        upvotes: 0,
        downvotes: 0,
        tags: [],
        brainAwards: 0
      };
      
      onNewMessage(wizardMessage);
      
      const randomLine = AI_NOTIFICATION_LINES[Math.floor(Math.random() * AI_NOTIFICATION_LINES.length)];
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: currentUserId,
        messageId: wizardMessage.id,
        type: "ai",
        content: randomLine,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      onNewNotification(notification);
    }
  }, [messages, currentUserId, onNewMessage, onNewNotification]);

  return { checkForLull };
};
