import { useState, useEffect, useRef, useCallback } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lade ein einzelnes zufälliges Video
  const fetchRandomVideo = async (): Promise<Video | null> => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('id, titel, embed, thumbnail')
        .not('embed', 'is', null)
        .not('embed', 'eq', '')
        .limit(1000); // Hole viele Videos für bessere Zufälligkeit

      if (error) throw error;

      if (data && data.length > 0) {
        // Wähle ein zufälliges Video aus
        const randomVideo = data[Math.floor(Math.random() * data.length)];
        
        // Füge Autoplay-Parameter zur embed URL hinzu
        const autoplayUrl = randomVideo.embed.includes('?') 
          ? `${randomVideo.embed}&autoplay=1&muted=1`
          : `${randomVideo.embed}?autoplay=1&muted=1`;
        
        return {
          ...randomVideo,
          embed: autoplayUrl
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching random video:', error);
      return null;
    }
  };

  // Lade mehrere zufällige Videos für den Start
  const fetchInitialVideos = async () => {
    try {
      setLoading(true);
      const initialVideos: Video[] = [];
      
      // Lade 3 initiale Videos
      for (let i = 0; i < 3; i++) {
        const video = await fetchRandomVideo();
        if (video) {
          initialVideos.push(video);
        }
      }
      
      setVideos(initialVideos);
      setCurrentVideoIndex(0);
    } catch (error) {
      console.error('Error fetching initial videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lade ein neues Video nach
  const loadMoreVideo = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    const newVideo = await fetchRandomVideo();
    
    if (newVideo) {
      setVideos(prev => [...prev, newVideo]);
      // Erweitere videoRefs Array
      videoRefs.current.push(null);
    }
    setLoadingMore(false);
  }, [loadingMore]);

  // Scroll zu einem bestimmten Video
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

  // Handle Scroll Events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex < videos.length) {
      // Stoppe das vorherige Video
      stopVideo(currentVideoIndex);
      
      setCurrentVideoIndex(newIndex);
      
      // Wenn wir uns dem Ende nähern, lade ein neues Video
      if (newIndex >= videos.length - 2) {
        loadMoreVideo();
      }
    }
  }, [currentVideoIndex, videos.length, loadMoreVideo]);

  // Stoppe ein Video durch iframe reload
  const stopVideo = (index: number) => {
    const iframe = videoRefs.current[index];
    if (iframe && iframe.src) {
      const currentSrc = iframe.src;
      iframe.src = 'about:blank'; // Stoppe das Video
      setTimeout(() => {
        if (iframe) {
          iframe.src = currentSrc; // Lade es wieder, aber pausiert
        }
      }, 100);
    }
  };

  // Starte/Fokussiere ein Video
  const focusVideo = (index: number) => {
    // Stoppe alle anderen Videos
    videoRefs.current.forEach((iframe, i) => {
      if (i !== index && iframe) {
        const currentSrc = iframe.src;
        iframe.src = 'about:blank';
        setTimeout(() => {
          if (iframe) {
            iframe.src = currentSrc;
          }
        }, 100);
      }
    });
  };

  // Keyboard Navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && currentVideoIndex > 0) {
      event.preventDefault();
      const newIndex = currentVideoIndex - 1;
      stopVideo(currentVideoIndex); // Stoppe aktuelles Video
      setCurrentVideoIndex(newIndex);
      scrollToVideo(newIndex);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const newIndex = currentVideoIndex + 1;
      stopVideo(currentVideoIndex); // Stoppe aktuelles Video
      
      // Wenn das nächste Video nicht existiert, lade es
      if (newIndex >= videos.length) {
        loadMoreVideo().then(() => {
          setCurrentVideoIndex(newIndex);
          // Warte kurz und scrolle dann
          setTimeout(() => scrollToVideo(newIndex), 100);
        });
      } else {
        setCurrentVideoIndex(newIndex);
        scrollToVideo(newIndex);
      }
    }
  }, [currentVideoIndex, videos.length, loadMoreVideo]);

  // Setup Intersection Observer für automatisches Laden
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoElement = entry.target as HTMLElement;
            const index = parseInt(videoElement.dataset.index || '0');
            
            // Wenn wir das vorletzte Video sehen, lade ein neues
            if (index >= videos.length - 2) {
              loadMoreVideo();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos.length, loadMoreVideo]);

  // Observe Video Elements
  useEffect(() => {
    if (observerRef.current && containerRef.current) {
      const videoElements = containerRef.current.children;
      Array.from(videoElements).forEach((element) => {
        observerRef.current?.observe(element);
      });
    }
  }, [videos]);

  // Event Listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Initial Load
  useEffect(() => {
    fetchInitialVideos();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Skeleton className="w-full max-w-md h-96 rounded-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-black overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Shorts Header */}
        <div className="absolute top-16 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Shorts</h1>
            <Button
              onClick={fetchInitialVideos}
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
              key={`${video.id}-${index}`}
              data-index={index}
              className="w-full snap-start relative flex items-center justify-center"
              style={{ height: 'calc(100vh - 4rem)' }}
            >
              <iframe
                ref={el => {
                  if (videoRefs.current) {
                    videoRefs.current[index] = el;
                  }
                }}
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
                  {index + 1} {loadingMore && index === videos.length - 1 ? '(+∞)' : ''}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loadingMore && (
            <div 
              className="w-full snap-start relative flex items-center justify-center bg-gray-900"
              style={{ height: 'calc(100vh - 4rem)' }}
            >
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Lädt neues Video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="absolute bottom-4 left-4 z-20 text-white/70 text-sm">
          <p>↑↓ Pfeiltasten oder Scrollen • ∞ Unendlich</p>
        </div>
      </div>
    </Layout>
  );
};

export default Shorts;