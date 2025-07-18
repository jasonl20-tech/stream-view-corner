import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  duration: string;
  views_count: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useVideos = (category?: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'Alle') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      setVideos(data || []);
    } catch (err) {
      setError('Ein Fehler ist aufgetreten beim Laden der Videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [category]);

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const incrementViews = async (videoId: string) => {
    // Erst den aktuellen Wert abrufen, dann inkrementieren
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const { error } = await supabase
      .from('videos')
      .update({ views_count: video.views_count + 1 })
      .eq('id', videoId);

    if (!error) {
      // Update local state
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, views_count: video.views_count + 1 }
          : video
      ));
    }
  };

  return {
    videos,
    loading,
    error,
    fetchVideos,
    formatViews,
    incrementViews
  };
};