
import { useReducer, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, Reaction } from '@/types/turf';

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
 * @param topicId Optional topic ID to filter messages
 */
export const useChat = (topicId?: string) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      dispatch({ type: 'LOADING' });
      try {
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (topicId) {
          query = query.eq('topic_id', topicId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        dispatch({ 
          type: 'LOADED_MESSAGES', 
          payload: data as Message[] 
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        dispatch({ 
          type: 'ERROR', 
          payload: error as Error 
        });
      }
    };
    
    fetchMessages();
  }, [topicId]);
  
  // Subscribe to real-time message updates
  useEffect(() => {
    const messageChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!topicId || newMessage.topicId === topicId) {
            dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updatedMessage = payload.new as Message;
          if (!topicId || updatedMessage.topicId === topicId) {
            dispatch({ type: 'UPDATE_MESSAGE', payload: updatedMessage });
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up message subscription');
      supabase.removeChannel(messageChannel);
    };
  }, [topicId]);
  
  // Subscribe to real-time reaction updates
  useEffect(() => {
    const reactionChannel = supabase
      .channel('public:reactions')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message_reactions' },
        (payload) => {
          const newReaction = payload.new as any;
          dispatch({ 
            type: 'UPDATE_REACTION', 
            payload: { 
              messageId: newReaction.message_id, 
              reaction: {
                id: newReaction.id,
                userId: newReaction.user_id,
                username: newReaction.username,
                type: newReaction.type,
                value: newReaction.value
              } 
            } 
          });
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'message_reactions' },
        (payload) => {
          const deletedReaction = payload.old as any;
          dispatch({ 
            type: 'REMOVE_REACTION', 
            payload: { 
              messageId: deletedReaction.message_id, 
              reactionId: deletedReaction.id
            } 
          });
        }
      )
      .subscribe();
    
    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up reaction subscription');
      supabase.removeChannel(reactionChannel);
    };
  }, []);
  
  // Send a new message
  const sendMessage = useCallback(async (content: string, parentId?: string, linkToId?: string) => {
    try {
      const newMessage = {
        user_id: 'current-user-id', // This would be replaced with the actual current user ID
        content,
        parent_id: parentId,
        link_to: linkToId,
        topic_id: topicId
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [topicId]);
  
  // Add a reaction to a message
  const addReaction = useCallback(async (messageId: string, type: string, value: string) => {
    try {
      const newReaction = {
        message_id: messageId,
        user_id: 'current-user-id', // This would be replaced with the actual current user ID
        type,
        value
      };
      
      const { data, error } = await supabase
        .from('message_reactions')
        .insert(newReaction)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }, []);
  
  // Remove a reaction from a message
  const removeReaction = useCallback(async (reactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .delete()
        .match({ id: reactionId });
        
      if (error) throw error;
      
      return data;
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
