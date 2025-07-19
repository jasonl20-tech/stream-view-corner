import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { createSlug } from "@/lib/slug";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
}

export const AllCategoriesGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const generateCategoryImage = async (categoryName: string) => {
    // Prüfe zuerst, ob bereits ein Bild existiert
    if (categories.find(cat => cat.name === categoryName)?.image_url) {
      console.log(`Image already exists for category: ${categoryName}`);
      return;
    }

    try {
      setGeneratingImages(prev => new Set(prev).add(categoryName));
      
      const { data, error } = await supabase.functions.invoke('generate-category-image', {
        body: {
          positivePrompt: `${categoryName} category icon`,
          categoryName: categoryName
        }
      });

      if (error) {
        console.error('Error generating image:', error);
        toast.error(`Fehler beim Generieren des Bildes für ${categoryName}: ${error.message}`);
        return null;
      }

      if (data?.success && data?.imageUrl) {
        if (data.message === 'Image already exists') {
          console.log(`Image already existed for ${categoryName}`);
        } else {
          toast.success(`Bild für ${categoryName} erfolgreich generiert!`);
        }
        
        // Refresh categories to show the new image
        fetchAllCategories();
        return data.imageUrl;
      } else {
        console.error('Unexpected response format:', data);
        toast.error(`Unerwartete Antwort beim Generieren des Bildes für ${categoryName}`);
      }
    } catch (error) {
      console.error('Error in generateCategoryImage:', error);
      toast.error(`Fehler beim Generieren des Bildes für ${categoryName}: ${error.message}`);
    } finally {
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryName);
        return newSet;
      });
    }
    return null;
  };

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      
      // Hole alle einzigartigen Kategorien aus den Videos
      const { data: videos, error } = await supabase
        .from('videos')
        .select('tag_1')
        .not('tag_1', 'is', null);

      if (error) {
        console.error('Fehler beim Laden der Video-Tags:', error);
        return;
      }

      // Extrahiere einzigartige Tags
      const uniqueTags = [...new Set(videos?.map(video => video.tag_1).filter(Boolean))];
      
      // Hole existierende Kategorien aus der categories Tabelle
      const { data: existingCategories, error: categoryError } = await supabase
        .from('categories')
        .select('*');

      if (categoryError) {
        console.error('Fehler beim Laden der Kategorien:', categoryError);
        return;
      }

      // Erstelle Kategorien-Array mit existierenden Daten oder Fallback
      const categoryList: Category[] = uniqueTags.map(tag => {
        const existingCategory = existingCategories?.find(cat => cat.name === tag);
        return {
          id: existingCategory?.id || tag,
          name: tag,
          image_url: existingCategory?.image_url,
          description: existingCategory?.description
        };
      });

      // Zeige alle Kategorien alphabetisch sortiert
      const sortedCategories = categoryList.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);

      // Automatisch Bilder für Kategorien ohne Bilder generieren (begrenzt auf 2 gleichzeitig)
      const categoriesWithoutImages = sortedCategories.filter(cat => !cat.image_url);
      let generating = 0;
      const maxConcurrent = 2;

      for (const [index, category] of categoriesWithoutImages.entries()) {
        if (generating >= maxConcurrent) break;
        if (!generatingImages.has(category.name)) {
          generating++;
          setTimeout(() => {
            console.log(`Starting image generation for category: ${category.name}`);
            generateCategoryImage(category.name);
          }, index * 4000); // 4 Sekunden Abstand zwischen Generierungen
        }
      }

    } catch (err) {
      console.error('Fehler beim Laden der Kategorien:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const slug = createSlug(categoryName);
    navigate(`/kategorie/${slug}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="category-card">
            <Skeleton className="w-full h-24 rounded-lg" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <div 
          key={category.id}
          className="category-card cursor-pointer group"
          onClick={() => handleCategoryClick(category.name)}
        >
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 h-24 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/50 transition-all duration-300">
            {generatingImages.has(category.name) ? (
              <div className="flex flex-col items-center justify-center text-primary-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-1"></div>
                <span className="text-xs">Generiere...</span>
              </div>
            ) : category.image_url ? (
              <img 
                src={category.image_url} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-primary-foreground font-semibold text-lg">
                {category.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium mt-2 text-center group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
        </div>
      ))}
    </div>
  );
};