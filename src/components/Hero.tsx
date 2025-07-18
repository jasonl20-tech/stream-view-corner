import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
          Deine Video-Plattform
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Entdecke unbegrenzte Unterhaltung mit Tausenden von Videos in bester Qualität
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-primary text-lg px-8 py-4">
            <Play className="h-5 w-5 mr-2" />
            Jetzt schauen
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending Videos
          </Button>
        </div>
      </div>
    </section>
  );
};