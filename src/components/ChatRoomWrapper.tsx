
import React from 'react';
import { TurfProvider } from '@/contexts/TurfContext';
import CurrentTopicHeader from './CurrentTopicHeader';
import CompactSidebarNav from './CompactSidebarNav';
import MessageThread from './MessageThread';
import MessageComposer from './MessageComposer';
import LiveUpdatesPanel from './LiveUpdatesPanel';
import PinnedHighlightBanner from './PinnedHighlightBanner';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';

const ChatRoomWrapper: React.FC = () => {
  return (
    <TurfProvider>
      <div className="flex w-full h-screen bg-background dark:bg-background">
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
            <div className="flex-grow flex flex-col overflow-hidden">
              <MessageThread />
              <MessageComposer />
            </div>
            
            {/* Right sidebar - updates, activity, etc. (hidden on mobile) */}
            <LiveUpdatesPanel />
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
  );
};

export default ChatRoomWrapper;
