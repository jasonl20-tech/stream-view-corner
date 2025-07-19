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

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
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
        fetchCategories();
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

  const fetchCategories = async () => {
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

      // Zeige nur 8 zufällige Kategorien auf der Startseite
      const shuffled = categoryList.sort(() => 0.5 - Math.random());
      const selectedCategories = shuffled.slice(0, 8);
      
      setCategories(selectedCategories);

      // Automatisch Bilder für Kategorien ohne Bilder generieren
      selectedCategories.forEach((category, index) => {
        if (!category.image_url && !generatingImages.has(category.name)) {
          // Gestaffelte Generierung um API-Rate-Limits zu vermeiden
          setTimeout(() => {
            console.log(`Starting image generation for category: ${category.name}`);
            generateCategoryImage(category.name);
          }, index * 3000); // 3 Sekunden Abstand zwischen Generierungen
        }
      });

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
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="category-card">
            <Skeleton className="w-full h-20 xs:h-22 sm:h-24 rounded-lg" />
            <Skeleton className="h-3 sm:h-4 w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Categories</h2>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="category-card cursor-pointer group"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 h-16 xs:h-18 sm:h-20 md:h-22 lg:h-24 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/50 transition-all duration-300">
              {generatingImages.has(category.name) ? (
                <div className="flex flex-col items-center justify-center text-primary-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white mb-0.5 sm:mb-1"></div>
                  <span className="text-xs hidden sm:block">Generating...</span>
                </div>
              ) : category.image_url ? (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-primary-foreground font-semibold text-sm sm:text-base md:text-lg">
                  {category.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 text-center group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 sm:mt-6">
        <button 
          onClick={() => navigate('/kategorien')}
          className="btn-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:scale-105 transition-transform duration-200 text-sm sm:text-base"
        >
          See All Categories
        </button>
      </div>
    </div>
  );
};