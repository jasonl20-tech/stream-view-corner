import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/hooks/useVideos";
import { Layout } from "@/components/Layout";

const Videos = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const videosPerPage = 40;
  const searchQuery = searchParams.get('search') || "";

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

  const fetchVideos = async (page: number, search?: string) => {
    try {
      setLoading(true);
      const from = (page - 1) * videosPerPage;
      const to = from + videosPerPage - 1;

      let query = supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .range(from, to);

      if (search?.trim()) {
        // Search in title and all tag fields
        query = query.or(`titel.ilike.%${search}%,tag_1.ilike.%${search}%,tag_2.ilike.%${search}%,tag_3.ilike.%${search}%,tag_4.ilike.%${search}%,tag_5.ilike.%${search}%,tag_6.ilike.%${search}%,tag_7.ilike.%${search}%,tag_8.ilike.%${search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

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
    fetchVideos(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [searchQuery]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Videos"}
            </h1>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-1">
                Found {videos.length} video{videos.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <p className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: videosPerPage }).map((_, i) => (
              <div key={i} className="video-card">
                <div className="w-full h-32 bg-muted rounded-t-lg animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-2 bg-muted rounded w-12 animate-pulse" />
                    <div className="h-2 bg-muted rounded w-16 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.titel}
                  thumbnail={video.thumbnail || "/placeholder.svg"}
                  duration={video.duration}
                  views={formatViews(generateRandomViews())}
                  category={video.tag_1 || 'Unknown'}
                  uploadedAt={new Date(video.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                  })}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      onClick={() => goToPage(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Videos;