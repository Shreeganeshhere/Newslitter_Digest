import schedule
import time
import './scheduler' as scheduler
from scheduler.jobs import NewsletterPipeline
from config.settings import settings

def main():
    pipeline = NewsletterPipeline()
    
    # Schedule daily job
    schedule.every().day.at(settings.NEWSLETTER_TIME).do(pipeline.run)
    
    print(f"Scheduler started. Will run daily at {settings.NEWSLETTER_TIME}")
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()