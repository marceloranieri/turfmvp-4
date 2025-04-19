
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Plus, Send, Smile, Gift, Link2, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MessageComposer: React.FC = () => {
  const { sendMessage, currentUser, currentTopic } = useTurf();
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="border-t border-border p-3 bg-card">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="rounded-full shrink-0"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Upload file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message the debate${currentTopic ? `: ${currentTopic.title}` : '...'}`}
            className="w-full px-4 py-2.5 rounded-md bg-muted border-0 text-foreground focus:ring-0 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full shrink-0"
                >
                  <AtSign className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Mention user</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full shrink-0"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Add emoji</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full shrink-0"
                >
                  <Gift className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Add GIF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full shrink-0"
                >
                  <Link2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Link to message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full shrink-0",
                    message.trim() ? "text-primary" : "text-muted-foreground"
                  )}
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;
