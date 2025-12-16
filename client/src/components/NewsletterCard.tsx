import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Code, FileText, Clock } from "lucide-react";
import heroImage from "@assets/generated_images/ML_neural_network_visualization_bb1d41ce.png";

interface NewsletterCardProps {
  id: number;
  title: string;
  summary: string;
  source: string;
  url?: string | null;
  publishedAt: string;
  type?: "article" | "code";
}

export default function NewsletterCard({
  id,
  title,
  summary,
  source,
  url,
  publishedAt,
  type = "article",
}: NewsletterCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const isCodeType = type === "code" || id % 3 === 0;

  return (
    <Card
      className="overflow-hidden rounded-2xl hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => setExpanded((prev) => !prev)}
      data-testid={`newsletter-card-${id}`}
    >
      {!isCodeType && (
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <img
            src={heroImage}
            alt="Neural Network Visualization"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      {isCodeType && (
        <div className="relative h-40 overflow-hidden bg-[#1e1e1e] p-4 font-mono text-xs">
          <pre className="text-green-400 leading-relaxed">
            <code>{`import torch
from transformers import AutoModel

class NeuralNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = AutoModel
    
    def forward(self, x):
        return self.encoder(x)`}</code>
          </pre>
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            {isCodeType ? (
              <>
                <Code className="w-3 h-3" />
                Code Snippets
              </>
            ) : (
              <>
                <FileText className="w-3 h-3" />
                Latest Articles
              </>
            )}
          </Badge>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {title}
          </h3>
          <p
            className={`text-sm text-muted-foreground leading-relaxed transition-all ${
              expanded ? "line-clamp-none" : "line-clamp-2"
            }`}
          >
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="font-medium">{source}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
