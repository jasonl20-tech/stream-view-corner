import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { VideoGrid } from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { decodeSlug } from "@/lib/slug";
import { Layout } from "@/components/Layout";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [decodedCategoryName, setDecodedCategoryName] = useState("");

  useEffect(() => {
    if (categoryName) {
      setDecodedCategoryName(decodeSlug(categoryName));
    }
  }, [categoryName]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            Kategorie: {decodedCategoryName}
          </h1>
        </div>

        <VideoGrid activeCategory={decodedCategoryName} />
      </div>
    </Layout>
  );
};

export default CategoryPage;