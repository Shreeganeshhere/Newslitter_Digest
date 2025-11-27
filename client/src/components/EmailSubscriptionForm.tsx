import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailSubscriptionFormProps {
  size?: "default" | "large";
  onSubscribe?: (email: string) => void;
}

export default function EmailSubscriptionForm({ 
  size = "default",
  onSubscribe 
}: EmailSubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest("/api/subscribers", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Successfully subscribed!",
        description: "Check your inbox for confirmation.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to subscribe. Please try again.";
      setError(errorMessage);
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (onSubscribe) {
      onSubscribe(email);
    }
    
    subscribeMutation.mutate(email);
  };

  if (isSubmitted) {
    return (
      <div 
        className="flex items-center gap-3 text-primary" 
        data-testid="success-message"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">Successfully subscribed!</p>
          <p className="text-sm text-muted-foreground">Check your inbox for confirmation.</p>
        </div>
      </div>
    );
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col md:flex-row gap-3 ${isLarge ? 'md:gap-4' : ''}`}>
        <div className="flex-1">
          <div className="relative">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${isLarge ? 'h-14 pl-12 pr-6 text-lg rounded-full' : 'h-12 pl-11 pr-4 rounded-full'}`}
              data-testid="input-email"
              aria-label="Email address"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive mt-2 ml-4" data-testid="error-message">
              {error}
            </p>
          )}
        </div>
        <Button 
          type="submit" 
          size={isLarge ? "lg" : "default"}
          className={`${isLarge ? 'rounded-full px-10 h-14 text-lg' : 'rounded-full px-8'} font-semibold`}
          data-testid="button-subscribe"
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
