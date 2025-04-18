
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Bell, Search, Settings, Home } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const CompactSidebarNav: React.FC = () => {
  const { currentUser, unreadNotificationsCount, toggleDarkMode } = useTurf();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="py-2 flex flex-col gap-2">
          {/* User info */}
          <div className="px-3 mb-2">
            <Avatar className="h-12 w-12 mx-auto">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback>{currentUser?.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center mt-1 font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {currentUser?.username}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              HP: {currentUser?.harmonyPoints}
            </div>
          </div>
          
          <div className="border-t border-sidebar-border my-1"></div>
          
          {/* Navigation icons */}
          <ul className="flex flex-col items-center gap-1 px-1">
            <li className="w-full">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-12 rounded-md flex justify-center"
              >
                <Home className="h-6 w-6" />
              </Button>
            </li>
            <li className="w-full">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-12 rounded-md flex justify-center"
              >
                <Search className="h-6 w-6" />
              </Button>
            </li>
            <li className="w-full relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-12 rounded-md flex justify-center"
                asChild
              >
                <label htmlFor="notification-dialog">
                  <Bell className="h-6 w-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
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
                className="w-full h-12 rounded-md flex justify-center"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </li>
          </ul>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  );
};

export default CompactSidebarNav;
