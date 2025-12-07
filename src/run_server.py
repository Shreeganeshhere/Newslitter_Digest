#!/usr/bin/env python3
"""
Combined server that runs both the scheduler and API
"""
import threading
import uvicorn
from scheduler.jobs import NewsletterPipeline
import schedule
import time
from config.settings import settings

def run_scheduler():
    """Run the daily newsletter scheduler"""
    pipeline = NewsletterPipeline()
    
    # Schedule daily job
    schedule.every().day.at(settings.NEWSLETTER_TIME).do(pipeline.run)
    
    print(f"Scheduler started. Will run daily at {settings.NEWSLETTER_TIME}")
    
    while True:
        schedule.run_pending()
        time.sleep(60)

def run_api():
    """Run the FastAPI server"""
    uvicorn.run(
        "api.app:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )

if __name__ == "__main__":
    # Run scheduler in background thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    # Run API in main thread
    print("Starting API server on http://0.0.0.0:8000")
    run_api()