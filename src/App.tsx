import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VideoDetail from "./pages/VideoDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Videos from "./pages/Videos";

const App = () => (
  <TooltipProvider>
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/:title" element={<VideoDetail />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;