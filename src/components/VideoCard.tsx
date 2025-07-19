import { Play, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createSlug } from "@/lib/slug";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  uploadedAt: string;
}

export const VideoCard = ({ id, title, thumbnail, duration, views, category, uploadedAt }: VideoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = createSlug(title);
    navigate(`/ad?video=${slug}`);
  };

  return (
    <div className="video-card group cursor-pointer bg-card rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={handleClick}>
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-20 xs:h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary/90 text-primary-foreground rounded-full p-2 sm:p-3 backdrop-blur-sm">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
          <Clock className="inline h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
          <span className="text-xs">{duration}</span>
        </div>
      </div>
      
      <div className="p-2.5 sm:p-3 md:p-4">
        <h3 className="font-semibold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight text-xs sm:text-sm md:text-base">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium">{views}</span>
          </div>
          <span className="text-xs">{uploadedAt}</span>
        </div>
      </div>
    </div>
  );
};