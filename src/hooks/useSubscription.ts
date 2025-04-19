
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useSubscription = (
  channelName: string, 
  table: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE', 
  handler: (payload: any) => void,
  filter?: Record<string, any>
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create a channel with the specified name
    const channel = supabase.channel(channelName);
    
    // Configure channel to listen for Postgres changes
    let subscription = channel.on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: table,
        ...(filter || {})
      },
      handler
    );
    
    // Subscribe to the channel
    subscription.subscribe();
    
    // Store the channel reference for cleanup
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, table, event, handler, filter]);
};

export default useSubscription;
