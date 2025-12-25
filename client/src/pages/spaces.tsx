import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCard from "@/components/NewsletterCard";
import PillTabs from "@/components/PillTabs";
import { getDailyDigest } from "@/lib/dailyDigest";
import { NewsItem } from "@/lib/types";

export default function Spaces() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDigest = async () => {
      try {
        const data = await getDailyDigest();
        setNewsItems(data);
      } catch (error) {
        console.error("Failed to load daily digest:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDigest();
  }, []);

  // Create tabs for item1-item5
  const tabs = [
    {
      id: "item1",
      label: "Item 1",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Item 1 Content</h3>
          <p className="text-muted-foreground">
            This is the content for Item 1. You can put any content here including news cards, articles, or other components.
          </p>
          {newsItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsItems.slice(0, 3).map((news, index) => (
                <NewsletterCard
                  key={news.id}
                  id={news.id}
                  title={news.title ?? "Untitled Article"}
                  summary={news.snippet ?? "No description available."}
                  source={news.source ?? "Unknown Source"}
                  url={news.url ?? undefined}
                  publishedAt={news.createdAt}
                  type={index % 3 === 0 ? "code" : "article"}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "item2",
      label: "Item 2",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Item 2 Content</h3>
          <p className="text-muted-foreground">
            This is the content for Item 2. Different content can be displayed in each tab.
          </p>
          {newsItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsItems.slice(3, 6).map((news, index) => (
                <NewsletterCard
                  key={news.id}
                  id={news.id}
                  title={news.title ?? "Untitled Article"}
                  summary={news.snippet ?? "No description available."}
                  source={news.source ?? "Unknown Source"}
                  url={news.url ?? undefined}
                  publishedAt={news.createdAt}
                  type={index % 3 === 0 ? "code" : "article"}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "item3",
      label: "Item 3",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Item 3 Content</h3>
          <p className="text-muted-foreground">
            This is the content for Item 3. Each tab can have its own unique layout and components.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p>Some additional content for Item 3</p>
          </div>
        </div>
      ),
    },
    {
      id: "item4",
      label: "Item 4",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Item 4 Content</h3>
          <p className="text-muted-foreground">
            This is the content for Item 4. You can include images, links, or any React components.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-medium mb-2">Featured Content</h4>
              <p className="text-sm text-muted-foreground">Special content for Item 4</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "item5",
      label: "Item 5",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Item 5 Content</h3>
          <p className="text-muted-foreground">
            This is the content for Item 5. The final tab with its own unique content.
          </p>
          <div className="flex flex-col space-y-2">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm">Additional information for Item 5</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm">More content here</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">ML News Spaces</h1>
            <p className="text-lg text-muted-foreground">
              Curated machine learning news and research updates from around the web
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading news...</p>
              </div>
            </div>
          ) : (
            <PillTabs tabs={tabs} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
