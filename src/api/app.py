from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uvicorn

from database.connection import get_db_session
from database.repositories import SubscriberRepository, NewsletterRepository, NewsItemRepository
from scheduler.jobs import NewsletterPipeline

app = FastAPI(title="ML Newsletter API")

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
from pydantic import BaseModel, EmailStr

class SubscriberCreate(BaseModel):
    email: EmailStr

class SubscriberResponse(BaseModel):
    id: int
    email: str
    subscribedAt: datetime
    
    class Config:
        from_attributes = True

class NewsItemResponse(BaseModel):
    id: int
    title: str
    summary: str
    source: str
    url: str | None
    publishedAt: datetime
    
    class Config:
        from_attributes = True

# Routes
@app.post("/api/subscribers", response_model=SubscriberResponse)
async def create_subscriber(
    subscriber_data: SubscriberCreate,
    session: Session = Depends(get_db_session)
):
    """Subscribe a new email to the newsletter"""
    repo = SubscriberRepository(session)
    
    # Check if already subscribed
    existing = session.query(Subscriber).filter_by(email=subscriber_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email is already subscribed")
    
    repo.add_subscriber(subscriber_data.email)
    subscriber = session.query(Subscriber).filter_by(email=subscriber_data.email).first()
    
    return SubscriberResponse(
        id=subscriber.id,
        email=subscriber.email,
        subscribedAt=subscriber.created_at
    )

@app.get("/api/news", response_model=List[NewsItemResponse])
async def get_news(session: Session = Depends(get_db_session)):
    """Get all news items for the Spaces page"""
    repo = NewsItemRepository(session)
    news_items = repo.get_latest(limit=50)
    
    return [
        NewsItemResponse(
            id=item.id,
            title=item.title,
            summary=item.snippet,
            source=item.source,
            url=item.url,
            publishedAt=item.created_at
        )
        for item in news_items
    ]

@app.post("/api/newsletter/trigger")
async def trigger_newsletter():
    """Manually trigger newsletter generation (admin endpoint)"""
    try:
        pipeline = NewsletterPipeline()
        pipeline.run()
        return {"status": "success", "message": "Newsletter generated and sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)