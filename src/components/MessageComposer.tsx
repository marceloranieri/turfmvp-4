
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Send } from 'lucide-react';
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
    <div className="border-t border-border py-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message the debate..."
            className="w-full px-4 py-2.5 bg-secondary border-0 text-foreground focus:outline-none"
          />
        </div>
        
        <Button 
          type="submit" 
          variant="ghost" 
          disabled={!message.trim()}
          className="text-primary"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default MessageComposer;
