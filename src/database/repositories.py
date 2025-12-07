from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database.models import Subscriber, Newsletter, NewsItem

class SubscriberRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def get_active_emails(self) -> List[str]:
        subscribers = self.session.query(Subscriber).filter_by(active=True).all()
        return [s.email for s in subscribers]
    
    def add_subscriber(self, email: str) -> Subscriber:
        subscriber = Subscriber(email=email)
        self.session.add(subscriber)
        self.session.flush()
        return subscriber

class NewsletterRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def save(self, date: datetime, headline: str, html: str, json_data: dict) -> Newsletter:
        newsletter = Newsletter(
            date=date,
            headline=headline,
            content_html=html,
            content_json=json_data
        )
        self.session.add(newsletter)
        self.session.flush()
        return newsletter
    
    def get_latest(self, limit: int = 10) -> List[Newsletter]:
        return self.session.query(Newsletter)\
            .order_by(Newsletter.date.desc())\
            .limit(limit)\
            .all()

class NewsItemRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def save_batch(self, newsletter_id: int, items: List[dict]):
        """Save news items extracted from newsletter"""
        news_items = [
            NewsItem(
                newsletter_id=newsletter_id,
                title=item['title'],
                snippet=item['snippet'],
                category=item.get('category'),
                source=item.get('source'),
                url=item.get('url'),
                image_url=item.get('image_url')
            )
            for item in items
        ]
        self.session.bulk_save_objects(news_items)
        self.session.flush()
    
    def get_latest(self, limit: int = 50) -> List[NewsItem]:
        """Get latest news for Spaces page"""
        return self.session.query(NewsItem)\
            .order_by(NewsItem.created_at.desc())\
            .limit(limit)\
            .all()