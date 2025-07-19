import { VideoCard } from "./VideoCard";
import { useSimilarVideos } from "@/hooks/useSimilarVideos";
import { Video } from "@/hooks/useVideos";
import { Skeleton } from "@/components/ui/skeleton";
import thumb1 from "@/assets/thumb1.jpg";

interface SimilarVideosProps {
  currentVideo: Video;
}

export const SimilarVideos = ({ currentVideo }: SimilarVideosProps) => {
  const { similarVideos, loading } = useSimilarVideos(currentVideo, 8);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Ähnliche Videos</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="video-card">
              <Skeleton className="w-full h-32 rounded-t-lg" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-2 w-12" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarVideos.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Ähnliche Videos</h2>
        <p className="text-muted-foreground text-center py-8">
          Keine ähnlichen Videos gefunden.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Ähnliche Videos</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {similarVideos.map((video) => (
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
    </div>
  );
};