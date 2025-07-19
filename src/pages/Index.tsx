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
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        <CategoryGrid />
        
        <TagButtons onTagSelect={setActiveTag} activeTag={activeTag} />
        
        <PopularToday />
        
        <DiscoverAll />
      </div>
    </Layout>
  );
};

export default Index;
