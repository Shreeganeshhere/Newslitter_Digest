import EmailSubscriptionForm from "./EmailSubscriptionForm";
import { Shield } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-24">
      <div className="container max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Level Up Your ML Skills?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community of passionate ML practitioners. Get started with 
              your free weekly newsletter today.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <EmailSubscriptionForm size="large" />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>No spam. Unsubscribe anytime. We respect your privacy.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
