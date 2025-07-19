import { Header } from "@/components/Header";

interface LayoutProps {
  children: React.ReactNode;
  showHero?: boolean;
}

export const Layout = ({ children, showHero = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {showHero && (
        <div>
          {/* Hero wird separat hinzugefügt wenn needed */}
        </div>
      )}
      
      <main className="min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)]">
        {children}
      </main>
      
      <footer className="bg-nav-bg border-t border-border mt-8 sm:mt-12 md:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">&copy; 2024 hub4porn.com - Deine Video-Plattform</p>
        </div>
      </footer>
    </div>
  );
};