from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv
import os
from pathlib import Path

# Load the environment variables from the secrets/.env file 
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR/ 'secrets' / '.env'
load_dotenv(ENV_FILE)

class Settings(BaseSettings):
    # Gmail
    GMAIL_CREDENTIALS_FILE: str = str(BASE_DIR / 'secrets' / 'credentials.json')
    GMAIL_TOKEN_FILE: str = str(BASE_DIR / 'secrets' / 'token.json')
    GMAIL_SCOPES: List[str] = ['https://www.googleapis.com/auth/gmail.modify']
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/Newslitter")
    
    # AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # Scheduler
    NEWSLETTER_TIME: str = "08:00"
    TIMEZONE: str = "UTC"
    
    # Newsletter
    
    class Config:
        env_file = ".env"

settings = Settings()