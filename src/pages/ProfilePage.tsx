
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, ChevronLeft, Save } from 'lucide-react';
import { useTurf } from '@/contexts/TurfContext';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useTurf();
  
  const [username, setUsername] = useState(currentUser?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Basic validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }
    
    // In a real app, this would update user profile in Supabase
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Show success dialog, then redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 1000);
  };
  
  // Generate random avatar if none exists
  const handleGenerateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 8);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };
  
  const getAvatarFallback = () => {
    return username.trim() ? username.charAt(0).toUpperCase() : '?';
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
            
            <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl">{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-sm"
                    onClick={handleGenerateRandomAvatar}
                  >
                    <Camera className="mr-1 h-4 w-4" />
                    Generate Avatar
                  </Button>
                </div>
                
                <div className="w-full space-y-2">
                  <Label htmlFor="avatarUrl" className="text-sm text-muted-foreground">
                    Or enter avatar URL:
                  </Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="bg-secondary/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username (required)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="bg-secondary/30 py-5"
                  maxLength={20}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, unique across Turf
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/20 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-5 transition-transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent>
          <DialogTitle>Profile Updated!</DialogTitle>
          <DialogDescription>
            Your profile has been successfully updated.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => navigate('/')}>
              Return to Debate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
