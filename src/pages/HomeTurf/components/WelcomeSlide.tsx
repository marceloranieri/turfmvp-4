
import React from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeSlideProps {
  onGetStarted: () => void;
}

const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-6">Join the Daily Debate!</h1>
      <p className="text-lg mb-10 max-w-md">
        Engage in structured debates, earn Harmony Points, and become a Debate Maestro.
      </p>
      <Button 
        onClick={onGetStarted}
        className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-6 text-lg transition-transform hover:scale-110"
      >
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeSlide;
