import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CircleDot, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample debate content for demo
const DEMO_MESSAGES = [
  {
    username: "Alice",
    content: "Remote work boosts productivity by eliminating commute time.",
    upvotes: 3,
    harmonyPoints: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
  },
  {
    username: "Bob",
    content: "It also cuts commuting stress and reduces carbon emissions.",
    upvotes: 2,
    harmonyPoints: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
  },
  {
    username: "Wizard of Mods 🧙",
    content: "But what about team culture? Remote work can lead to isolation. Studies show workplace relationships matter for engagement.",
    isAI: true,
    avatar: "/wizard.png"
  }
];

const HomeTurf: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    // Welcome Screen
    <div key="welcome" className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-6">Join the Daily Debate!</h1>
      <p className="text-lg mb-10 max-w-md">
        Engage in structured debates, earn Harmony Points, and become a Debate Maestro.
      </p>
      <Button 
        onClick={() => setCurrentSlide(1)}
        className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-6 text-lg transition-transform hover:scale-110"
      >
        Get Started
      </Button>
    </div>,
    
    // Demo Feature - Debate Chat
    <div key="demo-chat" className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Daily Topic: Remote Work - Yay or Nay?</h2>
      <div className="flex-grow bg-secondary/30 rounded-lg p-4 overflow-y-auto mb-6">
        {DEMO_MESSAGES.map((msg, i) => (
          <div key={i} className={`mb-6 ${msg.isAI ? 'bg-ai/10 p-3 rounded-lg' : ''}`}>
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
              </div>
              <div className="font-medium">
                {msg.username}
                {msg.isAI && <span className="ml-1 text-ai font-bold">AI</span>}
              </div>
            </div>
            <p className="pl-10">{msg.content}</p>
            {msg.upvotes && (
              <div className="pl-10 mt-2 flex items-center">
                <span className="text-sm text-muted-foreground mr-3">
                  👍 {msg.upvotes}
                </span>
                <span className="text-sm text-gold">
                  ✨ {msg.harmonyPoints} Harmony Points
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center mb-4">Try upvoting or downvoting to see how Harmony Points work!</p>
    </div>,
    
    // Demo Feature - Harmony Points & Brain Awards
    <div key="demo-features" className="h-full flex flex-col items-center justify-center space-y-8 text-center">
      <div className="bg-secondary/30 p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-3">✨ Harmony Points</h2>
        <p className="mb-4">Earn points when people upvote your comments or link to them in their own replies!</p>
        <div className="flex justify-center gap-4 mb-2">
          <div className="flex items-center">
            <span className="text-lg mr-1">👍</span>
            <span>+1 point</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg mr-1">🔗</span>
            <span>+1 for both</span>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/30 p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-3">🧠 Brain Awards</h2>
        <p className="mb-4">Award up to 3 Brains daily to recognize insightful contributions!</p>
        <div className="text-gold font-bold">
          Most Brains = Debate Maestro ⭐
        </div>
      </div>
    </div>,
    
    // Call to Action
    <div key="cta" className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to join the debate?</h2>
      <div className="space-y-4 mb-4">
        <Button 
          onClick={() => navigate('/auth?mode=signup')}
          className="w-64 bg-gold hover:bg-gold/90 text-black font-semibold py-6 transition-transform hover:scale-110"
        >
          Sign Up
        </Button>
        <div>
          <Button 
            onClick={() => navigate('/auth?mode=signin')}
            variant="outline"
            className="w-64 border-gold text-gold hover:bg-gold/20 font-semibold py-6"
          >
            Sign In
          </Button>
        </div>
      </div>
      <Button 
        onClick={() => navigate('/')}
        variant="ghost"
        className="text-gray-400 hover:text-white mt-4"
      >
        Skip for now
      </Button>
    </div>
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl h-[600px] bg-card rounded-xl shadow-lg overflow-hidden relative">
          <div className="p-8 h-full">
            {slides[currentSlide]}
          </div>
          
          {/* Navigation Controls */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
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
            {currentSlide < slides.length - 1 && (
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
        </div>
      </main>
    </div>
  );
};

export default HomeTurf;
