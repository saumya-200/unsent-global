-- Resonance Trackers Table: Prevents duplicate resonance within 24h
CREATE TABLE IF NOT EXISTS public.resonance_trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id UUID REFERENCES public.stars(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookup of (star_id, ip_address)
CREATE INDEX IF NOT EXISTS idx_resonance_composite ON public.resonance_trackers(star_id, ip_address);

-- TTL Cleanup Function (Optional: can be run via pg_cron or manual maintenance)
-- For now, we'll just check timestamps in the application logic.
