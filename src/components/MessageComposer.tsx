
import React, { useState } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Smile, Send, Paperclip, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Design tokens following Discord-inspired system
const tokens = {
  colors: {
    primary: 'var(--primary)',
    background: 'var(--background)',
    backgroundHover: 'var(--accent)',
    text: 'var(--foreground)',
    textMuted: 'var(--muted-foreground)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  }
};

// Common emoji options for the emoji picker
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '🙌', '🤔', '😮', '😢'];

const MessageComposer: React.FC = () => {
  const { sendMessage, currentTopic } = useTurf();
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };
  
  return (
    <div className="border-t border-[#E3E5E8] p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-[#F6F6F6] text-[#72767D] hover:text-[#2C2F33] transition-colors"
                  onClick={() => console.log('Attach file clicked')}
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
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
                  className="rounded-full hover:bg-backgroundHover text-textMuted hover:text-text transition-colors"
                  onClick={() => console.log('Link to message clicked')}
                  aria-label="Link to message"
                >
                  <Link2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Link to message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${currentTopic ? currentTopic.title : 'the chat'}...`}
          className="flex-1 bg-[#F6F6F6] border border-[#DCDDDF] focus:border-[#00A8FC] text-[#2C2F33] text-sm rounded-md px-4 py-2.5 placeholder:text-[#72767D]"
        />
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-backgroundHover text-textMuted hover:text-text transition-colors"
                aria-label="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-auto bg-black/80 backdrop-blur-sm border border-white/10">
              <div className="flex flex-wrap gap-2 max-w-[200px]">
                {EMOJI_OPTIONS.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="text-lg hover:bg-white/10 p-1 rounded cursor-pointer transition-colors"
                    onClick={() => handleEmojiSelect(emoji)}
                    aria-label={`Emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "rounded-full transition-colors",
                    message.trim() ? "text-primary hover:text-primary/90" : "text-muted-foreground"
                  )}
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
