
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface NextTopicLinkProps {
  nextScheduledDate: string;
  onNextScheduled: () => void;
}

const NextTopicLink = ({ nextScheduledDate, onNextScheduled }: NextTopicLinkProps) => {
  return (
    <div className="text-center p-4">
      <p className="text-muted-foreground mb-4">No topic scheduled for this date.</p>
      <Button
        variant="link"
        onClick={onNextScheduled}
        className="text-primary font-medium"
      >
        Next topic on {format(new Date(nextScheduledDate), 'MMMM d')} →
      </Button>
    </div>
  );
};

export default NextTopicLink;
