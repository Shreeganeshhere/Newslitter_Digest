# src/retrieve_data.py
#!/usr/bin/env python3
"""
Script to retrieve stored newsletters and news items from PostgreSQL database.

Usage examples:
    python src/retrieve_data.py                    # List all newsletters
    python src/retrieve_data.py --latest 5         # Get latest 5 newsletters
    python src/retrieve_data.py --id 1             # Get newsletter by ID with items
    python src/retrieve_data.py --items 20         # Get latest 20 news items
    python src/retrieve_data.py --category "Research"  # Filter by category
    python src/retrieve_data.py --export json      # Export to JSON
"""
import json
import argparse
from datetime import datetime
import sys
import os
from pathlib import Path

# Add src directory to Python path so imports work
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from connection import SessionLocal
from repositories import NewsletterRepository, NewsItemRepository
from models import Newsletter, NewsItem


def format_newsletter(newsletter: Newsletter, include_items: bool = True) -> dict:
    """Format newsletter for display/export"""
    data = {
        "id": newsletter.id,
        "headline": newsletter.headline,
        "date": newsletter.date.strftime("%Y-%m-%d") if newsletter.date else None,
        "created_at": newsletter.created_at.strftime("%Y-%m-%d %H:%M:%S") if newsletter.created_at else None,
    }
    
    if include_items:
        items = [format_news_item(item) for item in newsletter.news_items]
        data["news_items"] = items
        data["item_count"] = len(items)
    
    return data


def format_news_item(item: NewsItem) -> dict:
    """Format news item for display/export"""
    return {
        "id": item.id,
        "title": item.title,
        "snippet": item.snippet,
        "category": item.category,
        "source": item.source,
        "url": item.url,
        "image_url": item.image_url,
        "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else None,
    }


def list_newsletters(limit=None, export_format="text"):
    """List all newsletters"""
    session = SessionLocal()
    try:
        repo = NewsletterRepository(session)
        if limit:
            newsletters = repo.get_latest(limit)
        else:
            newsletters = session.query(Newsletter).order_by(Newsletter.date.desc()).all()
        
        if export_format == "json":
            data = [format_newsletter(nl, include_items=False) for nl in newsletters]
            print(json.dumps(data, indent=2))
        else:
            print(f"\n{'='*80}")
            print(f"Found {len(newsletters)} newsletter(s)")
            print(f"{'='*80}\n")
            
            for nl in newsletters:
                item_count = len(nl.news_items)
                print(f"ID: {nl.id}")
                print(f"Headline: {nl.headline}")
                print(f"Date: {nl.date.strftime('%Y-%m-%d') if nl.date else 'N/A'}")
                print(f"Items: {item_count}")
                print(f"Created: {nl.created_at.strftime('%Y-%m-%d %H:%M:%S') if nl.created_at else 'N/A'}")
                print("-" * 80)
    finally:
        session.close()


def get_newsletter_by_id(newsletter_id: int, export_format="text"):
    """Get a specific newsletter with all its items"""
    session = SessionLocal()
    try:
        newsletter = session.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
        
        if not newsletter:
            print(f"Newsletter with ID {newsletter_id} not found.")
            return
        
        if export_format == "json":
            data = format_newsletter(newsletter, include_items=True)
            print(json.dumps(data, indent=2))
        else:
            print(f"\n{'='*80}")
            print(f"Newsletter ID: {newsletter.id}")
            print(f"{'='*80}")
            print(f"Headline: {newsletter.headline}")
            print(f"Date: {newsletter.date.strftime('%Y-%m-%d') if newsletter.date else 'N/A'}")
            print(f"Created: {newsletter.created_at.strftime('%Y-%m-%d %H:%M:%S') if newsletter.created_at else 'N/A'}")
            print(f"\nNews Items ({len(newsletter.news_items)}):")
            print("-" * 80)
            
            for i, item in enumerate(newsletter.news_items, 1):
                print(f"\n{i}. {item.title}")
                print(f"   Category: {item.category}")
                print(f"   Source: {item.source}")
                if item.snippet:
                    snippet = item.snippet[:100] + "..." if len(item.snippet) > 100 else item.snippet
                    print(f"   Snippet: {snippet}")
                print(f"   URL: {item.url}")
    finally:
        session.close()


def list_news_items(limit=50, category=None, export_format="text"):
    """List news items, optionally filtered by category"""
    session = SessionLocal()
    try:
        query = session.query(NewsItem).order_by(NewsItem.created_at.desc())
        
        if category:
            query = query.filter(NewsItem.category.ilike(f"%{category}%"))
        
        items = query.limit(limit).all()
        
        if export_format == "json":
            data = [format_news_item(item) for item in items]
            print(json.dumps(data, indent=2))
        else:
            print(f"\n{'='*80}")
            print(f"Found {len(items)} news item(s)" + (f" in category '{category}'" if category else ""))
            print(f"{'='*80}\n")
            
            for i, item in enumerate(items, 1):
                print(f"{i}. {item.title}")
                print(f"   Category: {item.category} | Source: {item.source}")
                print(f"   Newsletter ID: {item.newsletter_id}")
                if item.snippet:
                    snippet = item.snippet[:150] + "..." if len(item.snippet) > 150 else item.snippet
                    print(f"   {snippet}")
                print(f"   URL: {item.url}")
                print("-" * 80)
    finally:
        session.close()


def get_statistics():
    """Get database statistics"""
    session = SessionLocal()
    try:
        newsletter_count = session.query(Newsletter).count()
        newsitem_count = session.query(NewsItem).count()
        
        # Count by category
        categories = session.query(NewsItem.category).distinct().all()
        category_counts = {}
        for cat_tuple in categories:
            if cat_tuple[0]:
                count = session.query(NewsItem).filter(NewsItem.category == cat_tuple[0]).count()
                category_counts[cat_tuple[0]] = count
        
        print(f"\n{'='*80}")
        print("Database Statistics")
        print(f"{'='*80}")
        print(f"Total Newsletters: {newsletter_count}")
        print(f"Total News Items: {newsitem_count}")
        print(f"\nItems by Category:")
        for category, count in sorted(category_counts.items()):
            print(f"  {category}: {count}")
        print(f"{'='*80}\n")
    finally:
        session.close()


def main():
    parser = argparse.ArgumentParser(description="Retrieve stored newsletters and news items from database")
    parser.add_argument("--latest", type=int, help="Get latest N newsletters")
    parser.add_argument("--id", type=int, help="Get newsletter by ID with all items")
    parser.add_argument("--items", type=int, default=50, help="Get latest N news items (default: 50)")
    parser.add_argument("--category", type=str, help="Filter news items by category")
    parser.add_argument("--export", choices=["json", "text"], default="text", help="Export format")
    parser.add_argument("--stats", action="store_true", help="Show database statistics")
    
    args = parser.parse_args()
    
    try:
        if args.stats:
            get_statistics()
        elif args.id:
            get_newsletter_by_id(args.id, args.export)
        elif args.category:
            list_news_items(limit=args.items, category=args.category, export_format=args.export)
        elif args.latest:
            list_newsletters(limit=args.latest, export_format=args.export)
        elif args.items:
            list_news_items(limit=args.items, export_format=args.export)
        else:
            list_newsletters(export_format=args.export)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()