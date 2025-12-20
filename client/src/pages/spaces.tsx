import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCard from "@/components/NewsletterCard";
import { getDailyDigest, NewsItem } from "@/lib/dailyDigest";

export default function Spaces() {
  // Use static JSON data instead of API call
  const newsItems = getDailyDigest();
  const isLoading = false;

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
          ) : newsItems.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4 max-w-md mx-auto">
                <h2 className="text-2xl font-bold">No News Yet</h2>
                <p className="text-muted-foreground">
                  Check back soon for the latest ML news and updates!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((news, index) => (
                <div
                  key={news.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NewsletterCard
                    id={news.id}
                    title={news.title ?? "Untitled Article"}
                    summary={news.snippet ?? "No description available."}
                    source={news.source ?? "Unknown Source"}
                    url={news.url ?? undefined}
                    publishedAt={news.createdAt}
                    type={index % 3 === 0 ? "code" : "article"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
