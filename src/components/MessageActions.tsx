import React from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Smile, 
  Image,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MessageActionsProps {
  upvotes: number;
  downvotes: number;
  onUpvote: () => void;
  onDownvote: () => void;
  onReplyClick: () => void;
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gifUrl: string) => void;
  onBrainAward: () => void;
  canAwardBrain: boolean;
  brainAwardsLeft: number;
  showActions: boolean;
}

// Common emoji options for the emoji picker
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '🙌', '🤔', '😮', '😢'];

// Sample GIF options (in a real app, these would come from Giphy API)
const GIF_OPTIONS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWhwZnZidnhuZ2I1YWk4N21wcHYxMnR3MWZobndpNW9zaXc5NmEwZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TFUd6cS3rAiXYlHhG9/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWw2a3JvdHNxdmd6ZWNvc3UzcGYzcXJ2cjY2NTJvZHZ0eDVqMDV2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGhvNXBkcDF6aGllNGpiNWcyajFrZGtpamowNWtjN2wzdTNtZGwxaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHAUOqG3lSS0f1C/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXpzaDdocTJ1NGx3MWoweGRrbG8wZXZxemdzM3owMXAxZnU1YW9vNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kc0kTO5hBOEoM/giphy.gif',
];

const MessageActions: React.FC<MessageActionsProps> = ({
  upvotes,
  downvotes,
  onUpvote,
  onDownvote,
  onReplyClick,
  onEmojiSelect,
  onGifSelect,
  onBrainAward,
  canAwardBrain,
  brainAwardsLeft,
  showActions
}) => {
  return (
    <div 
      className={`flex items-center gap-1 mt-1.5 ${
        showActions ? 'opacity-100' : 'opacity-0'
      } group-hover:opacity-100 transition-opacity`}
    >
      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={onUpvote}>
        <ThumbsUp className="h-4 w-4 mr-1" />
        <span className="text-xs">{upvotes > 0 ? upvotes : ''}</span>
      </Button>
      
      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={onDownvote}>
        <ThumbsDown className="h-4 w-4 mr-1" />
        <span className="text-xs">{downvotes > 0 ? downvotes : ''}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-muted-foreground"
        onClick={onReplyClick}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-auto">
          <div className="flex flex-wrap gap-2 max-w-[200px]">
            {EMOJI_OPTIONS.map((emoji, index) => (
              <button
                key={index}
                className="text-lg hover:bg-muted p-1 rounded cursor-pointer"
                onClick={() => onEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-auto">
          <div className="grid grid-cols-2 gap-2">
            {GIF_OPTIONS.map((gifUrl, index) => (
              <img
                key={index}
                src={gifUrl}
                alt="GIF option"
                className="w-[100px] h-[75px] object-cover rounded cursor-pointer hover:opacity-80"
                onClick={() => onGifSelect(gifUrl)}
              />
            ))}
          </div>
          <div className="text-xs text-center mt-2 text-muted-foreground">
            Powered by GIPHY
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-7 px-2 ${
          canAwardBrain ? 'text-gold hover:text-gold/90' : 'text-muted-foreground opacity-50'
        }`}
        onClick={onBrainAward}
        disabled={!canAwardBrain}
      >
        <BrainCircuit className="h-4 w-4" />
        <span className="text-xs ml-1">
          Award Genius ({brainAwardsLeft} left)
        </span>
      </Button>
    </div>
  );
};

export default MessageActions;
