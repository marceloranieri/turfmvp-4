
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Bell, X, CheckCheck, Award, Link2 as LinkIcon, MessageSquare, Pin, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Design tokens following Discord-inspired system
const tokens = {
  colors: {
    primary: 'var(--primary)',
    background: 'var(--background)',
    backgroundHover: 'var(--accent)',
    text: 'var(--foreground)',
    textMuted: 'var(--muted-foreground)',
  }
};

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useTurf();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => {
    setIsOpen(true);
    markNotificationsAsRead();
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reaction': return <MessageSquare className="h-4 w-4" />;
      case 'reply': return <MessageSquare className="h-4 w-4" />;
      case 'mention': return <LinkIcon className="h-4 w-4" />;
      case 'award': return <Award className="h-4 w-4" />;
      case 'pin': return <Pin className="h-4 w-4" />;
      case 'ai': return <Bot className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reaction': return 'text-blue-400';
      case 'reply': return 'text-green-400';
      case 'mention': return 'text-purple-400';
      case 'award': return 'text-gold';
      case 'pin': return 'text-amber-400';
      case 'ai': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };
  
  return (
    <>
      {/* Hidden checkbox for controlling modal visibility */}
      <input 
        type="checkbox" 
        id="notification-dialog" 
        className="hidden" 
        checked={isOpen}
        onChange={handleOpen}
      />
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Dialog */}
          <div className="fixed right-4 top-16 w-96 max-h-[80vh] bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-xl z-50 overflow-hidden flex flex-col animate-fade-in">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2 text-white">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={markNotificationsAsRead}>
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 max-h-[60vh]">
              {notifications && notifications.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {notifications.map(notification => (
                    <div key={notification.id} className={cn(
                      "p-3 hover:bg-white/5 transition-colors",
                      !notification.isRead && "bg-primary/10"
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full bg-black/30",
                          getNotificationColor(notification.type)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/90">{notification.content}</div>
                          <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                            <span>{format(new Date(notification.createdAt), 'h:mm a')}</span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-white/60">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 text-center">
              <Button variant="ghost" size="sm" className="text-xs w-full hover:bg-white/10" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;
