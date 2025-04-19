
import React from 'react';
import { format } from "date-fns";
import { X, Share2, CalendarPlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    id: number;
    theme: string;
    topic_text: string;
    scheduled_for: string;
  } | null;
}

const TopicModal = ({ isOpen, onClose, topic }: TopicModalProps) => {
  if (!topic) return null;

  // Mock participants - in a real app, this would come from the database
  const mockParticipants = [
    { id: 1, name: 'AB' },
    { id: 2, name: 'CD' },
    { id: 3, name: 'EF' },
    { id: 4, name: 'GH' },
    { id: 5, name: 'IJ' },
  ];

  const truncatedText = topic.topic_text.length > 200 
    ? `${topic.topic_text.slice(0, 200)}...` 
    : topic.topic_text;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6">
          {/* Date and Title Section */}
          <div className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-muted-foreground">
                {format(new Date(topic.scheduled_for), 'MMM')}
              </span>
              <span className="text-4xl font-bold">
                {format(new Date(topic.scheduled_for), 'd')}
              </span>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">{truncatedText}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  #{topic.theme.toLowerCase().replace(/ & /g, '-')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Participants Section */}
          <div className="flex -space-x-2">
            {mockParticipants.map((participant) => (
              <Avatar key={participant.id} className="border-2 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {participant.name}
                </AvatarFallback>
              </Avatar>
            ))}
            <Avatar className="border-2 border-background">
              <AvatarFallback className="bg-primary/20">
                +99
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button className="flex-1">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicModal;
