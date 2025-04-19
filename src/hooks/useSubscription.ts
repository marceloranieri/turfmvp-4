
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
    const channel = supabase.channel(channelName);
    
    channel
      .on(
        'postgres_changes' as any,  // Type assertion to fix TS error
        {
          event: event,
          schema: 'public',
          table: table,
          ...(filter || {})
        },
        handler
      )
      .subscribe();
    
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, table, event, handler, filter]);
};

export default useSubscription;
