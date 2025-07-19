import { useEffect, useRef } from "react";

export const AdCard = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      // Create script elements for first ad
      const jadsScript1 = document.createElement('script');
      jadsScript1.type = 'text/javascript';
      jadsScript1.setAttribute('data-cfasync', 'false');
      jadsScript1.async = true;
      jadsScript1.src = 'https://poweredby.jads.co/js/jads.js';

      const adScript1 = document.createElement('script');
      adScript1.type = 'text/javascript';
      adScript1.setAttribute('data-cfasync', 'false');
      adScript1.async = true;
      adScript1.innerHTML = `(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1080434});`;

      // Create script elements for second ad
      const jadsScript2 = document.createElement('script');
      jadsScript2.type = 'text/javascript';
      jadsScript2.setAttribute('data-cfasync', 'false');
      jadsScript2.async = true;
      jadsScript2.src = 'https://poweredby.jads.co/js/jads.js';

      const adScript2 = document.createElement('script');
      adScript2.type = 'text/javascript';
      adScript2.setAttribute('data-cfasync', 'false');
      adScript2.async = true;
      adScript2.innerHTML = `(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1080431});`;

      // Append scripts to head
      document.head.appendChild(jadsScript1);
      document.head.appendChild(adScript1);
      document.head.appendChild(jadsScript2);
      document.head.appendChild(adScript2);

      return () => {
        // Cleanup
        if (document.head.contains(jadsScript1)) document.head.removeChild(jadsScript1);
        if (document.head.contains(adScript1)) document.head.removeChild(adScript1);
        if (document.head.contains(jadsScript2)) document.head.removeChild(jadsScript2);
        if (document.head.contains(adScript2)) document.head.removeChild(adScript2);
      };
    }
  }, []);

  return (
    <div className="video-card group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="w-full h-20 xs:h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44 flex flex-col items-center justify-center p-2 space-y-1">
          <ins 
            id="1080434" 
            data-width="300" 
            data-height="100"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          ></ins>
          <ins 
            id="1080431" 
            data-width="300" 
            data-height="250"
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