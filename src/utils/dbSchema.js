
// Supabase Database Schema Plan

/*
This file outlines the database schema we need to implement for Turf.
We'll use these SQL commands in a separate lov-sql block to create these tables.

Tables to create:
1. users - User profiles and harmony points
2. messages - Chat messages
3. reactions - Message reactions (upvotes, downvotes, etc.)
4. message_reactions - Emoji/GIF reactions to messages
5. notifications - User notifications
6. brain_awards - "Brain" awards given to insightful messages
7. debate_topics - Topics for scheduled debates

Real-time functionality:
- Enable real-time on messages, reactions, and notifications tables
- Add appropriate indexes for query performance
*/

// SQL for reference (will be executed in a separate block):
/*
-- Users table (extends auth.users with additional profile data)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  harmony_points INTEGER NOT NULL DEFAULT 0,
  brain_awards_given INTEGER NOT NULL DEFAULT 0,
  brain_awards_received INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_id UUID REFERENCES public.messages,
  link_to UUID REFERENCES public.messages,
  is_ai BOOLEAN NOT NULL DEFAULT false,
  topic_id UUID REFERENCES public.debate_topics
);

-- Reactions table (upvotes, downvotes)
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Message reactions (emojis, gifs)
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('emoji', 'gif')),
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Brain awards table
CREATE TABLE IF NOT EXISTS public.brain_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  recipient_id UUID REFERENCES public.users NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users NOT NULL,
  message_id UUID REFERENCES public.messages,
  type TEXT NOT NULL CHECK (type IN ('reaction', 'reply', 'mention', 'award', 'pin', 'ai')),
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Harmony point events
CREATE TABLE IF NOT EXISTS public.harmony_point_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('initial_post', 'quality_contribution', 'audience_reaction', 'audience_engagement', 'brain_award')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_message_id UUID REFERENCES public.messages
);

-- Debate topics table
CREATE TABLE IF NOT EXISTS public.debate_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON public.reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_harmony_point_events_user_id ON public.harmony_point_events(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_awards_recipient_id ON public.brain_awards(recipient_id);

-- Enable real-time for key tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.reactions REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
*/
