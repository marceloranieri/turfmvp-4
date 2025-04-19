
import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface GeniusAwardStatsProps {
  count: number;
}

const GeniusAwardStats: React.FC<GeniusAwardStatsProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-1.5 text-gold">
      <BrainCircuit className="h-4 w-4" />
      <span className="text-xs font-medium">
        {count} Genius Award{count > 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default GeniusAwardStats;
