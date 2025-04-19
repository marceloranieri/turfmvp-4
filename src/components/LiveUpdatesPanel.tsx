
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Users, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LiveUpdatesPanel: React.FC = () => {
  const { messages } = useTurf();
  
  // Get users with the most brain awards
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
    .slice(0, 5);
  
  return (
    <div className="w-60 hidden lg:block border-l border-border h-full bg-card overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Debate Stats</h3>
        </div>
        
        {/* Top contributors by brain awards */}
        <div className="mb-6">
          <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3">
            TOP CONTRIBUTORS
          </div>
          
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.username}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {index === 0 && <Crown className="h-3 w-3 text-gold" />}
                    <span>{user.count} Brain Award{user.count > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current activity */}
        <div>
          <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3">
            ACTIVE NOW
          </div>
          
          <div className="text-xs text-muted-foreground">
            {messages ? messages.length : 0} messages in debate
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUpdatesPanel;
