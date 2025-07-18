import { VideoCard } from "./VideoCard";
import thumb1 from "@/assets/thumb1.jpg";
import thumb2 from "@/assets/thumb2.jpg";
import thumb3 from "@/assets/thumb3.jpg";
import thumb4 from "@/assets/thumb4.jpg";
import thumb5 from "@/assets/thumb5.jpg";
import thumb6 from "@/assets/thumb6.jpg";

const mockVideos = [
  {
    id: "1",
    title: "Epic Gaming Moments - Die besten Highlights 2024",
    thumbnail: thumb1,
    duration: "15:30",
    views: "2.4M",
    category: "Gaming",
    uploadedAt: "vor 2 Tagen"
  },
  {
    id: "2", 
    title: "Moderne Web-Entwicklung Tutorial - React & TypeScript",
    thumbnail: thumb2,
    duration: "22:15",
    views: "856K",
    category: "Technologie",
    uploadedAt: "vor 1 Woche"
  },
  {
    id: "3",
    title: "Entspannende Musik für Produktivität und Focus",
    thumbnail: thumb3,
    duration: "45:20",
    views: "1.2M",
    category: "Musik",
    uploadedAt: "vor 3 Tagen"
  },
  {
    id: "4",
    title: "Wissenschaft einfach erklärt - Quantenphysik Grundlagen",
    thumbnail: thumb4,
    duration: "18:45",
    views: "567K",
    category: "Bildung",
    uploadedAt: "vor 5 Tagen"
  },
  {
    id: "5",
    title: "Fußball WM Highlights - Beste Tore und Momente",
    thumbnail: thumb5,
    duration: "12:30",
    views: "3.1M",
    category: "Sport",
    uploadedAt: "vor 1 Tag"
  },
  {
    id: "6",
    title: "Comedy Gold - Die lustigsten Momente des Jahres",
    thumbnail: thumb6,
    duration: "25:10",
    views: "1.8M",
    category: "Entertainment",
    uploadedAt: "vor 4 Tagen"
  },
  {
    id: "7",
    title: "Fortgeschrittene Gaming Strategien - Pro Tipps",
    thumbnail: thumb1,
    duration: "19:20",
    views: "945K",
    category: "Gaming",
    uploadedAt: "vor 1 Woche"
  },
  {
    id: "8",
    title: "KI und Machine Learning - Zukunft der Technologie",
    thumbnail: thumb2,
    duration: "28:55",
    views: "1.3M",
    category: "Technologie",
    uploadedAt: "vor 2 Wochen"
  },
  {
    id: "9",
    title: "Live Concert Experience - Electronic Music Festival",
    thumbnail: thumb3,
    duration: "52:40",
    views: "2.7M",
    category: "Musik",
    uploadedAt: "vor 6 Tage"
  }
];

interface VideoGridProps {
  activeCategory: string;
}

export const VideoGrid = ({ activeCategory }: VideoGridProps) => {
  const filteredVideos = activeCategory === "Alle" 
    ? mockVideos 
    : mockVideos.filter(video => video.category === activeCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVideos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
};