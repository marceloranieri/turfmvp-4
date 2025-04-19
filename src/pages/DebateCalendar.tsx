
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: debateTopics, isLoading } = useQuery({
    queryKey: ['debateTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .order('debate_date', { ascending: true });
      
      if (error) throw error;
      return data as DebateTopic[];
    }
  });

  const selectedDateTopic = debateTopics?.find(
    topic => selectedDate && format(new Date(topic.debate_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const hasDebate = (date: Date) => {
    return debateTopics?.some(
      topic => format(new Date(topic.debate_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && debateTopics?.some(topic => 
      format(new Date(topic.debate_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-background p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Debate Calendar</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{ hasDebate }}
              modifiersStyles={{
                hasDebate: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))'
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <TopicModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={selectedDateTopic}
      />
    </div>
  );
};

export default DebateCalendar;
