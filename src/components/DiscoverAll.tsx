import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const DiscoverAll = () => {
  return (
    <div className="text-center py-12 mb-12">
      <h2 className="text-3xl font-bold mb-4">Entdecke noch mehr Videos</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Tausende von Videos warten darauf, von dir entdeckt zu werden. 
        Durchstöbere unsere komplette Sammlung und finde genau das, was du suchst.
      </p>
      <Link to="/videos">
        <Button size="lg" className="group">
          Entdecke alle Videos
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};