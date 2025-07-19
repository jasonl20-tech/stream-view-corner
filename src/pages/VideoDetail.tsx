import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/hooks/useVideos";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createSlug } from "@/lib/slug";

const VideoDetail = () => {
  const { title: titleSlug } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!titleSlug) return;

      try {
        setLoading(true);
        
        // Hole alle Videos und finde das richtige basierend auf dem Slug
        const { data: videos, error } = await supabase
          .from('videos')
          .select('*');

        if (error) {
          setError(error.message);
          return;
        }

        // Finde das Video mit dem passenden Slug
        const matchedVideo = videos?.find(video => 
          createSlug(video.titel) === titleSlug
        );

        if (!matchedVideo) {
          setError('Video nicht gefunden');
          return;
        }

        setVideo(matchedVideo);
      } catch (err) {
        setError('Fehler beim Laden des Videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [titleSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="w-full h-96 mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {error || 'Video nicht gefunden'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tags = [
    video.tag_1, video.tag_2, video.tag_3, video.tag_4,
    video.tag_5, video.tag_6, video.tag_7, video.tag_8
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video bg-card rounded-lg overflow-hidden mb-6">
            {video.embed ? (
              <iframe
                src={video.embed}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={video.titel}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Kein Video verfügbar
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {video.titel}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {video.duration}
              </span>
              <span>
                {new Date(video.created_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            {video.describtion && (
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Beschreibung</h3>
                <p className="text-muted-foreground">{video.describtion}</p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;