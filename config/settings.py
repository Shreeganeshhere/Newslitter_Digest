from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Gmail
    GMAIL_CREDENTIALS_FILE: str = "credentials.json"
    GMAIL_TOKEN_FILE: str = "token.json"
    GMAIL_SCOPES: List[str] = ['https://www.googleapis.com/auth/gmail.modify']
    
    # Database
    #DATABASE_URL: str
    
    # AI
    #GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Scheduler
    NEWSLETTER_TIME: str = "08:00"
    TIMEZONE: str = "UTC"
    
    # Newsletter
    ML_KEYWORDS: List[str] = ["machine learning", "AI", "deep learning", "neural network"]
    
    class Config:
        env_file = ".env"

settings = Settings()