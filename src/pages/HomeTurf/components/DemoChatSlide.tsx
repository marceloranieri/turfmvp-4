
import React from 'react';

const DEMO_MESSAGES = [
  {
    username: "Alice",
    content: "Remote work boosts productivity by eliminating commute time.",
    upvotes: 3,
    harmonyPoints: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
  },
  {
    username: "Bob",
    content: "It also cuts commuting stress and reduces carbon emissions.",
    upvotes: 2,
    harmonyPoints: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
  },
  {
    username: "Wizard of Mods 🧙",
    content: "But what about team culture? Remote work can lead to isolation. Studies show workplace relationships matter for engagement.",
    isAI: true,
    avatar: "/wizard.png"
  }
];

const DemoChatSlide: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Daily Topic: Remote Work - Yay or Nay?</h2>
      <div className="flex-grow bg-secondary/30 rounded-lg p-4 overflow-y-auto mb-6">
        {DEMO_MESSAGES.map((msg, i) => (
          <div key={i} className={`mb-6 ${msg.isAI ? 'bg-ai/10 p-3 rounded-lg' : ''}`}>
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
              </div>
              <div className="font-medium">
                {msg.username}
                {msg.isAI && <span className="ml-1 text-ai font-bold">AI</span>}
              </div>
            </div>
            <p className="pl-10">{msg.content}</p>
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
      <p className="text-center mb-4">Try upvoting or downvoting to see how Harmony Points work!</p>
    </div>
  );
};

export default DemoChatSlide;
