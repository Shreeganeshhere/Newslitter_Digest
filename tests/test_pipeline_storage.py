"""
Simple integration-style test to confirm pipeline persistence works.
Uses an in-memory SQLite database so no secrets are required.
"""
import os

# Configure an in-memory SQLite database before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from database.connection import init_db, SessionLocal  # noqa: E402
from database.models import Newsletter, NewsItem  # noqa: E402
from run_pipeline import save_to_database  # noqa: E402


def test_save_to_database_persists_newsletter_and_items():
    """Ensure summary output is stored in the database."""
    init_db()

    summary_json = {
        "headline": "Daily ML Digest",
        "date": "2024-01-15",
        "summary": "A short roundup of ML news.",
        "sections": [
            {
                "title": "🔬 Research Highlights",
                "items": [
                    {
                        "title": "New Transformer Variant",
                        "snippet": "Improves long-context understanding.",
                        "source": "ArXiv",
                        "url": "https://arxiv.org/example1",
                    },
                    {
                        "title": "Diffusion Breakthrough",
                        "summary": "Faster sampling with fewer steps.",
                        "source": "ArXiv",
                        "url": "https://arxiv.org/example2",
                        "image_url": "https://images.example.com/paper.png",
                    },
                ],
            },
            {
                "title": "💼 Industry",
                "items": [
                    {
                        "title": "Startup Raises Series A",
                        "snippet": "AI infra company announces funding.",
                        "source": "TechCrunch",
                        "url": "https://techcrunch.com/example",
                    }
                ],
            },
        ],
    }

    save_to_database(summary_json)

    session = SessionLocal()
    try:
        newsletters = session.query(Newsletter).all()
        news_items = session.query(NewsItem).all()

        assert len(newsletters) == 1
        newsletter = newsletters[0]
        assert newsletter.headline == "Daily ML Digest"
        assert newsletter.content_json["headline"] == "Daily ML Digest"

        # Expect three items across two sections
        assert len(news_items) == 3
        categories = sorted({item.category for item in news_items})
        assert categories == ["Industry", "Research Highlights"]
    finally:
        session.close()
