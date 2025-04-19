
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/turf';

/**
 * Custom hook to manage the Pincredible feature that automatically
 * pins high-engagement messages
 */
export const usePincredible = (
  messages: Message[], 
  onPinMessage: (messageId: string | null) => void
) => {
  const [isPincredibleActive, setIsPincredibleActive] = useState(true);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  
  // Calculate engagement score (upvotes + replies)
  const calculateEngagement = useCallback((message: Message) => {
    // Don't consider AI messages for pinning
    if (message.isAi) return -1;
    
    // Count upvotes and replies
    const upvotes = message.upvotes || 0;
    
    // In a real implementation, we'd count replies here
    const replies = messages.filter(m => m.parentId === message.id).length;
    
    return upvotes + replies;
  }, [messages]);
  
  // Find the message with the highest engagement in the last 20 minutes
  const findTopMessage = useCallback(() => {
    if (!messages || messages.length === 0) return null;
    
    // Get messages from the past 20 minutes
    const cutoffTime = new Date(Date.now() - 20 * 60 * 1000).toISOString();
    const recentMessages = messages.filter(msg => msg.createdAt > cutoffTime);
    
    if (recentMessages.length === 0) return null;
    
    // Sort by engagement score
    const sortedMessages = [...recentMessages].sort(
      (a, b) => calculateEngagement(b) - calculateEngagement(a)
    );
    
    // Return the top message if it has some engagement
    const topMessage = sortedMessages[0];
    return calculateEngagement(topMessage) > 0 ? topMessage.id : null;
  }, [messages, calculateEngagement]);
  
  // Run the Pincredible algorithm every 5 minutes
  useEffect(() => {
    if (!isPincredibleActive) return;
    
    // Schedule the first check
    const intervalId = setInterval(() => {
      const topMessageId = findTopMessage();
      
      // If we found a top message and it's different from the currently pinned message
      if (topMessageId && topMessageId !== pinnedMessageId) {
        setPinnedMessageId(topMessageId);
        onPinMessage(topMessageId);
        
        // Unpin after 30 seconds
        setTimeout(() => {
          setPinnedMessageId(null);
          onPinMessage(null);
        }, 30 * 1000);
      }
    }, 5 * 60 * 1000); // Run every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [isPincredibleActive, findTopMessage, pinnedMessageId, onPinMessage]);
  
  // Toggle the Pincredible feature on/off
  const togglePincredible = useCallback(() => {
    setIsPincredibleActive(prev => !prev);
  }, []);
  
  // Manually pin a message
  const pinMessage = useCallback((messageId: string | null) => {
    setPinnedMessageId(messageId);
    onPinMessage(messageId);
    
    // If pinning a message, set a timer to unpin after 30 seconds
    if (messageId) {
      setTimeout(() => {
        setPinnedMessageId(null);
        onPinMessage(null);
      }, 30 * 1000);
    }
  }, [onPinMessage]);
  
  return {
    isPincredibleActive,
    pinnedMessageId,
    togglePincredible,
    pinMessage
  };
};

export default usePincredible;
