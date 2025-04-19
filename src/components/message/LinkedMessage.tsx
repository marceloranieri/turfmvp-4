
import React from 'react';
import { LinkIcon } from 'lucide-react';

interface LinkedMessageProps {
  username: string;
  content: string;
}

const LinkedMessage: React.FC<LinkedMessageProps> = ({ username, content }) => {
  return (
    <div className="mt-2 border-l-2 border-primary/30 pl-2 py-1 text-sm bg-muted/30 rounded">
      <div className="text-xs text-primary">
        <LinkIcon className="inline-block h-3 w-3 mr-1" />
        <span>Linked to {username}'s message:</span>
      </div>
      <div className="text-muted-foreground line-clamp-1">
        {content}
      </div>
    </div>
  );
};

export default LinkedMessage;
