import { VideoCard } from "./VideoCard";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="video-card">
            <Skeleton className="w-full h-48 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          id={video.id}
          title={video.titel}
          thumbnail={video.thumbnail || thumb1}
          duration={video.duration}
          views="0"
          category={video.tag_1 || 'Unbekannt'}
          uploadedAt={new Date(video.created_at).toLocaleDateString('de-DE', {
            day: 'numeric',
            month: 'short'
          })}
        />
      ))}
    </div>
  );
};