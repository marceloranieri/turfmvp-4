
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTurf } from '@/contexts/TurfContext';
import { Home, Bell, Search, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CompactSidebarNav: React.FC = () => {
  const { currentUser } = useTurf();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="h-full w-[72px] flex flex-col items-center py-4 bg-[#EDEDEE] border-r border-[#E3E5E8]">
      <div className="flex flex-col items-center gap-2 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-12 h-12 rounded-full ${
                  isActive('/') 
                    ? 'bg-[#00A8FC] text-white' 
                    : 'text-[#2C2F33] hover:bg-[#E3E5E8]'
                }`}
                onClick={() => navigate('/')}
                aria-label="Home"
              >
                <Home className="h-5 w-5" />
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
                className="w-12 h-12 rounded-full hover:bg-muted/30"
                onClick={() => console.log('Notifications clicked')}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
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
                className="w-12 h-12 rounded-full hover:bg-muted/30"
                onClick={() => console.log('Search clicked')}
                aria-label="Search"
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
                className="w-12 h-12 rounded-full hover:bg-muted/30"
                onClick={() => navigate('/settings')}
                aria-label="Settings"
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
      
      <div className="mt-auto relative flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full ${isActive('/calendar') ? 'bg-primary/10' : 'hover:bg-muted/30'}`}
                onClick={() => navigate('/calendar')}
                aria-label="Debate Calendar"
              >
                <Calendar className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Debate Calendar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-12 h-12 rounded-full p-0 hover:bg-muted/30" 
                onClick={() => navigate('/profile')}
                aria-label="Profile"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>{currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{currentUser?.username || 'Profile'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CompactSidebarNav;
