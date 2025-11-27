import newsletterImage from "@assets/generated_images/Newsletter_email_preview_mockup_7585d18c.png";
import { Check } from "lucide-react";

const contentHighlights = [
  "Latest research papers explained",
  "Step-by-step implementation tutorials",
  "Industry news and job opportunities",
  "Tool recommendations and reviews",
  "Community highlights and discussions"
];

export default function NewsletterPreview() {
  return (
    <section className="py-20 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          <div className="md:col-span-2 order-2 md:order-1" data-testid="img-newsletter-preview">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border">
              <img 
                src={newsletterImage} 
                alt="Newsletter Email Preview"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-8 order-1 md:order-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                What You'll Get Every Week
              </h2>
              <p className="text-lg text-muted-foreground">
                Every Monday morning, receive a carefully curated 5-minute read 
                packed with actionable ML insights.
              </p>
            </div>

            <div className="space-y-4">
              {contentHighlights.map((highlight, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3"
                  data-testid={`item-highlight-${index}`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-mono font-semibold text-primary">
                  Every Monday • 5min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
