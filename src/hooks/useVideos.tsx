import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  titel: string;
  describtion?: string;
  thumbnail?: string;
  embed?: string;
  duration: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
  image_9?: string;
  image_10?: string;
  image_11?: string;
  image_12?: string;
  image_13?: string;
  image_14?: string;
  tag_1?: string;
  tag_2?: string;
  tag_3?: string;
  tag_4?: string;
  tag_5?: string;
  tag_6?: string;
  tag_7?: string;
  tag_8?: string;
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
      setError(null);
      
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'Alle') {
        // Exakte case-insensitive Suche in allen Tag-Feldern
        const categoryLower = category.toLowerCase();
        query = query.or(`tag_1.ilike.${categoryLower},tag_2.ilike.${categoryLower},tag_3.ilike.${categoryLower},tag_4.ilike.${categoryLower},tag_5.ilike.${categoryLower},tag_6.ilike.${categoryLower},tag_7.ilike.${categoryLower},tag_8.ilike.${categoryLower}`);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      // Zusätzliche Filterung im Frontend für exakte Matches (case-insensitive)
      let filteredData = data || [];
      if (category && category !== 'Alle') {
        filteredData = (data || []).filter(video => {
          const tags = [
            video.tag_1, video.tag_2, video.tag_3, video.tag_4,
            video.tag_5, video.tag_6, video.tag_7, video.tag_8
          ].filter(Boolean);
          
          return tags.some(tag => 
            tag && tag.toLowerCase() === category.toLowerCase()
          );
        });
      }

      setVideos(filteredData);
    } catch (err) {
      setError('Ein Fehler ist aufgetreten beim Laden der Videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [category]);

  const formatViews = useMemo(() => {
    return (views: number): string => {
      if (!views || views === 0) return '0';
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(0)}K`;
      }
      return views.toString();
    };
  }, []);

  return {
    videos,
    loading,
    error,
    fetchVideos,
    formatViews
  };
};