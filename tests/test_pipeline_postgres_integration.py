"""
Integration test against a real PostgreSQL instance.
Requires:
- DATABASE_URL pointing to your Postgres (not SQLite)
- Optional: GEMINI_API_KEY, Gmail creds (we stub external calls to avoid them)

This test monkeypatches fetch/summarize so it won't hit Gmail or Gemini,
but still runs the real pipeline flow and writes to Postgres.

Run with: python tests/test_pipeline_postgres_integration.py
Or with pytest: pytest tests/test_pipeline_postgres_integration.py
"""
import os
import sys
from datetime import datetime
from pathlib import Path

# Add src directory to Python path so imports work
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

import pytest

from database.connection import init_db, SessionLocal
from database.models import Newsletter, NewsItem
from graph.pipeline import build_pipeline
from run_pipeline import save_to_database


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL") or "sqlite" in os.getenv("DATABASE_URL", "").lower(),
    reason="Set DATABASE_URL to a real Postgres instance to run this test.",
)
def test_pipeline_persists_to_postgres(monkeypatch):
    """
    Run the pipeline with stubbed external calls and verify persistence in Postgres.
    """
    init_db()

    # Stub fetcher to avoid Gmail dependency
    def _fake_fetch():
        return [
            {
                "from": "example@news.com",
                "subject": "Test Newsletter",
                "body": "Content about ML and AI.",
            }
        ]

    # Stub summarizer to avoid Gemini dependency and control output shape
    def _fake_summarize_batch(_emails):
        return {
            "headline": "Daily Digest Integration Test",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "summary": "Integration test summary.",
            "sections": [
                {
                    "title": "🔬 Research Highlights",
                    "items": [
                        {
                            "title": "Paper A",
                            "snippet": "Findings on model efficiency.",
                            "source": "ArXiv",
                            "url": "https://arxiv.org/paperA",
                        }
                    ],
                },
                {
                    "title": "💼 Industry",
                    "items": [
                        {
                            "title": "Company B Funding",
                            "summary": "Raised Series B for AI infra.",
                            "source": "TechCrunch",
                            "url": "https://techcrunch.com/companyB",
                        }
                    ],
                },
            ],
        }

    # Apply monkeypatches
    from graph.nodes import fetch as fetch_node
    from processing import summarizer as summarizer_mod

    monkeypatch.setattr(fetch_node.fetcher, "fetch_yesterday_newsletters", _fake_fetch)
    monkeypatch.setattr(summarizer_mod.NewsletterSummarizer, "summarize_batch", staticmethod(_fake_summarize_batch))

    # Run pipeline and persist
    app = build_pipeline()
    result_state = app.invoke({})
    summary = result_state.get("summary_json", {})
    save_to_database(summary)

    # Validate persistence
    session = SessionLocal()
    try:
        newsletters = (
            session.query(Newsletter)
            .filter(Newsletter.headline == "Daily Digest Integration Test")
            .all()
        )
        assert newsletters, "Newsletter not saved to Postgres"
        newsletter = newsletters[-1]

        items = (
            session.query(NewsItem)
            .filter(NewsItem.newsletter_id == newsletter.id)
            .all()
        )
        assert len(items) == 2, "Expected two news items saved"

        categories = sorted({item.category for item in items})
        assert categories == ["Industry", "Research Highlights"]
    finally:
        # Cleanup the records created by this test to keep DB tidy
        if 'newsletter' in locals():
            session.query(NewsItem).filter(NewsItem.newsletter_id == newsletter.id).delete()
            session.query(Newsletter).filter(Newsletter.id == newsletter.id).delete()
            session.commit()
        session.close()
