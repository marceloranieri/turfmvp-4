
import { Message, Notification, ReactionType } from '@/types/turf';

export const useMessageOperations = (
  messages: Message[],
  currentUserId: string,
  onNotification: (notification: Notification) => void
) => {
  const addReaction = (messageId: string, type: ReactionType, value: string) => {
    const newReaction = {
      id: `reaction-${Date.now()}`,
      userId: currentUserId,
      username: messages.find(m => m.userId === currentUserId)?.username || '',
      type,
      value
    };
    
    const targetMessage = messages.find(m => m.id === messageId);
    if (targetMessage && targetMessage.userId !== currentUserId) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetMessage.userId,
        messageId,
        type: "reaction",
        content: `${newReaction.username} reacted to your message with ${value}`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      onNotification(notification);
    }
    
    return newReaction;
  };

  const upvoteMessage = (messageId: string) => {
    const targetMessage = messages.find(m => m.id === messageId);
    if (targetMessage && targetMessage.userId !== currentUserId) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetMessage.userId,
        messageId,
        type: "reaction",
        content: `Someone upvoted your message (+1 harmony point)`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      onNotification(notification);
    }
  };

  const awardBrain = (messageId: string) => {
    const targetMessage = messages.find(m => m.id === messageId);
    if (targetMessage) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetMessage.userId,
        messageId,
        type: "award",
        content: `Someone awarded your message a Brain! 🧠`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      onNotification(notification);
    }
  };

  return {
    addReaction,
    upvoteMessage,
    awardBrain
  };
};
