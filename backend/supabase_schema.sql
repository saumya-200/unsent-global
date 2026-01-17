-- UNSENT Supabase Schema via SQL Editor

-- 1. TABLE CREATION
-- Stars Table: Stores anonymous messages
CREATE TABLE public.stars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_text TEXT NOT NULL,
    emotion TEXT NOT NULL CHECK (emotion IN ('joy', 'sadness', 'anger', 'fear', 'gratitude', 'regret', 'love', 'hope', 'loneliness')),
    language VARCHAR(10) DEFAULT 'en',
    resonance_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Knot Sessions Table: Ephemeral real-time chat rooms
CREATE TABLE public.knot_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id UUID REFERENCES public.stars(id) ON DELETE CASCADE,
    session_room TEXT UNIQUE NOT NULL,
    participant_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
    is_active BOOLEAN DEFAULT true,
    final_art_svg TEXT
);

-- 2. INDEXES
-- Performance indexes for Star Map queries
CREATE INDEX idx_stars_emotion ON public.stars(emotion);
CREATE INDEX idx_stars_created_at ON public.stars(created_at DESC);
CREATE INDEX idx_stars_resonance ON public.stars(resonance_count DESC);
CREATE INDEX idx_stars_composite ON public.stars(emotion, created_at DESC);

-- Performance indexes for Knot Sessions
CREATE INDEX idx_knot_active ON public.knot_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_knot_expires ON public.knot_sessions(expires_at) WHERE is_active = true;

-- 3. ROW LEVEL SECURITY (RLS)
-- Enable RLS
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knot_sessions ENABLE ROW LEVEL SECURITY;

-- Stars Policies
-- Anyone can read stars
CREATE POLICY "Public stars access" ON public.stars
    FOR SELECT USING (true);

-- Anyone can insert stars (anonymous)
CREATE POLICY "Anonymous star creation" ON public.stars
    FOR INSERT WITH CHECK (true);

-- Stars are immutable (no update/delete by public)
-- (No policies for UPDATE/DELETE implies deny all for anon/authenticated roles, service_role bypasses)

-- Knot Sessions Policies
-- Only service role can access knot sessions (backend managed)
CREATE POLICY "Service role only" ON public.knot_sessions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. DATABASE FUNCTIONS
-- Increment resonance count safely
CREATE OR REPLACE FUNCTION public.increment_resonance(star_row_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.stars
    SET resonance_count = resonance_count + 1
    WHERE id = star_row_id;
END;
$$;

-- Cleanup expired knot sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_knots()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.knot_sessions
    SET is_active = false
    WHERE expires_at < now() AND is_active = true;
END;
$$;

-- 5. SEED DATA (Optional - Uncomment to run)
/*
INSERT INTO public.stars (message_text, emotion, resonance_count) VALUES
('I feel so infinite today.', 'joy', 5),
('Why did I say that?', 'regret', 2),
('Hope is a dangerous thing.', 'hope', 12),
('The silence is loud.', 'loneliness', 0),
('I forgive you.', 'love', 8);
*/
