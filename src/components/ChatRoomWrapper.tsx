
import React from 'react';
import { TurfProvider } from '@/contexts/TurfContext';
import CurrentTopicHeader from './CurrentTopicHeader';
import MessageThread from './MessageThread';
import MessageComposer from './MessageComposer';
import PinnedHighlightBanner from './PinnedHighlightBanner';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';

const ChatRoomWrapper: React.FC = () => {
  return (
    <TurfProvider>
      <div className="flex min-h-screen bg-background dark:bg-background">
        {/* Single-column centered container */}
        <div className="minimal-container flex flex-col w-full max-w-[400px] mx-auto">
          {/* Pinned message banner */}
          <PinnedHighlightBanner />
          
          {/* Topic header */}
          <CurrentTopicHeader />
          
          {/* Messages area */}
          <div className="flex-grow flex flex-col overflow-hidden">
            <MessageThread />
            <MessageComposer />
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
