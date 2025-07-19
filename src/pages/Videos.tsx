import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/hooks/useVideos";

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const videosPerPage = 40;

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

  const fetchVideos = async (page: number) => {
    try {
      setLoading(true);
      const from = (page - 1) * videosPerPage;
      const to = from + videosPerPage - 1;

      const { data, error, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setVideos(data || []);
      setTotalPages(Math.ceil((count || 0) / videosPerPage));
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alle Videos</h1>
          <p className="text-muted-foreground">
            Seite {currentPage} von {totalPages} • {videos.length} Videos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.titel}
              thumbnail={video.thumbnail || video.image_1 || "/placeholder.svg"}
              duration={video.duration}
              views={formatViews(generateRandomViews())}
              category={video.tag_1 || "Allgemein"}
              uploadedAt="vor 2 Tagen"
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => goToPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Videos;