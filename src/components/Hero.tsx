import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent leading-tight">
          Deine Video-Plattform
        </h2>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
          Entdecke unbegrenzte Unterhaltung mit Tausenden von Videos in bester Qualität
        </p>
        
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center max-w-md xs:max-w-none mx-auto">
          <Button size="lg" className="btn-primary text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 w-full xs:w-auto min-w-[140px] xs:min-w-[160px]">
            <Play className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-2" />
            Jetzt schauen
          </Button>
          <Button size="lg" variant="outline" className="text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 border-white/20 text-white hover:bg-white/10 w-full xs:w-auto min-w-[140px] xs:min-w-[160px]">
            <TrendingUp className="h-3.5 w-3.5 xs:h-4 xs:w-4 md:h-5 md:w-5 mr-2" />
            Trending Videos
          </Button>
        </div>
      </div>
    </section>
  );
};