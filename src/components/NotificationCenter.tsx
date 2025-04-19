
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
          
          {/* Dialog */}
          <div className="fixed right-4 top-16 w-80 max-h-[80vh] bg-background border border-border shadow-lg z-50 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-3 border-b border-border">
                      <div className="text-sm">{notification.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;
