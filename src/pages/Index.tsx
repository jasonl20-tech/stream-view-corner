import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { VideoGrid } from "@/components/VideoGrid";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Alle");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Entdecke Videos</h2>
          <CategoryFilter 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        <VideoGrid activeCategory={activeCategory} />
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
