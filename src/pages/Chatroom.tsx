
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomWrapper from '@/components/ChatRoomWrapper';

const Chatroom = () => {
  const navigate = useNavigate();

  // For demo purposes, you might want to show onboarding for first-time visitors
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    // Uncomment this to enable onboarding redirect for first-time visitors
    // if (!hasSeenOnboarding) {
    //   localStorage.setItem('hasSeenOnboarding', 'true');
    //   navigate('/home-turf');
    // }
  }, [navigate]);

  return <ChatRoomWrapper />;
};

export default Chatroom;
