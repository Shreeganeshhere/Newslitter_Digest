import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteMenu from "@/components/InfiniteMenu";
import type { NewsItem } from "@shared/schema";

export default function Spaces() {
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="text-center space-y-4 max-w-md mx-auto px-4">
              <h2 className="text-2xl font-bold">No News Yet</h2>
              <p className="text-muted-foreground">
                Check back soon for the latest ML news and updates!
              </p>
            </div>
          </div>
        ) : (
          <InfiniteMenu items={newsItems} />
        )}
      </main>
    </div>
  );
}
