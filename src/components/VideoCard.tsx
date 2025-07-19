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
    <div className="video-card group cursor-pointer" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white" fill="white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          <Clock className="inline h-3 w-3 mr-1" />
          {duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {views}
            </span>
            <span>{uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};