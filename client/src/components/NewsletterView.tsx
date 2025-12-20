import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@shared/schema";

interface NewsletterViewProps {
  items: NewsItem[];
}

interface GroupedNews {
  [category: string]: NewsItem[];
}

export default function NewsletterView({ items }: NewsletterViewProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Group news items by category
  const groupedNews: GroupedNews = items.reduce((acc, item) => {
    const category = item.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as GroupedNews);

  const categories = Object.keys(groupedNews);
  
  // Ensure we have at least one category
  if (categories.length === 0) {
    groupedNews["General"] = items;
  }
  
  const validCategories = Object.keys(groupedNews);
  const safeCategoryIndex = Math.min(currentCategoryIndex, validCategories.length - 1);
  const currentCategory = validCategories[safeCategoryIndex] || "General";
  const currentCategoryItems = groupedNews[currentCategory] || [];

  // Reset item index when category changes
  useEffect(() => {
    setCurrentItemIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentCategoryIndex]);

  // Ensure category index is valid
  useEffect(() => {
    const validCategories = Object.keys(groupedNews);
    if (validCategories.length > 0) {
      if (currentCategoryIndex >= validCategories.length) {
        setCurrentCategoryIndex(validCategories.length - 1);
      } else if (currentCategoryIndex < 0) {
        setCurrentCategoryIndex(0);
      }
    }
  }, [items.length, currentCategoryIndex]);

  // Handle swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  // Handle mouse drag for swipe
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const distance = dragStart - e.clientX;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
        setIsDragging(false);
      } else if (distance < 0 && currentCategoryIndex > 0) {
        setCurrentCategoryIndex(prev => prev - 1);
        setIsDragging(false);
      }
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Handle scroll within category
  const handleScroll = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

    // Calculate which item should be visible based on scroll position
    const itemHeight = 400; // Approximate height of each news item
    const newIndex = Math.floor((scrollTop + clientHeight / 2) / itemHeight);
    const clampedIndex = Math.max(0, Math.min(newIndex, currentCategoryItems.length - 1));
    
    if (clampedIndex !== currentItemIndex) {
      setCurrentItemIndex(clampedIndex);
    }
  };

  const getTimeAgo = (date: string | Date | null) => {
    if (!date) return "Recently";
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

  const formatDate = (date: string | Date | null) => {
    if (!date) return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Header - Dark Theme */}
      <header className="bg-foreground text-background px-6 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">ML Newslitter Digest</h1>
          <nav className="flex gap-6 text-sm">
            <button className="hover:opacity-80 transition-opacity">Reply</button>
            <button className="hover:opacity-80 transition-opacity">Forward</button>
            <button className="hover:opacity-80 transition-opacity">Archive</button>
          </nav>
        </div>
      </header>

      {/* Main Content - Light Theme */}
      <main className="flex-1 bg-background overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">ML Newslitter Digest</h2>
            <p className="text-muted-foreground">
              {currentCategoryItems.length > 0 
                ? formatDate(currentCategoryItems[0]?.createdAt) 
                : formatDate(null)}
            </p>
          </div>

          {/* Category Navigation */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
            <button
              onClick={() => currentCategoryIndex > 0 && setCurrentCategoryIndex(prev => prev - 1)}
              disabled={currentCategoryIndex === 0}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 flex gap-2 overflow-x-auto">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setCurrentCategoryIndex(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    index === currentCategoryIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => currentCategoryIndex < categories.length - 1 && setCurrentCategoryIndex(prev => prev + 1)}
              disabled={currentCategoryIndex === categories.length - 1}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable News Items */}
          <div
            ref={scrollContainerRef}
            onWheel={handleScroll}
            className="h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="space-y-6 pr-4">
              {currentCategoryItems.map((item, index) => (
                <article
                  key={item.id}
                  className="bg-card border border-card-border rounded-2xl p-6 hover-elevate transition-all cursor-pointer"
                  onClick={() => item.url && window.open(item.url, '_blank', 'noopener,noreferrer')}
                >
                  <div className="space-y-4">
                    {/* Title and External Link */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold leading-tight flex-1">
                        {item.title || "Untitled Article"}
                      </h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 hover-elevate active-elevate-2 rounded-md p-2"
                        >
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        </a>
                      )}
                    </div>

                    {/* Image if available */}
                    {item.imageUrl && (
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.title || "News image"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Snippet/Summary */}
                    <p className="text-muted-foreground leading-relaxed">
                      {item.snippet || "No description available."}
                    </p>

                    {/* Source and Time */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                      <span className="font-medium">{item.source || "Unknown Source"}</span>
                      <span>{getTimeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {currentItemIndex + 1} of {currentCategoryItems.length} in {currentCategory}
          </div>
        </div>
      </main>

      {/* Footer - Dark Theme */}
      <footer className="bg-foreground text-background px-6 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-4">
            <button className="hover:opacity-80 transition-opacity">Facebook</button>
            <button className="hover:opacity-80 transition-opacity">Instagram</button>
            <button className="hover:opacity-80 transition-opacity">Twitter</button>
          </div>
          <div className="text-sm">
            <button className="hover:opacity-80 transition-opacity">Subscription Management</button>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2024 ML Newslitter Digest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

