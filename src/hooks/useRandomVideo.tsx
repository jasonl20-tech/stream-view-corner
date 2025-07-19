import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRandomVideo = () => {
  const [loading, setLoading] = useState(false);

  const navigateToRandomVideo = async () => {
    try {
      setLoading(true);
      
      // Hole ein zufälliges Video
      const { data, error } = await supabase
        .from('videos')
        .select('id, titel')
        .limit(1000); // Hole viele Videos um dann zufällig auszuwählen

      if (error) throw error;

      if (data && data.length > 0) {
        // Wähle ein zufälliges Video aus
        const randomVideo = data[Math.floor(Math.random() * data.length)];
        
        // Erstelle den Slug aus dem Titel
        const slug = randomVideo.titel
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Navigiere zum Video
        window.location.href = `/videos/${slug}`;
      }
    } catch (error) {
      console.error('Error navigating to random video:', error);
    } finally {
      setLoading(false);
    }
  };

  return { navigateToRandomVideo, loading };
};