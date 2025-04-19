
import React from 'react';
import VoteStats from './stats/VoteStats';
import GeniusAwardStats from './stats/GeniusAwardStats';

interface MessageStatsProps {
  upvotes: number;
  downvotes: number;
  brainAwards: number;
}

const MessageStats: React.FC<MessageStatsProps> = ({
  upvotes,
  downvotes,
  brainAwards
}) => {
  return (
    <>
      <VoteStats upvotes={upvotes} downvotes={downvotes} />
      <GeniusAwardStats count={brainAwards} />
    </>
  );
};

export default MessageStats;
