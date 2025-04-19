
import React from 'react';
import { format } from "date-fns";
import { Share2, CalendarPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: {
    id: number;
    theme: string;
    topic_text: string;
    debate_date: string;
  } | null;
  onDateChange?: (date: Date) => void;
}

const TopicModal = ({ isOpen, onClose, topic, onDateChange }: TopicModalProps) => {
  const { data: allTopics } = useQuery({
    queryKey: ['debateTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .order('debate_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const currentIndex = allTopics?.findIndex(t => t.id === topic?.id) ?? -1;
  const prevTopic = currentIndex > 0 ? allTopics?.[currentIndex - 1] : null;
  const nextTopic = currentIndex < (allTopics?.length ?? 0) - 1 ? allTopics?.[currentIndex + 1] : null;

  const findNextScheduledTopic = () => {
    if (!allTopics || allTopics.length === 0) return null;
    const today = new Date().toISOString().split('T')[0];
    return allTopics.find(t => t.debate_date >= today);
  };

  const handlePrevDate = () => {
    if (prevTopic && onDateChange) {
      onDateChange(new Date(prevTopic.debate_date));
    }
  };

  const handleNextDate = () => {
    if (nextTopic && onDateChange) {
      onDateChange(new Date(nextTopic.debate_date));
    }
  };

  const nextScheduledTopic = findNextScheduledTopic();

  const handleNextScheduled = () => {
    if (nextScheduledTopic && onDateChange) {
      onDateChange(new Date(nextScheduledTopic.debate_date));
    }
  };

  const handleAddToCalendar = () => {
    // In a real app, this would integrate with calendar APIs
    console.log('Adding to calendar:', topic);
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    console.log('Sharing topic:', topic);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Topic Details</DialogTitle>
        
        {/* Header Image - Using a gradient as placeholder */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Navigation and Date Section */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevDate}
              disabled={!prevTopic}
              aria-label="Previous topic"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-muted-foreground">
                {format(new Date(topic?.debate_date || new Date()), 'MMM')}
              </span>
              <span className="text-4xl font-bold">
                {format(new Date(topic?.debate_date || new Date()), 'd')}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDate}
              disabled={!nextTopic}
              aria-label="Next topic"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* No Topic Message with Next Scheduled Link */}
          {!topic && nextScheduledTopic && (
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-4">No topic scheduled for this date.</p>
              <Button
                variant="link"
                onClick={handleNextScheduled}
                className="text-primary font-medium"
              >
                Next topic on {format(new Date(nextScheduledTopic.debate_date), 'MMMM d')} →
              </Button>
            </div>
          )}

          {/* Topic Content */}
          {topic && (
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCalendar}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicModal;

