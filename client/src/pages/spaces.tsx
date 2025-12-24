import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCard from "@/components/NewsletterCard";
import PillTabs from "@/components/PillTabs";
import { getDailyDigest, NewsItem } from "@/lib/dailyDigest";

export default function Spaces() {
  // Use static JSON data instead of API call
  const newsItems = getDailyDigest();
  const isLoading = false;

  // Extract unique categories from news items
  const categories = Array.from(new Set(newsItems.map(item => item.category).filter(Boolean)));

  // Helper function to clean category names (remove emojis and special chars)
  const cleanCategoryName = (category: string) => {
    return category.replace(/^[^\w\s]+/, '').trim() || category;
  };

  // Create Spotlight tab (first tab)
  const spotlightTab = {
    id: "spotlight",
    label: "Spotlight",
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Spotlight</h3>
          <p className="text-muted-foreground">
            Featured and trending ML news from across all categories
          </p>
        </div>

        {/* Featured/highlighted news - show first few items */}
        {newsItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(0, 6).map((news, index) => (
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

        {/* Show category overview */}
        <div className="mt-8 space-y-4">
          <h4 className="text-lg font-medium">Explore by Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div key={category || 'unknown'} className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm font-medium">{cleanCategoryName(category || '')}</p>
                <p className="text-xs text-muted-foreground">
                  {newsItems.filter(item => item.category === category && item.category).length} articles
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  // Create category tabs
  const categoryTabs = categories.map((category) => {
    const categoryItems = newsItems.filter(item => item.category === category && item.category);
    const cleanName = cleanCategoryName(category || '');

    return {
      id: `category-${(category || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      label: cleanName,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">{cleanName}</h3>
            <p className="text-muted-foreground">
              Latest updates and news in {cleanName.toLowerCase()}
            </p>
          </div>

          {categoryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((news, index) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </div>
      ),
    };
  });

  // Combine spotlight tab with category tabs
  const tabs = [spotlightTab, ...categoryTabs];

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
