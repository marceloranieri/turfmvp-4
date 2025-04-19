
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Custom hook for managing Supabase real-time subscriptions
 * Ensures proper cleanup of subscriptions on component unmount
 */
export const useSubscription = (
  channelName: string, 
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE', 
  handler: (payload: any) => void,
  filter?: Record<string, any>
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create a channel with the specific name
    let channel = supabase.channel(channelName);
    
    // Add the postgres_changes listener
    channel = channel.on(
      'postgres_changes',
      { 
        event, 
        schema: 'public', 
        table,
        ...(filter || {}) 
      },
      handler
    );
    
    // Subscribe to the channel
    channel.subscribe();
    
    // Store the reference for cleanup
    channelRef.current = channel;

    return () => {
      console.log(`Cleaning up subscription to ${channelName}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, table, event, handler, filter]);
};

export default useSubscription;
