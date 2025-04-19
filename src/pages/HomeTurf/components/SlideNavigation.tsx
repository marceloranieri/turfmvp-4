
import React from 'react';
import { ArrowLeft, ArrowRight, CircleDot, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (slideIndex: number) => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlide,
  totalSlides,
  onSlideChange
}) => {
  const nextSlide = () => {
    onSlideChange(Math.min(currentSlide + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    onSlideChange(Math.max(currentSlide - 1, 0));
  };

  return (
    <>
      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className="focus:outline-none"
          >
            {index === currentSlide ? (
              <CircleDot className="h-4 w-4 text-gold" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>
      
      {/* Prev/Next Buttons */}
      <div className="absolute bottom-6 w-full flex justify-between px-8">
        {currentSlide > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={prevSlide}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1"></div>
        {currentSlide < totalSlides - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={nextSlide}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default SlideNavigation;
