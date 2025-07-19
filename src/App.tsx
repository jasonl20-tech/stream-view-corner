import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VideoDetail from "./pages/VideoDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Videos from "./pages/Videos";
import CategoryPage from "./pages/CategoryPage";
import AllCategoriesPage from "./pages/AllCategoriesPage";
import AdPreroll from "./pages/AdPreroll";
import Shorts from "./pages/Shorts";

const App = () => (
  <TooltipProvider>
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ad" element={<AdPreroll />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/:title" element={<VideoDetail />} />
      <Route path="/kategorien" element={<AllCategoriesPage />} />
      <Route path="/kategorie/:categoryName" element={<CategoryPage />} />
      <Route path="/shorts" element={<Shorts />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;