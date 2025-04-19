
import React from 'react';
import { Share2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TopicContentProps {
  topic: {
    topic_text: string;
    theme: string;
  };
  onAddToCalendar: () => void;
  onShare: () => void;
}

const TopicContent = ({ topic, onAddToCalendar, onShare }: TopicContentProps) => {
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-4">{topic.topic_text}</h2>
        <div className="flex flex-wrap gap-2">
          {topic.theme.toLowerCase().split(' & ').map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag.replace(/\s+/g, '')}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          onClick={onAddToCalendar}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onShare}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </>
  );
};

export default TopicContent;
