
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import NavigationButtons from './topic/NavigationButtons';
import TopicContent from './topic/TopicContent';
import NextTopicLink from './topic/NextTopicLink';

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
    console.log('Adding to calendar:', topic);
  };

  const handleShare = () => {
    console.log('Sharing topic:', topic);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Topic Details</DialogTitle>
        
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

        <div className="p-6 space-y-6">
          <NavigationButtons
            onPrevDate={handlePrevDate}
            onNextDate={handleNextDate}
            prevTopic={prevTopic}
            nextTopic={nextTopic}
            currentDate={topic?.debate_date || new Date().toISOString()}
          />
          
          {!topic && nextScheduledTopic && (
            <NextTopicLink
              nextScheduledDate={nextScheduledTopic.debate_date}
              onNextScheduled={handleNextScheduled}
            />
          )}

          {topic && (
            <TopicContent
              topic={topic}
              onAddToCalendar={handleAddToCalendar}
              onShare={handleShare}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicModal;
