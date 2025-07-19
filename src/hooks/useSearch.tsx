import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      // Navigate to videos page with search query
      navigate(`/videos?search=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { performSearch, loading };
};