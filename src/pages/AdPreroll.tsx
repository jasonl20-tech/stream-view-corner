import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

export default function AdPreroll() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [showSkipButton, setShowSkipButton] = useState(false);
  
  const videoTitle = searchParams.get('video');
  
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

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowSkipButton(true);
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleSkip = () => {
    if (videoTitle) {
      navigate(`/videos/${videoTitle}`);
    } else {
      navigate('/');
    }
  };

  const progressValue = ((5 - countdown) / 5) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Ad Container */}
        <div className="bg-card rounded-lg p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Werbung</h1>
            <p className="text-muted-foreground">
              Dein Video startet gleich...
            </p>
          </div>
          
          {/* Ad Embed */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 min-h-[200px] w-full max-w-md flex items-center justify-center">
              <ins 
                id="1080434" 
                data-width="300" 
                data-height="150"
                style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              ></ins>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress value={progressValue} className="w-full" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {countdown > 0 ? `Video startet in ${countdown} Sekunden` : 'Du kannst das Video jetzt ansehen'}
              </span>
              
              {showSkipButton && (
                <Button 
                  onClick={handleSkip}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Überspringen
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Auto-redirect message */}
        {showSkipButton && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Oder klicke{" "}
              <button 
                onClick={handleSkip}
                className="text-primary hover:underline font-medium"
              >
                hier
              </button>
              {" "}um sofort zum Video zu gelangen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}