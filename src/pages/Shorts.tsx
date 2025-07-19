import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  titel: string;
  embed: string;
  thumbnail: string;
}

const Shorts = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomVideos = async () => {
    try {
      setLoading(true);
      // Hole 10 zufällige Videos mit embed content
      const { data, error } = await supabase
        .from('videos')
        .select('id, titel, embed, thumbnail')
        .not('embed', 'is', null)
        .not('embed', 'eq', '')
        .limit(10);

      if (error) throw error;

      // Mische die Videos zufällig
      const shuffledVideos = data?.sort(() => 0.5 - Math.random()) || [];
      setVideos(shuffledVideos);
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
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Shorts</h1>
            <div className="max-w-md mx-auto space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full">
                  <Skeleton className="w-full h-96 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Shorts</h1>
          
          <div className="max-w-md mx-auto space-y-6">
            {videos.map((video) => (
              <div key={video.id} className="w-full">
                <div 
                  className="w-full h-96 rounded-lg overflow-hidden bg-gray-900"
                  dangerouslySetInnerHTML={{ __html: video.embed }}
                />
                <h3 className="mt-4 text-lg font-semibold text-foreground line-clamp-2">
                  {video.titel}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={fetchRandomVideos}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Neue Videos laden
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shorts;