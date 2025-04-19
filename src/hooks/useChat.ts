
import { useReducer, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, Reaction } from '@/types/turf';
import { useSubscription } from './useSubscription';
import { withErrorHandling } from '@/utils/errorHandling';

// Define state and action types
interface MessageState {
  messages: Message[];
  loading: boolean;
  error: Error | null;
}

type MessageAction = 
  | { type: 'LOADING' }
  | { type: 'LOADED_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'UPDATE_REACTION'; payload: { messageId: string; reaction: Reaction } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: string; reactionId: string } }
  | { type: 'ERROR'; payload: Error };

// Initial state
const initialState: MessageState = {
  messages: [],
  loading: true,
  error: null
};

// Message reducer for handling all message-related actions
const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true
      };
    case 'LOADED_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id ? action.payload : msg
        )
      };
    case 'UPDATE_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.messageId 
            ? { 
                ...msg, 
                reactions: [...msg.reactions, action.payload.reaction] 
              }
            : msg
        )
      };
    case 'REMOVE_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.messageId 
            ? { 
                ...msg, 
                reactions: msg.reactions.filter(r => r.id !== action.payload.reactionId)
              }
            : msg
        )
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

/**
 * Custom hook for managing chat messages with real-time updates
 * @param roomId Optional room ID to filter messages
 */
export const useChat = (roomId?: string) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  
  // Fetch initial messages - using mock data since we don't have the messages table yet in Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      dispatch({ type: 'LOADING' });
      try {
        // Using mock data since the Supabase schema doesn't include messages table yet
        // In a real implementation, this would fetch from Supabase
        setTimeout(() => {
          const mockMessages: Message[] = [
            {
              id: '1',
              userId: 'user-1',
              username: 'User One',
              avatarUrl: '',
              content: 'Hello, this is a mock message',
              createdAt: new Date().toISOString(),
              parentId: null,
              linkTo: null,
              upvotes: 0,
              downvotes: 0,
              brainAwards: 0,
              reactions: [],
              isAi: false,
              tags: []
            }
          ];
          
          dispatch({ 
            type: 'LOADED_MESSAGES', 
            payload: mockMessages 
          });
        }, 500);
      } catch (error) {
        console.error('Error fetching messages:', error);
        dispatch({ 
          type: 'ERROR', 
          payload: error as Error 
        });
      }
    };
    
    fetchMessages();
  }, [roomId]);
  
  // Handler for new messages
  const handleNewMessage = useCallback((payload: any) => {
    const newMessage = payload.new as Message;
    // Instead of filtering by topicId, we now filter by roomId if provided
    if (!roomId || newMessage.parentId === roomId) {
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    }
  }, [roomId]);

  // Handler for updated messages
  const handleUpdatedMessage = useCallback((payload: any) => {
    const updatedMessage = payload.new as Message;
    // Instead of filtering by topicId, we now filter by roomId if provided
    if (!roomId || updatedMessage.parentId === roomId) {
      dispatch({ type: 'UPDATE_MESSAGE', payload: updatedMessage });
    }
  }, [roomId]);

  // Handler for new reactions
  const handleNewReaction = useCallback((payload: any) => {
    const newReaction = payload.new as any;
    dispatch({ 
      type: 'UPDATE_REACTION', 
      payload: { 
        messageId: newReaction.message_id, 
        reaction: {
          id: newReaction.id,
          userId: newReaction.user_id,
          username: newReaction.username || 'User',
          type: newReaction.type,
          value: newReaction.value
        } 
      } 
    });
  }, []);

  // Handler for deleted reactions
  const handleDeletedReaction = useCallback((payload: any) => {
    const deletedReaction = payload.old as any;
    dispatch({ 
      type: 'REMOVE_REACTION', 
      payload: { 
        messageId: deletedReaction.message_id, 
        reactionId: deletedReaction.id
      } 
    });
  }, []);

  // Use our custom subscription hook for message inserts
  useSubscription(
    'public:messages:insert',
    'messages',
    'INSERT',
    handleNewMessage
  );

  // Use our custom subscription hook for message updates
  useSubscription(
    'public:messages:update',
    'messages',
    'UPDATE',
    handleUpdatedMessage
  );

  // Use our custom subscription hook for reaction inserts
  useSubscription(
    'public:reactions:insert',
    'message_reactions',
    'INSERT',
    handleNewReaction
  );

  // Use our custom subscription hook for reaction deletes
  useSubscription(
    'public:reactions:delete',
    'message_reactions',
    'DELETE',
    handleDeletedReaction
  );
  
  // Send a new message
  const sendMessage = useCallback(async (content: string, parentId?: string, linkToId?: string) => {
    try {
      const messageData = {
        user_id: 'current-user-id', // This would be replaced with the actual current user ID
        content,
        parent_id: parentId || null,
        link_to: linkToId || null,
        room_id: roomId || null
      };
      
      // Since we don't have the actual messages table yet, we'll mock the response
      console.log('Would send message:', messageData);
      
      return { id: `mock-${Date.now()}`, ...messageData };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [roomId]);
  
  // Add a reaction to a message
  const addReaction = useCallback(async (messageId: string, type: string, value: string) => {
    try {
      const reactionData = {
        message_id: messageId,
        user_id: 'current-user-id', // This would be replaced with the actual current user ID
        type,
        value
      };
      
      // Since we don't have the actual message_reactions table yet, we'll mock the response
      console.log('Would add reaction:', reactionData);
      
      return { id: `mock-${Date.now()}`, ...reactionData };
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }, []);
  
  // Remove a reaction from a message
  const removeReaction = useCallback(async (reactionId: string) => {
    try {
      // Since we don't have the actual message_reactions table yet, we'll mock the response
      console.log('Would remove reaction:', reactionId);
      
      return { success: true };
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }, []);
  
  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    sendMessage,
    addReaction,
    removeReaction
  };
};
