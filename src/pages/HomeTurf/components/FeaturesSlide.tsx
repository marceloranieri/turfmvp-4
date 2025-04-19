
import React from 'react';

const FeaturesSlide: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 text-center">
      <div className="bg-secondary/30 p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-3">✨ Harmony Points</h2>
        <p className="mb-4">Earn points when people upvote your comments or link to them in their own replies!</p>
        <div className="flex justify-center gap-4 mb-2">
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
      
      <div className="bg-secondary/30 p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-3">🧠 Genius Award</h2>
        <p className="mb-4">Award up to 3 points daily to recognize insightful contributions!</p>
        <div className="text-gold font-bold">
          Most Genius Awards = Debate Leaders ⭐
        </div>
      </div>
    </div>
  );
};

export default FeaturesSlide;
