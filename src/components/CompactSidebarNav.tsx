
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Bell, Search, Settings, Home, Users, MessageSquare, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CompactSidebarNav: React.FC = () => {
  const { currentUser, unreadNotificationsCount } = useTurf();
  
  return (
    <div className="h-full w-full flex flex-col items-center py-4 bg-sidebar">
      {/* Turf logo */}
      <div className="px-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-2xl font-bold text-black">
          T
        </div>
      </div>
      
      <div className="border-t border-sidebar-border w-3/4 my-1"></div>
      
      {/* Navigation icons */}
      <div className="flex flex-col items-center gap-2 px-2 mt-4 flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full bg-primary flex justify-center"
              >
                <Home className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Debates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center"
              >
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Top Debaters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center"
              >
                <Calendar className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Upcoming Topics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex-1"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center"
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center relative"
                asChild
              >
                <label htmlFor="notification-dialog">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </label>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full hover:bg-muted/30 flex justify-center"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* User profile */}
      <div className="mt-auto px-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-12 h-12 rounded-full p-0 hover:bg-muted/30" 
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>{currentUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-center">
                <p>{currentUser?.username}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.harmonyPoints} Harmony Points
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CompactSidebarNav;
