import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Video {
  id: string;
  titel: string;
  embed: string;
  thumbnail: string;
}

const Shorts = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  const fetchRandomVideos = async () => {
    try {
      setLoading(true);
      // Hole 20 zufällige Videos mit embed content
      const { data, error } = await supabase
        .from('videos')
        .select('id, titel, embed, thumbnail')
        .not('embed', 'is', null)
        .not('embed', 'eq', '')
        .limit(20);

      if (error) throw error;

      // Mische die Videos zufällig
      const shuffledVideos = data?.sort(() => 0.5 - Math.random()) || [];
      setVideos(shuffledVideos);
      setCurrentVideoIndex(0);
    } catch (error) {
      console.error('Error fetching random videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToVideo = (index: number) => {
    if (containerRef.current) {
      const videoElement = containerRef.current.children[index] as HTMLElement;
      if (videoElement) {
        videoElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && currentVideoIndex > 0) {
      event.preventDefault();
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      scrollToVideo(newIndex);
    } else if (event.key === 'ArrowDown' && currentVideoIndex < videos.length - 1) {
      event.preventDefault();
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      scrollToVideo(newIndex);
    }
  };

  useEffect(() => {
    fetchRandomVideos();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideoIndex, videos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, videos.length]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black">
        <div className="flex items-center justify-center h-full">
          <Skeleton className="w-full max-w-md h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Header mit Logo und Reload Button */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Shorts</h1>
          <Button
            onClick={fetchRandomVideos}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="h-screen w-full snap-start relative flex items-center justify-center"
          >
            <iframe
              ref={el => videoRefs.current[index] = el}
              src={video.embed}
              className="w-full h-full object-cover"
              frameBorder="0"
              allowFullScreen
              title={video.titel}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-20 left-4 right-4 z-10">
              <h3 className="text-white text-lg font-semibold leading-tight line-clamp-2 drop-shadow-lg">
                {video.titel}
              </h3>
            </div>

            {/* Video Counter */}
            <div className="absolute bottom-4 right-4 z-10">
              <div className="bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                {index + 1} / {videos.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-4 left-4 z-20 text-white/70 text-sm">
        <p>↑↓ Pfeiltasten oder Scrollen</p>
      </div>
    </div>
  );
};

export default Shorts;