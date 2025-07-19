import { VideoCard } from "./VideoCard";
import { AdCard } from "./AdCard";
import { useVideos } from "@/hooks/useVideos";
import { Skeleton } from "@/components/ui/skeleton";
import thumb1 from "@/assets/thumb1.jpg";
import thumb2 from "@/assets/thumb2.jpg";
import thumb3 from "@/assets/thumb3.jpg";
import thumb4 from "@/assets/thumb4.jpg";
import thumb5 from "@/assets/thumb5.jpg";
import thumb6 from "@/assets/thumb6.jpg";

interface VideoGridProps {
  activeCategory: string;
}

export const VideoGrid = ({ activeCategory }: VideoGridProps) => {
  const { videos, loading, error, formatViews } = useVideos(activeCategory);

  // Mapping für Thumbnails (da Assets lokal sind)
  const thumbnailMap: { [key: string]: string } = {
    '/assets/thumb1.jpg': thumb1,
    '/assets/thumb2.jpg': thumb2,
    '/assets/thumb3.jpg': thumb3,
    '/assets/thumb4.jpg': thumb4,
    '/assets/thumb5.jpg': thumb5,
    '/assets/thumb6.jpg': thumb6,
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="video-card">
            <Skeleton className="w-full h-20 xs:h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44 rounded-t-lg" />
            <div className="p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
              <Skeleton className="h-3 sm:h-4 w-full" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
                <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Keine Videos in dieser Kategorie gefunden.
        </p>
      </div>
    );
  }

  // Create array with ads inserted every 6th position
  const videosWithAds = [];
  videos.forEach((video, index) => {
    videosWithAds.push(video);
    if ((index + 1) % 6 === 0) {
      videosWithAds.push({ id: `ad-${index}`, isAd: true });
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {videosWithAds.map((item) => {
        if (item.isAd) {
          return <AdCard key={item.id} />;
        }
        
        const video = item as any;
        return (
          <VideoCard 
            key={video.id} 
            id={video.id}
            title={video.titel}
            thumbnail={video.thumbnail || thumb1}
            duration={video.duration}
            views="0"
            category={video.tag_1 || 'Unknown'}
            uploadedAt={new Date(video.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short'
            })}
          />
        );
      })}
    </div>
  );
};