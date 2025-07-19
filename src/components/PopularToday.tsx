import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/hooks/useVideos";
import { Flame } from "lucide-react";

export const PopularToday = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const generateRandomViews = () => {
    return Math.floor(Math.random() * 900000) + 100000; // 100K to 1M views
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const fetchRandomVideos = async () => {
    try {
      setLoading(true);
      
      // Hole alle Video IDs
      const { data: allVideos, error } = await supabase
        .from('videos')
        .select('id')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!allVideos || allVideos.length === 0) {
        setVideos([]);
        return;
      }

      // Wähle 20 zufällige Videos aus
      const shuffled = [...allVideos].sort(() => 0.5 - Math.random());
      const selectedIds = shuffled.slice(0, Math.min(20, allVideos.length));

      // Hole die vollständigen Daten für die ausgewählten Videos
      const { data: randomVideos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', selectedIds.map(v => v.id));

      if (videosError) throw videosError;

      setVideos(randomVideos || []);
    } catch (error) {
      console.error('Error fetching random videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomVideos();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Popular Today</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-xl h-48 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-3 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold">Popular Today</h2>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
          HOT
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.titel}
            thumbnail={video.thumbnail || video.image_1 || "/placeholder.svg"}
            duration={video.duration}
            views={formatViews(generateRandomViews())}
            category={video.tag_1 || "General"}
            uploadedAt="2 hours ago"
          />
        ))}
      </div>
    </div>
  );
};