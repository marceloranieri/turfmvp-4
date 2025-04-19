
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeSlide from './components/WelcomeSlide';
import DemoChatSlide from './components/DemoChatSlide';
import FeaturesSlide from './components/FeaturesSlide';
import CallToActionSlide from './components/CallToActionSlide';
import SlideNavigation from './components/SlideNavigation';

const HomeTurf: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    <WelcomeSlide key="welcome" onGetStarted={() => setCurrentSlide(1)} />,
    <DemoChatSlide key="demo-chat" />,
    <FeaturesSlide key="features" />,
    <CallToActionSlide 
      key="cta" 
      onSignUp={() => navigate('/auth?mode=signup')}
      onSignIn={() => navigate('/auth?mode=signin')}
      onSkip={() => navigate('/')}
    />
  ];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl h-[600px] bg-card rounded-xl shadow-lg overflow-hidden relative">
          <div className="p-8 h-full">
            {slides[currentSlide]}
          </div>
          
          <SlideNavigation
            currentSlide={currentSlide}
            totalSlides={slides.length}
            onSlideChange={setCurrentSlide}
          />
        </div>
      </main>
    </div>
  );
};

export default HomeTurf;
