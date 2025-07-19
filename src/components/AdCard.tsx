import { useEffect, useRef } from "react";

export const AdCard = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      // Create script elements
      const jadsScript = document.createElement('script');
      jadsScript.type = 'text/javascript';
      jadsScript.setAttribute('data-cfasync', 'false');
      jadsScript.async = true;
      jadsScript.src = 'https://poweredby.jads.co/js/jads.js';

      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.setAttribute('data-cfasync', 'false');
      adScript.async = true;
      adScript.innerHTML = `(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1080434});`;

      // Append scripts to head
      document.head.appendChild(jadsScript);
      document.head.appendChild(adScript);

      return () => {
        // Cleanup
        document.head.removeChild(jadsScript);
        document.head.removeChild(adScript);
      };
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className="bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center h-20 xs:h-24 sm:h-28 md:h-36 lg:h-40 xl:h-44"
    >
      <div className="text-center p-4">
        <ins 
          id="1080434" 
          data-width="300" 
          data-height="100"
        ></ins>
        <p className="text-xs text-muted-foreground mt-2">Advertisement</p>
      </div>
    </div>
  );
};