
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for managing brain awards for users
 * Users can award up to 3 brain awards per day
 */
export const useBrainAwards = (userId: string) => {
  const [awardsGiven, setAwardsGiven] = useState(0);
  const [awardsReceived, setAwardsReceived] = useState(0);
  const [hasMaestroBadge, setHasMaestroBadge] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get the current day's start timestamp
  const getDayStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  };
  
  // Check if user has hit their daily award limit
  const checkCanAward = useCallback(() => {
    return awardsGiven < 3;
  }, [awardsGiven]);
  
  // Awards left to give today
  const awardsLeft = useCallback(() => {
    return Math.max(0, 3 - awardsGiven);
  }, [awardsGiven]);
  
  // Award a brain to a message
  const awardBrain = useCallback(async (messageId: string, recipientId: string) => {
    if (!checkCanAward()) {
      toast({
        title: "Limit Reached",
        description: "You've used all your Brain awards for today",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // In a real implementation, this would be stored in Supabase
      // const { error } = await supabase.from('brain_awards').insert({
      //   user_id: userId,
      //   recipient_id: recipientId,
      //   message_id: messageId,
      //   awarded_at: new Date().toISOString()
      // });
      
      // if (error) throw error;
      
      // For now, just update the local state
      setAwardsGiven(prev => prev + 1);
      
      toast({
        title: "Brain Awarded!",
        description: "You awarded a Brain to this message",
      });
      
      return true;
    } catch (error) {
      console.error('Error awarding brain:', error);
      toast({
        title: "Error",
        description: "Failed to award Brain",
        variant: "destructive",
      });
      return false;
    }
  }, [userId, checkCanAward]);
  
  // Check for Debate Maestro status (user with most brains in a topic)
  const checkMaestroBadge = useCallback(async (topicId: string) => {
    try {
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .rpc('get_top_brain_recipient_for_topic', { topic_id: topicId })
      //   .single();
      
      // if (error) throw error;
      
      // Check if this user is the top recipient
      // const isMaestro = data?.user_id === userId;
      const isMaestro = awardsReceived > 5; // Dummy logic for demo
      
      setHasMaestroBadge(isMaestro);
      return isMaestro;
    } catch (error) {
      console.error('Error checking maestro status:', error);
      return false;
    }
  }, [userId, awardsReceived]);
  
  // Reset awards count at the start of each day
  useEffect(() => {
    const checkDailyLimit = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('brain_awards')
        //   .select('id')
        //   .eq('user_id', userId)
        //   .gte('awarded_at', getDayStart());
        
        // if (error) throw error;
        
        // Set a default value for the demo
        // setAwardsGiven(data?.length || 0);
        setAwardsGiven(1); // Demo value
        setAwardsReceived(4); // Demo value
      } catch (error) {
        console.error('Error fetching brain awards:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkDailyLimit();
    
    // Reset at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const resetTimer = setTimeout(() => {
      setAwardsGiven(0);
    }, timeUntilMidnight);
    
    return () => clearTimeout(resetTimer);
  }, [userId]);
  
  return {
    awardsGiven,
    awardsReceived,
    awardsLeft,
    hasMaestroBadge,
    loading,
    canAward: checkCanAward(),
    awardBrain,
    checkMaestroBadge
  };
};

export default useBrainAwards;
