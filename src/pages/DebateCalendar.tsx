
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface DebateTopic {
  id: number;
  theme: string;
  topic_text: string;
  debate_date: string;
}

const DebateCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

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

  return (
    <div className="flex min-h-screen bg-background p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Debate Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3"
              modifiers={{ hasDebate }}
              modifiersStyles={{
                hasDebate: {
                  backgroundColor: 'rgba(var(--primary), 0.1)',
                  borderRadius: '50%'
                }
              }}
            />
          </div>
          <div className="flex-1">
            {selectedDateTopic ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{format(new Date(selectedDateTopic.debate_date), 'MMMM d, yyyy')}</h3>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{selectedDateTopic.theme}</div>
                  <p className="text-base">{selectedDateTopic.topic_text}</p>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                {isLoading ? "Loading..." : "No debate scheduled for this date"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebateCalendar;
