
import { useState, useEffect } from 'react';
import { Message, Notification } from '@/types/turf';
import { useNotifications } from '@/contexts/NotificationsContext';

export const usePinnedMessage = (
  messages: Message[],
  onNotification: (notification: Notification) => void
) => {
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [lastPinTime, setLastPinTime] = useState<number>(0);
  const notificationsContext = useNotifications();

  useEffect(() => {
    const checkAndPinMessage = () => {
      const currentTime = Date.now();
      
      if (currentTime - lastPinTime < 300000) {
        console.log("Skipping pin check - not yet 5 minutes since last pin");
        return;
      }
      
      console.log("Checking for messages to pin");
      
      const candidateMessages = messages
        .filter(msg => 
          !msg.isAi && 
          new Date(msg.createdAt).getTime() > (Date.now() - 20 * 60 * 1000)
        );
      
      if (candidateMessages.length === 0) {
        console.log("No eligible messages to pin");
        return;
      }
      
      const sortedMessages = [...candidateMessages].sort((a, b) => {
        const getRepliesCount = (msgId: string) => 
          messages.filter(m => m.parentId === msgId).length;
          
        const engagementA = a.upvotes + getRepliesCount(a.id) + a.reactions.length;
        const engagementB = b.upvotes + getRepliesCount(b.id) + b.reactions.length;
        
        return engagementB - engagementA;
      });
      
      const topMessage = sortedMessages[0];
      const topMessageReplies = messages.filter(m => m.parentId === topMessage.id).length;
      
      console.log(`Pinning message with id: ${topMessage.id}, ${topMessage.upvotes} upvotes and ${topMessageReplies} replies`);
      
      setPinnedMessageId(topMessage.id);
      setLastPinTime(currentTime);
      
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
      onNotification(notification);
      
      setTimeout(() => {
        setPinnedMessageId(null);
        console.log("Unpinned message after 30 seconds");
      }, 30000);
    };

    const initialTimeout = setTimeout(() => {
      console.log("Initial pin check");
      checkAndPinMessage();
    }, 10000);
    
    const interval = setInterval(checkAndPinMessage, 60000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [messages, notificationsContext, lastPinTime, onNotification]);

  return { pinnedMessageId };
};
