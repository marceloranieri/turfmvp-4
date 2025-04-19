
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft, LogOut, Moon, Sun } from 'lucide-react';
import { useTurf } from '@/contexts/TurfContext';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type NotificationType = 'all' | 'mentions' | 'off';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTurf();
  
  const [notificationType, setNotificationType] = useState<NotificationType>('all');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const handleLogout = () => {
    // In a real app, this would sign out with Supabase Auth
    setTimeout(() => {
      navigate('/auth?mode=signin');
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 text-muted-foreground"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Debate
            </Button>
            
            <h1 className="text-2xl font-bold mb-8">Settings</h1>
            
            <div className="space-y-6">
              {/* Notifications Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="all-notifications" className="flex-grow cursor-pointer">
                      All notifications
                    </Label>
                    <Switch 
                      id="all-notifications" 
                      checked={notificationType === 'all'}
                      onCheckedChange={() => setNotificationType('all')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentions-notifications" className="flex-grow cursor-pointer">
                      Mentions only
                    </Label>
                    <Switch 
                      id="mentions-notifications" 
                      checked={notificationType === 'mentions'}
                      onCheckedChange={() => setNotificationType('mentions')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="off-notifications" className="flex-grow cursor-pointer">
                      Turn off notifications
                    </Label>
                    <Switch 
                      id="off-notifications" 
                      checked={notificationType === 'off'}
                      onCheckedChange={() => setNotificationType('off')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-gold" />
                    ) : (
                      <Sun className="h-5 w-5 text-gold" />
                    )}
                    <Label htmlFor="theme-toggle" className="font-medium">
                      {darkMode ? 'Dark Theme' : 'Light Theme'}
                    </Label>
                  </div>
                  <Switch 
                    id="theme-toggle" 
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <Button 
                  variant="destructive-outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to participate in the debate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
