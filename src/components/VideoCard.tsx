import { Play, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    navigate(`/video/${id}`);
  };

  return (
    <div className="video-card group cursor-pointer bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={handleClick}>
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary/90 text-primary-foreground rounded-full p-3 backdrop-blur-sm">
            <Play className="h-6 w-6" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          <Clock className="inline h-3 w-3 mr-1" />
          {duration}
        </div>
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{views}</span>
          </div>
          <span className="text-xs">{uploadedAt}</span>
        </div>
      </div>
    </div>
  );
};