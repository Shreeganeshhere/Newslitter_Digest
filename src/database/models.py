from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Subscriber(Base):
    __tablename__ = 'subscribers'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Newsletter(Base):
    __tablename__ = 'newsletters'
    
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, unique=True, nullable=False)
    headline = Column(String(500))
    content_html = Column(Text)
    content_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    news_items = relationship("NewsItem", back_populates="newsletter")

class NewsItem(Base):
    __tablename__ = 'news_items'
    
    id = Column(Integer, primary_key=True)
    newsletter_id = Column(Integer, ForeignKey('newsletters.id'))
    title = Column(String(500))
    snippet = Column(Text)
    category = Column(String(100))
    source = Column(String(200))
    url = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    newsletter = relationship("Newsletter", back_populates="news_items")