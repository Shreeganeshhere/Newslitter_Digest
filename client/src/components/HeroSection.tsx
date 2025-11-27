import EmailSubscriptionForm from "./EmailSubscriptionForm";
import heroImage from "@assets/generated_images/ML_neural_network_visualization_bb1d41ce.png";
import { Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center py-20 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Stay Ahead in{" "}
                <span className="text-primary">Machine Learning</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Get weekly insights, cutting-edge research, and practical code examples 
                delivered to your inbox. Join thousands of ML practitioners leveling up their skills.
              </p>
            </div>

            <div className="space-y-4">
              <EmailSubscriptionForm />
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-1">
                <Users className="w-4 h-4" />
                <span data-testid="text-subscriber-count">Join 10,000+ ML practitioners</span>
              </div>
            </div>
          </div>

          <div className="relative" data-testid="img-hero">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={heroImage} 
                alt="Machine Learning Neural Network Visualization"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
