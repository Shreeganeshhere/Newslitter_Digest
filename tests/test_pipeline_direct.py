#!/usr/bin/env python3
"""
Direct test script to run the pipeline and verify results are stored in PostgreSQL.
This can be run directly without pytest.

Usage:
    python tests/test_pipeline_direct.py
"""
import os
import sys
from pathlib import Path

# Add src directory to Python path
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from database.connection import init_db, SessionLocal
from database.models import Newsletter, NewsItem
from run_pipeline import main

if __name__ == "__main__":
    # Check if DATABASE_URL is set
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL environment variable not set!")
        print("Please set it in src/secrets/.env or export it:")
        print('  export DATABASE_URL="postgresql://user:password@localhost:5432/Newslitter"')
        sys.exit(1)
    
    if "sqlite" in db_url.lower():
        print("WARNING: DATABASE_URL points to SQLite, not PostgreSQL!")
        print("This test is meant for PostgreSQL. Continuing anyway...")
    
    print("=" * 60)
    print("Testing Pipeline Database Storage")
    print("=" * 60)
    print(f"Database URL: {db_url.split('@')[-1] if '@' in db_url else db_url}")
    print()
    
    try:
        # Run the pipeline (this will save to database)
        print("Running pipeline...")
        main()
        
        # Verify results were saved
        print("\n" + "=" * 60)
        print("Verifying database storage...")
        print("=" * 60)
        
        session = SessionLocal()
        try:
            newsletters = session.query(Newsletter).order_by(Newsletter.created_at.desc()).limit(5).all()
            print(f"\nFound {len(newsletters)} newsletter(s) in database:")
            
            if newsletters:
                latest = newsletters[0]
                print(f"\nLatest Newsletter:")
                print(f"  ID: {latest.id}")
                print(f"  Headline: {latest.headline}")
                print(f"  Date: {latest.date}")
                print(f"  Created: {latest.created_at}")
                
                # Get associated news items
                items = session.query(NewsItem).filter(NewsItem.newsletter_id == latest.id).all()
                print(f"\n  News Items: {len(items)}")
                for i, item in enumerate(items[:5], 1):  # Show first 5
                    print(f"    {i}. {item.title[:60]}...")
                    print(f"       Category: {item.category}, Source: {item.source}")
                
                if len(items) > 5:
                    print(f"    ... and {len(items) - 5} more items")
                
                print("\n✅ SUCCESS: Pipeline results stored in database!")
            else:
                print("\n❌ WARNING: No newsletters found in database")
                print("   The pipeline may have run but didn't save data.")
                
        finally:
            session.close()
            
    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
