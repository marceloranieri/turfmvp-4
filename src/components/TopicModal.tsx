
import React from 'react';
import { format } from "date-fns";
import { X, Share2, CalendarPlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    id: number;
    theme: string;
    topic_text: string;
    debate_date: string;
  } | null;
}

const TopicModal = ({ isOpen, onClose, topic }: TopicModalProps) => {
  if (!topic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {format(new Date(topic.debate_date), 'MMMM d, yyyy')}
            </div>
            <h2 className="text-xl font-semibold">{topic.topic_text}</h2>
          </div>
          
          {/* Right side */}
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              #{topic.theme.toLowerCase().replace(/ & /g, '-')}
            </Badge>
            
            <div className="flex gap-2 mt-6">
              <Button className="flex-1">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicModal;
