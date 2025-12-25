# src/export_to_json.py
import json
from pathlib import Path
from datetime import datetime
from database.connection import get_db_session
from database.repositories import NewsItemRepository


def export_news_to_json():
    """Export latest news items from PostgreSQL to date-based JSON file"""
    # Get today's date in YYYY-MM-DD format
    today_date = datetime.now().strftime("%Y-%m-%d")

    # Get the project root (parent of src)
    project_root = Path(__file__).resolve().parent.parent
    digests_dir = project_root / "client" / "src" / "digests"
    json_filename = f"{today_date}.json"
    json_path = digests_dir / json_filename

    with get_db_session() as session:
        repo = NewsItemRepository(session)
        news_items = repo.get_latest(limit=100)

        # Convert to JSON-serializable format
        data = [
            {
                "id": item.id,
                "newsletterId": item.newsletter_id,
                "title": item.title,
                "snippet": item.snippet,
                "category": item.category,
                "source": item.source,
                "url": item.url,
                "imageUrl": item.image_url,
                "createdAt": item.created_at.isoformat() if item.created_at else None
            }
            for item in news_items
        ]

        # Ensure directory exists
        digests_dir.mkdir(parents=True, exist_ok=True)

        # Write to JSON file
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"✅ Exported {len(data)} news items to {json_path}")
        return json_path


if __name__ == "__main__":
    export_news_to_json()

