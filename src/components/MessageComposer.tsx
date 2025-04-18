
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Plus, Send, Smile, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessageComposer: React.FC = () => {
  const { sendMessage } = useTurf();
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="border-t border-border p-4 bg-card">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="rounded-full shrink-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message the debate..."
            className="w-full px-4 py-2.5 rounded-md bg-muted border-0 text-foreground focus:ring-0 focus:outline-none"
          />
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="rounded-full shrink-0"
        >
          <Smile className="h-5 w-5" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="rounded-full shrink-0"
        >
          <Gift className="h-5 w-5" />
        </Button>
        
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="rounded-full shrink-0 text-primary"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default MessageComposer;
