
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeSlideProps {
  onGetStarted: () => void;
}

const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Welcome to Turf
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Join daily debates, share your thoughts, and engage with a community of curious minds.
        </p>
      </div>
      
      <Button 
        onClick={onGetStarted}
        size="lg"
        className="bg-gold hover:bg-gold/90 text-background font-semibold px-8 py-6 text-lg gap-2 group"
      >
        Get Started
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default WelcomeSlide;
