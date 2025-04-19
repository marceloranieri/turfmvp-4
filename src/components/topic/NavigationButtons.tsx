
import React from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface NavigationButtonsProps {
  onPrevDate: () => void;
  onNextDate: () => void;
  prevTopic: any | null;
  nextTopic: any | null;
  currentDate: string;
}

const NavigationButtons = ({ 
  onPrevDate, 
  onNextDate, 
  prevTopic, 
  nextTopic, 
  currentDate 
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevDate}
        disabled={!prevTopic}
        aria-label="Previous topic"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-baseline space-x-2">
        <span className="text-sm text-muted-foreground">
          {format(new Date(currentDate), 'MMM')}
        </span>
        <span className="text-4xl font-bold">
          {format(new Date(currentDate), 'd')}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextDate}
        disabled={!nextTopic}
        aria-label="Next topic"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
