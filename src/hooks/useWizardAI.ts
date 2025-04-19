import { useState, useEffect, useRef } from 'react';
import { Message, Notification } from '@/types/turf';

// Predefined wizard prompts to encourage conversation
const WIZARD_PROMPTS = [
  "What does everyone think about this topic?",
  "Anyone have a different perspective to share?",
  "I'm curious - what's your take on this?",
  "Let's explore another angle here...",
  "Interesting discussion! What else should we consider?",
  "Wiz just tossed a thought grenade...",
  "Time for a fresh perspective!",
  "Let's shake things up a bit...",
  "The conversation seems to have paused. Any thoughts?",
  "I wonder if there's an alternative viewpoint here..."
];

// Random notifications that appear when the Wizard posts
const WIZARD_NOTIFICATIONS = [
  "Wizard of Mods has entered the chat!",
  "The Wizard has a question for you...",
  "The Wizard sees a lull in the conversation",
  "Wiz just tossed a thought grenade",
  "The Wizard waves their magic wand..."
];

/**
 * Hook to manage the Wizard of Mods AI that posts messages after periods of inactivity
 */
export const useWizardAI = (
  messages: Message[],
  currentUserId: string,
  onWizardPost: (message: Message) => void,
  onNotification: (notification: Notification) => void
) => {
  // Track the timeout reference for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track if the wizard is enabled
  const [isEnabled, setIsEnabled] = useState(true);
  // Keep track of last activity timestamp
  const lastActivityRef = useRef<number>(Date.now());

  // Function to check for conversation lulls
  const checkForLull = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set a new timeout if the wizard is enabled
    if (isEnabled) {
      // Set a 20-second timeout to check for inactivity
      timeoutRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        // If it's been more than 20 seconds since the last activity, post a wizard message
        if (timeSinceLastActivity >= 20000) {
          postWizardMessage();
        }
      }, 20000);
    }
  };

  // Update the last activity timestamp whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only update if the last message wasn't from the wizard
      if (!lastMessage.isAi) {
        lastActivityRef.current = Date.now();
        checkForLull();
      }
    }
  }, [messages]);

  // Set initial timeout when component mounts
  useEffect(() => {
    checkForLull();
    
    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEnabled]);

  // Post a message from the Wizard of Mods
  const postWizardMessage = () => {
    // Get a random prompt and notification
    const prompt = WIZARD_PROMPTS[Math.floor(Math.random() * WIZARD_PROMPTS.length)];
    const notificationText = WIZARD_NOTIFICATIONS[Math.floor(Math.random() * WIZARD_NOTIFICATIONS.length)];
    
    // Create the wizard message
    const wizardMessage: Message = {
      id: `wizard-${Date.now()}`,
      userId: 'wizard-id',
      username: 'Wizard of Mods',
      avatarUrl: '/wizard.png',
      content: prompt,
      isAi: true,
      createdAt: new Date().toISOString(),
      parentId: null,
      linkTo: null,
      reactions: [],
      upvotes: 0,
      downvotes: 0,
      brainAwards: 0,
      tags: []
    };
    
    // Create a notification for the wizard's appearance
    const notification: Notification = {
      id: `notif-wizard-${Date.now()}`,
      userId: currentUserId,
      type: 'ai',
      content: notificationText,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    // Send the message and notification
    onWizardPost(wizardMessage);
    onNotification(notification);
    
    // Reset the last activity time and check for future lulls
    lastActivityRef.current = Date.now();
    checkForLull();
  };

  // Toggle wizard on/off
  const toggleWizard = () => {
    setIsEnabled(!isEnabled);
  };

  return {
    isWizardEnabled: isEnabled,
    toggleWizard,
    checkForLull
  };
};

export default useWizardAI;
