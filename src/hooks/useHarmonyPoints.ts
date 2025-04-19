
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HarmonyPointReason, HarmonyPointEvent } from '@/types/turf';
import { toast } from '@/hooks/use-toast';
import { withErrorHandling } from '@/utils/errorHandling';

/**
 * Custom hook for managing user harmony points
 */
export const useHarmonyPoints = (userId: string, initialPoints = 0) => {
  const [harmonyPoints, setHarmonyPoints] = useState<number>(initialPoints);
  const [pointEvents, setPointEvents] = useState<HarmonyPointEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Award harmony points to a user with a specific reason
   */
  const awardPoints = useCallback(async (
    amount: number,
    reason: HarmonyPointReason,
    relatedMessageId?: string
  ) => {
    setIsLoading(true);
    
    try {
      // Create the point event object
      const pointEvent: HarmonyPointEvent = {
        id: `point-${Date.now()}`,
        userId,
        amount,
        reason,
        createdAt: new Date().toISOString(),
        relatedMessageId
      };
      
      // In a real implementation, this would be stored in Supabase
      // await supabase
      //   .from('harmony_point_events')
      //   .insert({
      //     user_id: userId,
      //     amount,
      //     reason,
      //     related_message_id: relatedMessageId
      //   });
      
      // For now, just update the local state
      setPointEvents(prev => [...prev, pointEvent]);
      setHarmonyPoints(prev => prev + amount);
      
      // Show toast for positive points
      if (amount > 0) {
        toast({
          title: "Harmony Points Earned",
          description: `You earned ${amount} harmony points!`,
          variant: "default",
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error awarding harmony points:', error);
      toast({
        title: "Error",
        description: "Failed to update harmony points",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  /**
   * Calculate the total harmony points from all events
   */
  const calculateTotalPoints = useCallback(() => {
    return pointEvents.reduce((total, event) => total + event.amount, 0);
  }, [pointEvents]);
  
  /**
   * Award points for a specific type of contribution
   */
  const awardForUpvote = useCallback((messageId: string) => {
    return awardPoints(1, 'audience_reaction', messageId);
  }, [awardPoints]);
  
  const penalizeForDownvote = useCallback((messageId: string) => {
    return awardPoints(-1, 'audience_reaction', messageId);
  }, [awardPoints]);
  
  const awardForBrainAward = useCallback((messageId: string) => {
    return awardPoints(5, 'brain_award', messageId);
  }, [awardPoints]);
  
  const awardForInitialPost = useCallback((messageId: string) => {
    return awardPoints(1, 'initial_post', messageId);
  }, [awardPoints]);
  
  const awardForQualityContribution = useCallback((messageId: string) => {
    return awardPoints(2, 'quality_contribution', messageId);
  }, [awardPoints]);

  return {
    harmonyPoints,
    pointEvents,
    isLoading,
    awardPoints,
    calculateTotalPoints,
    awardForUpvote,
    penalizeForDownvote,
    awardForBrainAward,
    awardForInitialPost,
    awardForQualityContribution
  };
};

export default useHarmonyPoints;
