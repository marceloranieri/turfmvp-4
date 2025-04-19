
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import TopicModal from '@/components/TopicModal';

interface DebateTopic {
  id: number;
  theme: string;
  topic_text: string;
  debate_date: string;
}

const DebateCalendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: debateTopics, isLoading } = useQuery({
    queryKey: ['debateTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .order('debate_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map((item: any): DebateTopic => ({
        id: item.id,
        theme: item.theme,
        topic_text: item.topic_text,
        debate_date: item.debate_date
      }));
    }
  });

  // Set the initial selected date to the first topic date once data is loaded
  React.useEffect(() => {
    if (debateTopics && debateTopics.length > 0 && !selectedDate) {
      const firstTopicDate = new Date(debateTopics[0].debate_date);
      setSelectedDate(firstTopicDate);
    }
  }, [debateTopics, selectedDate]);

  const selectedDateTopic = React.useMemo(() => {
    if (!selectedDate || !debateTopics) return null;
    
    return debateTopics.find(
      topic => format(new Date(topic.debate_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  }, [selectedDate, debateTopics]);

  const handleDateSelect = (direction: 'prev' | 'next') => {
    if (!selectedDate || !debateTopics || debateTopics.length === 0) return;
    
    const currentDateStr = format(selectedDate, 'yyyy-MM-dd');
    const currentIndex = debateTopics.findIndex(
      topic => format(new Date(topic.debate_date), 'yyyy-MM-dd') === currentDateStr
    );
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next' && currentIndex < debateTopics.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return; // Can't go beyond limits
    }
    
    const newDate = new Date(debateTopics[newIndex].debate_date);
    setSelectedDate(newDate);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background p-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6 flex justify-center items-center">
            Loading debates...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Debate Calendar</h1>
          </div>
        </div>
        
        <CardContent className="p-6">
          {debateTopics && debateTopics.length > 0 && selectedDate ? (
            <div className="flex items-center justify-center space-x-6">
              <Button
                variant="outline"
                onClick={() => handleDateSelect('prev')}
                disabled={debateTopics.findIndex(
                  t => format(new Date(t.debate_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ) === 0}
              >
                Previous
              </Button>
              
              <div className="text-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <div className="text-sm text-muted-foreground">
                  {format(selectedDate, 'MMM')}
                </div>
                <div className="text-4xl font-bold">
                  {format(selectedDate, 'd')}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => handleDateSelect('next')}
                disabled={debateTopics.findIndex(
                  t => format(new Date(t.debate_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ) === debateTopics.length - 1}
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              No debate topics available
            </div>
          )}
        </CardContent>
      </Card>

      <TopicModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={selectedDateTopic || null}
      />
    </div>
  );
};

export default DebateCalendar;
