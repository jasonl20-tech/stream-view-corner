import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TagButtons } from "@/components/TagButtons";
import { PopularToday } from "@/components/PopularToday";
import { DiscoverAll } from "@/components/DiscoverAll";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  const [activeTag, setActiveTag] = useState("Alle");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <TagButtons onTagSelect={setActiveTag} activeTag={activeTag} />
        
        <PopularToday />
        
        <DiscoverAll />
      </main>
      
      <footer className="bg-nav-bg border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 hub4porn.com - Deine Video-Plattform</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
