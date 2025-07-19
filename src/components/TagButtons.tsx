import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface TagButtonsProps {
  onTagSelect: (tag: string) => void;
  activeTag: string;
}

export const TagButtons = ({ onTagSelect, activeTag }: TagButtonsProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('tag_1, tag_2, tag_3, tag_4, tag_5, tag_6, tag_7, tag_8');

      if (error) throw error;

      // Sammle alle Tags und entferne Duplikate
      const allTags = new Set<string>();
      data?.forEach((video) => {
        [
          video.tag_1,
          video.tag_2,
          video.tag_3,
          video.tag_4,
          video.tag_5,
          video.tag_6,
          video.tag_7,
          video.tag_8,
        ].forEach((tag) => {
          if (tag && tag.trim()) {
            allTags.add(tag.trim());
          }
        });
      });

      // Wähle 8 zufällige Tags aus
      const shuffledTags = Array.from(allTags)
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      
      setTags(shuffledTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 bg-muted rounded-full w-20 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Vorgeschlagene Kategorien</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTag === "Alle" ? "default" : "outline"}
          onClick={() => onTagSelect("Alle")}
          className="rounded-full hover:scale-105 transition-transform"
        >
          Alle
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            onClick={() => onTagSelect(tag)}
            className="rounded-full hover:scale-105 transition-transform"
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};