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
      
      <main className="min-h-[calc(100vh-140px)]">
        {children}
      </main>
      
      <footer className="bg-nav-bg border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 hub4porn.com - Deine Video-Plattform</p>
        </div>
      </footer>
    </div>
  );
};