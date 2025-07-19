import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const DiscoverAll = () => {
  return (
    <div className="text-center py-12 mb-12">
      <h2 className="text-3xl font-bold mb-4">Discover More Videos</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Thousands of videos are waiting to be discovered by you. 
        Browse our complete collection and find exactly what you're looking for.
      </p>
      <Link to="/videos">
        <Button size="lg" className="group">
          Discover All Videos
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};