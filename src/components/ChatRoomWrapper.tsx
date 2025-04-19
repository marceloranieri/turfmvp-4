
import React, { useEffect } from 'react';
import { TurfProvider } from '@/contexts/TurfContext';
import CurrentTopicHeader from './CurrentTopicHeader';
import CompactSidebarNav from './CompactSidebarNav';
import MessageThread from './MessageThread';
import MessageComposer from './MessageComposer';
import LiveUpdatesPanel from './LiveUpdatesPanel';
import PinnedHighlightBanner from './PinnedHighlightBanner';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { SupabaseErrorBoundary } from './ErrorBoundary';
import { useToast } from '@/hooks/use-toast';

const ChatRoomWrapper: React.FC = () => {
  const { toast } = useToast();
  
  // Example real-time notification handler using our subscription hook
  const handleNewNotification = (payload: any) => {
    const notification = payload.new;
    toast({
      title: "New Notification",
      description: notification.content,
      duration: 5000,
    });
  };
  
  // Subscribe to notifications
  useSubscription(
    'notifications',
    'notifications',
    'INSERT',
    handleNewNotification
  );
  
  return (
    <SupabaseErrorBoundary>
      <TurfProvider>
        <div className="flex w-full h-screen bg-background dark:bg-background overflow-hidden">
          {/* Left sidebar - Discord-like compact navigation */}
          <div className="w-[72px] h-full bg-sidebar border-r border-border flex flex-col">
            <CompactSidebarNav />
          </div>
          
          {/* Main chat column */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Pinned message banner */}
            <PinnedHighlightBanner />
            
            {/* Topic header */}
            <CurrentTopicHeader />
            
            {/* Messages area */}
            <div className="flex flex-grow overflow-hidden">
              {/* Main content that adapts to screen size */}
              <div className="flex-grow flex flex-col overflow-hidden relative">
                <MessageThread />
                <MessageComposer />
              </div>
              
              {/* Right sidebar - updates, activity, etc. (hidden on mobile) */}
              <div className="hidden md:block w-[280px] border-l border-border overflow-y-auto">
                <LiveUpdatesPanel />
              </div>
            </div>
          </div>
          
          {/* Notification Center is a modal/overlay */}
          <NotificationCenter />
          
          {/* Theme toggle for easier testing */}
          <div className="fixed bottom-4 right-4 z-50">
            <ThemeToggle />
          </div>
        </div>
      </TurfProvider>
    </SupabaseErrorBoundary>
  );
};

export default ChatRoomWrapper;
