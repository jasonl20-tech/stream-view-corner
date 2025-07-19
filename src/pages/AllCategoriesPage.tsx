import { useNavigate } from "react-router-dom";
import { AllCategoriesGrid } from "@/components/AllCategoriesGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

const AllCategoriesPage = () => {
  const navigate = useNavigate();

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
            Alle Kategorien
          </h1>
        </div>

        <AllCategoriesGrid />
      </div>
    </Layout>
  );
};

export default AllCategoriesPage;