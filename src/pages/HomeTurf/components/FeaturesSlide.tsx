
import React from 'react';

const FeaturesSlide: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 text-center">
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg max-w-md border border-white/10">
        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          ✨ Harmony Points
        </h2>
        <p className="mb-4 text-white/80">
          Earn points when people upvote your comments or link to them in their own replies!
        </p>
        <div className="flex justify-center gap-4 mb-2 text-gold">
          <div className="flex items-center">
            <span className="text-lg mr-1">👍</span>
            <span>+1 point</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg mr-1">🔗</span>
            <span>+1 for both</span>
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg max-w-md border border-white/10">
        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          🧠 Brain Awards
        </h2>
        <p className="mb-4 text-white/80">
          Award up to 3 Brains daily to recognize insightful contributions!
        </p>
        <div className="text-gold font-bold">
          Most Brains = Debate Maestro ⭐
        </div>
      </div>
    </div>
  );
};

export default FeaturesSlide;
