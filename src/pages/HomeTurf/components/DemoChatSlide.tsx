
import React from 'react';
import { DEMO_MESSAGES } from '@/constants/demo';

const DemoChatSlide: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        Daily Topic: Remote Work - Yay or Nay?
      </h2>
      <div className="flex-grow bg-black/20 backdrop-blur-sm rounded-lg p-4 overflow-y-auto mb-6 border border-white/5">
        {DEMO_MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={`mb-6 ${msg.isAI ? 'bg-ai/10 p-3 rounded-lg border border-ai/20' : ''}`}
          >
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-white/10">
                <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
              </div>
              <div className="font-medium">
                {msg.username}
                {msg.isAI && <span className="ml-1 text-ai font-bold">AI</span>}
              </div>
            </div>
            <p className="pl-10 text-white/90">{msg.content}</p>
            {msg.upvotes && (
              <div className="pl-10 mt-2 flex items-center">
                <span className="text-sm text-muted-foreground mr-3">
                  👍 {msg.upvotes}
                </span>
                <span className="text-sm text-gold">
                  ✨ {msg.harmonyPoints} Harmony Points
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center mb-4 text-muted-foreground">
        Try upvoting or downvoting to see how Harmony Points work!
      </p>
    </div>
  );
};

export default DemoChatSlide;
