import { Card } from "@/components/ui/card";
import { Clock, ArrowUpRight } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  url?: string;
}

export default function NewsCard({ title, summary, source, timeAgo, url }: NewsCardProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
    console.log('News card clicked:', title);
  };

  return (
    <Card 
      className="p-6 rounded-2xl hover-elevate active-elevate-2 cursor-pointer transition-all hover:scale-[1.02]"
      onClick={handleClick}
      data-testid="card-news"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold leading-tight flex-1">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{source}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
