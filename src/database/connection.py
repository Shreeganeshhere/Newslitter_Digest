from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from contextlib import contextmanager
import sys
import os
from pathlib import Path

# Add src directory to Python path so imports work
project_root = Path(__file__).parent.parent.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from config.settings import settings
from database.models import Base

# Lazy engine creation
_engine = None

def get_engine():
    """Get or create the database engine lazily"""
    global _engine
    if _engine is None:
        database_url = settings.DATABASE_URL
        if not database_url:
            raise ValueError("DATABASE_URL environment variable is not set")

        if "sqlite" in database_url.lower():
            # SQLite for testing
            _engine = create_engine(
                database_url,
                connect_args={"check_same_thread": False},
                poolclass=StaticPool
            )
        else:
            # PostgreSQL for production
            _engine = create_engine(
                database_url,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True
            )
    return _engine

# Create sessionmaker lazily
def get_sessionmaker():
    """Get sessionmaker with current engine"""
    return sessionmaker(autocommit=False, autoflush=False, bind=get_engine())

def init_db():
    """Create all database tables"""
    Base.metadata.create_all(bind=get_engine())

@contextmanager
def get_db_session():
    """Dependency for FastAPI routes and context manager for direct use"""
    SessionLocal = get_sessionmaker()
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()