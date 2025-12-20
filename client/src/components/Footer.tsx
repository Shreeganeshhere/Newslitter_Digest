import { Brain } from "lucide-react";
import { SiGithub, SiX, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">ML Newslitter Digest</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your weekly dose of machine learning insights, research, and practical code examples.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-archive"
              >
                Newsletter Archive
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-about"
              >
                About Us
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-privacy"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-terms"
              >
                Terms of Service
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-md bg-muted flex items-center justify-center hover-elevate active-elevate-2"
                aria-label="GitHub"
                data-testid="link-github"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-md bg-muted flex items-center justify-center hover-elevate active-elevate-2"
                aria-label="X (Twitter)"
                data-testid="link-twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-md bg-muted flex items-center justify-center hover-elevate active-elevate-2"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ML Newslitter Digest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
