import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";
import { useRandomVideo } from "@/hooks/useRandomVideo";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { navigateToRandomVideo, loading } = useRandomVideo();
  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/lovable-uploads/c5095cf5-b5c9-469f-adb7-634874730766.png)` }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center max-w-md xs:max-w-none mx-auto">
          <Button 
            size="lg" 
            className="btn-primary text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 w-full xs:w-auto min-w-[140px] xs:min-w-[160px]"
            onClick={navigateToRandomVideo}
            disabled={loading}
          >
            <Play className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-2" />
            {loading ? "Loading..." : "Random Video"}
          </Button>
          <Button size="lg" variant="outline" className="text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 border-white/20 text-white hover:bg-white/10 w-full xs:w-auto min-w-[140px] xs:min-w-[160px]" asChild>
            <Link to="/shorts">
              <TrendingUp className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-2" />
              Shorts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};