
import React from 'react';
import { ArrowLeft, ArrowRight, CircleDot, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (index: number) => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlide,
  totalSlides,
  onSlideChange
}) => {
  return (
    <>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className="focus:outline-none transition-colors"
          >
            {index === currentSlide ? (
              <CircleDot className="h-4 w-4 text-gold" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground hover:text-gold/80" />
            )}
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-6 w-full flex justify-between px-8">
        {currentSlide > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSlideChange(currentSlide - 1)}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1" />
        {currentSlide < totalSlides - 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSlideChange(currentSlide + 1)}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default SlideNavigation;
