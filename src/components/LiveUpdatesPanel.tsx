
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Trophy, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const LiveUpdatesPanel: React.FC = () => {
  const { messages } = useTurf();
  
  const userAwards = messages ? messages.reduce((acc: Record<string, {username: string, avatarUrl: string, count: number}>, message) => {
    if (message.brainAwards > 0) {
      if (!acc[message.userId]) {
        acc[message.userId] = {
          username: message.username,
          avatarUrl: message.avatarUrl,
          count: 0
        };
      }
      acc[message.userId].count += message.brainAwards;
    }
    return acc;
  }, {}) : {};
  
  const topUsers = Object.values(userAwards)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="w-60 hidden lg:block border-l border-border bg-card h-full p-4">
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3 flex items-center gap-1">
            <Trophy className="h-3 w-3" /> 
            <span>DEBATE LEADERS</span>
          </div>
          
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.count} Genius Award{user.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUpdatesPanel;

