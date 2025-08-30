from sqlalchemy import create_engine, Column, String, DateTime, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from databases import Database
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Get database URL from environment
DATABASE_URL = os.environ.get("DATABASE_URL")

# Use SQLite for local development if no DATABASE_URL is provided
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./siportapplication.db"
    logger.warning("No DATABASE_URL found, using SQLite for local development")

# Convert to async URL if needed
if DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
elif DATABASE_URL.startswith("sqlite:///"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
else:
    ASYNC_DATABASE_URL = DATABASE_URL

logger.info(f"Using database URL: {DATABASE_URL}")

# Create async engine with proper configuration
if "sqlite" in ASYNC_DATABASE_URL:
    engine = create_async_engine(ASYNC_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
    database = Database(ASYNC_DATABASE_URL)
else:
    engine = create_async_engine(ASYNC_DATABASE_URL, echo=True, pool_pre_ping=True)
    database = Database(ASYNC_DATABASE_URL)

# Create base class for models
Base = declarative_base()
metadata = MetaData()

# Create session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Database models
class StatusCheckModel(Base):
    __tablename__ = "status_checks"
    
    id = Column(String, primary_key=True)
    client_name = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

# Database connection functions
async def connect_db():
    """Connect to database"""
    try:
        await database.connect()
        logger.info("Database connected successfully")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

async def disconnect_db():
    """Disconnect from database"""
    try:
        await database.disconnect()
        logger.info("Database disconnected successfully")
    except Exception as e:
        logger.error(f"Database disconnection failed: {e}")
        raise

async def create_tables():
    """Create database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Table creation failed: {e}")
        raise