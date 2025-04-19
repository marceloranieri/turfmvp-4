
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageReplyFormProps {
  username: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const MessageReplyForm: React.FC<MessageReplyFormProps> = ({
  username,
  onSubmit,
  onCancel
}) => {
  const [replyText, setReplyText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmit(replyText);
      setReplyText('');
    }
  };

  return (
    <div className="mt-3 pl-3 border-l-2 border-primary/30">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Reply to ${username}...`}
          className="flex-1 px-3 py-1.5 text-sm bg-muted rounded border-0 focus:ring-1 focus:ring-primary"
          autoFocus
        />
        <Button 
          type="submit" 
          size="sm" 
          variant="outline"
          disabled={!replyText.trim()}
        >
          Reply
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default MessageReplyForm;
