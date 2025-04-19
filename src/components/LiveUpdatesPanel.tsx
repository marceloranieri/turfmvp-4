
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Users, Crown, Activity, Trophy, Hash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const LiveUpdatesPanel: React.FC = () => {
  const { messages, currentTopic } = useTurf();
  
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
    
  // Get users with most harmony points based on upvotes - downvotes
  const userEngagement = messages ? messages.reduce((acc: Record<string, {username: string, avatarUrl: string, points: number}>, message) => {
    if (!acc[message.userId]) {
      acc[message.userId] = {
        username: message.username,
        avatarUrl: message.avatarUrl,
        points: 0
      };
    }
    
    acc[message.userId].points += (message.upvotes - message.downvotes);
    return acc;
  }, {}) : {};
  
  const engagedUsers = Object.values(userEngagement)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
  
  return (
    <div className="w-60 hidden lg:block border-l border-border h-full bg-card overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Topic Stats</h3>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-xs">
            Discussion
          </Badge>
        </div>

        <div className="space-y-5">
          {/* Top contributors by brain awards */}
          <div>
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> 
              <span>DEBATE MAESTROS</span>
            </div>
            
            <div className="space-y-3">
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate flex items-center">
                        {user.username}
                        {index === 0 && <Crown className="h-3 w-3 text-gold ml-1" />}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{user.count} Brain Award{user.count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  No brain awards yet
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Harmony Leaders */}
          <div>
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3 flex items-center gap-1">
              <Activity className="h-3 w-3" /> 
              <span>HARMONY LEADERS</span>
            </div>
            
            <div className="space-y-3">
              {engagedUsers.length > 0 ? (
                engagedUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {user.username}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className={cn(
                          user.points > 0 ? "text-green-500" : 
                          user.points < 0 ? "text-red-500" : ""
                        )}>
                          {user.points > 0 ? "+" : ""}{user.points} HP
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  No harmony points yet
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Current activity */}
          <div>
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-3 flex items-center gap-1">
              <Users className="h-3 w-3" /> 
              <span>ACTIVE NOW</span>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Messages in debate:</span>
                <span className="font-medium">{messages?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active participants:</span>
                <span className="font-medium">{Object.keys(userEngagement || {}).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Brain awards given:</span>
                <span className="font-medium">{topUsers.reduce((sum, user) => sum + user.count, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUpdatesPanel;
