
import React from 'react';
import { Button } from '@/components/ui/button';

interface CallToActionSlideProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onSkip: () => void;
}

const CallToActionSlide: React.FC<CallToActionSlideProps> = ({
  onSignUp,
  onSignIn,
  onSkip
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to join the debate?</h2>
      <div className="space-y-4 mb-4">
        <Button 
          onClick={onSignUp}
          className="w-64 bg-gold hover:bg-gold/90 text-black font-semibold py-6 transition-transform hover:scale-110"
        >
          Sign Up
        </Button>
        <div>
          <Button 
            onClick={onSignIn}
            variant="outline"
            className="w-64 border-gold text-gold hover:bg-gold/20 font-semibold py-6"
          >
            Sign In
          </Button>
        </div>
      </div>
      <Button 
        onClick={onSkip}
        variant="ghost"
        className="text-gray-400 hover:text-white mt-4"
      >
        Skip for now
      </Button>
    </div>
  );
};

export default CallToActionSlide;
