
import React from 'react';
import { DEMO_MESSAGES } from '@/constants/demo';
import MessagePreview from './MessagePreview';

const DemoChatSlide: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Daily Topic: Remote Work - Yay or Nay?</h2>
      <div className="flex-grow bg-secondary/30 rounded-lg p-4 overflow-y-auto mb-6">
        {DEMO_MESSAGES.map((msg, i) => (
          <MessagePreview
            key={i}
            username={msg.username}
            content={msg.content}
            upvotes={msg.upvotes}
            harmonyPoints={msg.harmonyPoints}
            avatar={msg.avatar}
            isAI={msg.isAI}
          />
        ))}
      </div>
      <p className="text-center mb-4">Try upvoting or downvoting to see how Harmony Points work!</p>
    </div>
  );
};

export default DemoChatSlide;
