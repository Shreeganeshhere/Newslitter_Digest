# src/run_pipeline.py
import json
from datetime import datetime
from graph.pipeline import build_pipeline
from database.connection import init_db, get_db_session
from database.repositories import NewsletterRepository, NewsItemRepository
from processing.formatter import NewsletterFormatter


def save_to_database(summary_json: dict) -> None:
    """
    Save pipeline output to PostgreSQL database.
    Creates Newsletter record and associated NewsItem records.
    """
    if not summary_json:
        print("No summary data to save")
        return
    
    # Parse date from summary_json
    date_str = summary_json.get("date", datetime.now().strftime("%Y-%m-%d"))
    try:
        newsletter_date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        newsletter_date = datetime.now()
    
    # Generate HTML from JSON
    formatter = NewsletterFormatter()
    html_content = formatter.to_html(summary_json)
    
    # Extract headline
    headline = summary_json.get("headline", "Daily Newsletter")
    
    # Save newsletter and news items
    with get_db_session() as session:
        newsletter_repo = NewsletterRepository(session)
        newsitem_repo = NewsItemRepository(session)
        
        # Save newsletter
        newsletter = newsletter_repo.save(
            date=newsletter_date,
            headline=headline,
            html=html_content,
            json_data=summary_json
        )
        
        # Extract and save news items from sections
        news_items = []
        for section in summary_json.get("sections", []):
            section_title = section.get("title", "General")
            # Extract category from section title (remove emoji and clean)
            category = section_title.replace("🔬", "").replace("💼", "").replace("📚", "").replace("📅", "").replace("💻", "").strip()
            
            for item in section.get("items", []):
                news_items.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", "") or item.get("summary", ""),
                    "category": category,
                    "source": item.get("source", ""),
                    "url": item.get("url", ""),
                    "image_url": item.get("image_url")
                })
        
        # Save news items in batch
        if news_items:
            newsitem_repo.save_batch(newsletter.id, news_items)
            print(f"Saved {len(news_items)} news items to database")
        
        print(f"Newsletter saved to database with ID: {newsletter.id}")


def main() -> None:
    # Initialize database tables
    print("Initializing database...")
    init_db()
    
    # Run pipeline
    print("Running pipeline...")
    app = build_pipeline()

    # Start with empty state; LangGraph will pass this to the entry node
    result_state = app.invoke({})

    summary = result_state.get("summary_json", {})
    print(json.dumps(summary, indent=2, ensure_ascii=False))

    # Save to JSON file (for backup/debugging)
    with open('summary.json', 'w') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"Summary saved to summary.json")
    
    # Save to PostgreSQL database
    print("Saving to database...")
    save_to_database(summary)
    print("Pipeline completed successfully!")


if __name__ == "__main__":
    main()