import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This newsletter has become my Monday morning ritual. The insights are always timely and the code examples save me hours of research.",
    name: "Sarah Chen",
    role: "ML Engineer at OpenAI",
    initials: "SC"
  },
  {
    quote: "Best ML newsletter out there. No fluff, just practical knowledge I can apply to my projects immediately.",
    name: "Marcus Rodriguez",
    role: "Data Scientist at Meta",
    initials: "MR"
  },
  {
    quote: "The perfect balance of theory and practice. I've learned more from this newsletter than most paid courses.",
    name: "Aisha Patel",
    role: "Research Scientist at DeepMind",
    initials: "AP"
  }
];

export default function SocialProof() {
  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by ML Practitioners
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of engineers and researchers who rely on our weekly insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-8 rounded-2xl hover-elevate"
              data-testid={`card-testimonial-${index}`}
            >
              <div className="space-y-6">
                <Quote className="w-8 h-8 text-primary/40" />
                <p className="text-base leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
