import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/hooks/useVideos";

export const useSimilarVideos = (currentVideo: Video | null, limit: number = 6) => {
  const [similarVideos, setSimilarVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSimilarVideos = async () => {
      if (!currentVideo) return;

      try {
        setLoading(true);

        // Sammle alle Tags des aktuellen Videos
        const currentTags = [
          currentVideo.tag_1, currentVideo.tag_2, currentVideo.tag_3, currentVideo.tag_4,
          currentVideo.tag_5, currentVideo.tag_6, currentVideo.tag_7, currentVideo.tag_8
        ].filter(Boolean);

        if (currentTags.length === 0) {
          setSimilarVideos([]);
          return;
        }

        // Hole alle Videos außer dem aktuellen
        const { data: allVideos, error } = await supabase
          .from('videos')
          .select('*')
          .neq('id', currentVideo.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Fehler beim Laden ähnlicher Videos:', error);
          return;
        }

        // Filtere Videos mit gemeinsamen Tags und bewerte sie
        const videosWithScore = (allVideos || []).map(video => {
          const videoTags = [
            video.tag_1, video.tag_2, video.tag_3, video.tag_4,
            video.tag_5, video.tag_6, video.tag_7, video.tag_8
          ].filter(Boolean);

          // Zähle gemeinsame Tags (case-insensitive)
          const commonTags = currentTags.filter(currentTag =>
            videoTags.some(videoTag => 
              videoTag && currentTag && videoTag.toLowerCase() === currentTag.toLowerCase()
            )
          );

          return {
            video,
            score: commonTags.length,
            commonTags
          };
        }).filter(item => item.score > 0); // Nur Videos mit mindestens einem gemeinsamen Tag

        // Sortiere nach Score (mehr gemeinsame Tags = höher) und dann nach Datum
        const sortedVideos = videosWithScore
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.video.created_at).getTime() - new Date(a.video.created_at).getTime();
          })
          .slice(0, limit)
          .map(item => item.video);

        setSimilarVideos(sortedVideos);
      } catch (err) {
        console.error('Fehler beim Laden ähnlicher Videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarVideos();
  }, [currentVideo, limit]);

  return { similarVideos, loading };
};