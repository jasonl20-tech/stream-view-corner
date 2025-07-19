import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TagButtons } from "@/components/TagButtons";
import { PopularToday } from "@/components/PopularToday";
import { DiscoverAll } from "@/components/DiscoverAll";
import { Layout } from "@/components/Layout";

const Index = () => {
  const [activeTag, setActiveTag] = useState("Alle");

  return (
    <Layout>
      <Hero />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <CategoryGrid />
        
        <TagButtons onTagSelect={setActiveTag} activeTag={activeTag} />
        
        <PopularToday />
        
        <DiscoverAll />
      </div>
    </Layout>
  );
};

export default Index;
