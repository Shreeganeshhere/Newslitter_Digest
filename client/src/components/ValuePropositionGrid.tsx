import { Card } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Weekly ML Insights",
    description: "Curated deep-dives into the latest machine learning research, explained in practical terms you can apply immediately."
  },
  {
    icon: TrendingUp,
    title: "Industry Trends",
    description: "Stay informed about emerging patterns, breakthrough papers, and what top ML teams are building right now."
  },
  {
    icon: Zap,
    title: "Code Examples",
    description: "Production-ready code snippets and implementation guides to accelerate your ML projects and experiments."
  }
];

export default function ValuePropositionGrid() {
  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 rounded-2xl hover-elevate"
                data-testid={`card-feature-${index}`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
