import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const [, setLocation] = useLocation();
  
  const scrollToSubscribe = () => {
    // Go to the landing page (original home) which contains the subscribe form
    setLocation("/subscribe");
    // Ensure we start at the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-border/40 bg-background/80">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-2 py-1 -ml-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold" data-testid="text-logo">ML Newslitter Digest</span>
          </button>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              className="rounded-full px-6"
              data-testid="button-spaces"
              onClick={() => setLocation("/")}
            >
              Spaces
            </Button>
            <Button 
              onClick={scrollToSubscribe}
              className="rounded-full px-6"
              data-testid="button-header-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
