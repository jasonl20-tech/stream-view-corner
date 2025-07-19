
import { useEffect, useRef } from "react";

export const AdCard = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the main jads script only once globally if not already loaded
    if (!document.querySelector('script[src="https://poweredby.jads.co/js/jads.js"]')) {
      const jadsScript = document.createElement('script');
      jadsScript.type = 'text/javascript';
      jadsScript.setAttribute('data-cfasync', 'false');
      jadsScript.async = true;
      jadsScript.src = 'https://poweredby.jads.co/js/jads.js';
      document.head.appendChild(jadsScript);
    }

    // Initialize ad after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if ((window as any).adsbyjuicy) {
        (window as any).adsbyjuicy.push({'adzone': 1080434});
      } else {
        // Initialize the global ads array and push ad
        (window as any).adsbyjuicy = (window as any).adsbyjuicy || [];
        (window as any).adsbyjuicy.push({'adzone': 1080434});
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="video-card group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="w-full h-20 xs:h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44 flex items-center justify-center p-2">
          <ins 
            id="1080434" 
            data-width="250" 
            data-height="80"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          ></ins>
        </div>
      </div>
      
      <div className="p-2.5 sm:p-3 md:p-4 bg-card rounded-b-xl">
        <p className="text-xs text-muted-foreground text-center font-medium">
          Advertisement
        </p>
      </div>
    </div>
  );
};
