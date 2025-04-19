
import React from 'react';

interface MessagePreviewProps {
  username: string;
  content: string;
  upvotes?: number;
  harmonyPoints?: number;
  avatar: string;
  isAI?: boolean;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  username,
  content,
  upvotes,
  harmonyPoints,
  avatar,
  isAI
}) => {
  return (
    <div className={`mb-6 ${isAI ? 'bg-ai/10 p-3 rounded-lg' : ''}`}>
      <div className="flex items-center mb-1">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
          <img src={avatar} alt={username} className="w-full h-full object-cover" />
        </div>
        <div className="font-medium">
          {username}
          {isAI && <span className="ml-1 text-ai font-bold">AI</span>}
        </div>
      </div>
      <p className="pl-10">{content}</p>
      {upvotes && (
        <div className="pl-10 mt-2 flex items-center">
          <span className="text-sm text-muted-foreground mr-3">
            👍 {upvotes}
          </span>
          <span className="text-sm text-gold">
            ✨ {harmonyPoints} Harmony Points
          </span>
        </div>
      )}
    </div>
  );
};

export default MessagePreview;
