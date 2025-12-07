from gmail.fetcher import NewsletterFetcher
from gmail.sender import NewsletterSender
from processing.cleaner import HTMLCleaner
from processing.summarizer import NewsletterSummarizer
from processing.formatter import NewsletterFormatter
from database.connection import get_db_session
from database.repositories import SubscriberRepository, NewsletterRepository, NewsItemRepository
from datetime import datetime

class NewsletterPipeline:
    def __init__(self):
        self.fetcher = NewsletterFetcher()
        self.cleaner = HTMLCleaner()
        self.summarizer = NewsletterSummarizer()
        self.formatter = NewsletterFormatter()
        self.sender = NewsletterSender()
    
    def run(self):
        """Execute daily newsletter pipeline"""
        print(f"[{datetime.now()}] Starting pipeline...")
        
        # 1. Fetch emails
        emails = self.fetcher.fetch_yesterday_newsletters()
        if not emails:
            print("No newsletters found")
            return
        
        # 2. Clean content
        for email in emails:
            email['body'] = self.cleaner.clean(email['body'])
            email['body'] = self.cleaner.truncate(email['body'])
        
        # 3. Summarize
        summary = self.summarizer.summarize_batch(emails)
        
        # 4. Format HTML
        html = self.formatter.to_html(summary)
        
        # 5. Save to database
        with get_db_session() as session:
            newsletter_repo = NewsletterRepository(session)
            newsletter = newsletter_repo.save(
                date=datetime.now(),
                headline=summary['headline'],
                html=html,
                json_data=summary
            )
            
            # Save individual news items
            items_repo = NewsItemRepository(session)
            all_items = []
            for section in summary.get('sections', []):
                for item in section.get('items', []):
                    item['category'] = section['title']
                    all_items.append(item)
            items_repo.save_batch(newsletter.id, all_items)
            
            # 6. Send to subscribers
            subscriber_repo = SubscriberRepository(session)
            emails = subscriber_repo.get_active_emails()
        
        self.sender.send_newsletter(
            recipients=emails,
            subject=summary['headline'],
            html_content=html
        )
        
        # 7. Mark emails as read
        for email in emails:
            self.fetcher.mark_as_read(email['id'])
        
        print(f"✅ Sent to {len(emails)} subscribers")