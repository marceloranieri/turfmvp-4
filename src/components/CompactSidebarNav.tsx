
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Bell, Search, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CompactSidebarNav: React.FC = () => {
  const { currentUser, unreadNotificationsCount } = useTurf();
  
  return (
    <div className="h-full w-full flex flex-col items-center py-4">
      {/* User info */}
      <div className="px-3 mb-6">
        <Avatar className="h-12 w-12 mx-auto">
          <AvatarImage src={currentUser?.avatarUrl} />
          <AvatarFallback>{currentUser?.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center mt-1 font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px]">
          {currentUser?.username}
        </div>
        <div className="text-center text-xs text-muted-foreground">
          HP: {currentUser?.harmonyPoints}
        </div>
      </div>
      
      <div className="border-t border-sidebar-border w-3/4 my-1"></div>
      
      {/* Navigation icons */}
      <ul className="flex flex-col items-center gap-3 px-2 mt-4">
        <li className="w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-md flex justify-center"
          >
            <Home className="h-5 w-5" />
          </Button>
        </li>
        <li className="w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-md flex justify-center"
          >
            <Search className="h-5 w-5" />
          </Button>
        </li>
        <li className="w-full relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-md flex justify-center"
            asChild
          >
            <label htmlFor="notification-dialog">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </label>
          </Button>
        </li>
        <li className="w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-md flex justify-center"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default CompactSidebarNav;
