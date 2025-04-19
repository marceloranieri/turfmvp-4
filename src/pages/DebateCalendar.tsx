
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
  scheduled_for: string;
}

const DebateCalendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date('2025-10-01'));
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: debateTopics, isLoading } = useQuery({
    queryKey: ['debateTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as DebateTopic[];
    }
  });

  const selectedDateTopic = debateTopics?.find(
    topic => format(new Date(topic.scheduled_for), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleDateSelect = (direction: 'prev' | 'next') => {
    const currentDate = selectedDate;
    const newDate = new Date(currentDate);
    
    if (direction === 'next') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }

    setSelectedDate(newDate);
    setIsModalOpen(true);
  };

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
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="outline"
              onClick={() => handleDateSelect('prev')}
              disabled={format(selectedDate, 'yyyy-MM-dd') <= '2025-10-01'}
            >
              Previous
            </Button>
            
            <div className="text-center">
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
              disabled={format(selectedDate, 'yyyy-MM-dd') >= '2025-10-24'}
            >
              Next
            </Button>
          </div>
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
