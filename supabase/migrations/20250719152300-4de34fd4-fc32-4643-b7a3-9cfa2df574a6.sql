-- Indizes für bessere Performance bei Tag-Suchen erstellen
CREATE INDEX IF NOT EXISTS idx_videos_tag_1 ON public.videos (tag_1);
CREATE INDEX IF NOT EXISTS idx_videos_tag_2 ON public.videos (tag_2);
CREATE INDEX IF NOT EXISTS idx_videos_tag_3 ON public.videos (tag_3);
CREATE INDEX IF NOT EXISTS idx_videos_tag_4 ON public.videos (tag_4);
CREATE INDEX IF NOT EXISTS idx_videos_tag_5 ON public.videos (tag_5);
CREATE INDEX IF NOT EXISTS idx_videos_tag_6 ON public.videos (tag_6);
CREATE INDEX IF NOT EXISTS idx_videos_tag_7 ON public.videos (tag_7);
CREATE INDEX IF NOT EXISTS idx_videos_tag_8 ON public.videos (tag_8);

-- Index für created_at für bessere Sortierung
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos (created_at DESC);