from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from databases import Database
import os
from datetime import datetime

# Get database URL from environment
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://localhost:5432/siportapplication")

# Convert to async URL if needed
if DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
else:
    ASYNC_DATABASE_URL = DATABASE_URL

# Create async engine
engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

# Create database instance for direct queries
database = Database(ASYNC_DATABASE_URL)

# Create base class for models
Base = declarative_base()

# Create session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Database models
class StatusCheckModel(Base):
    __tablename__ = "status_checks"
    
    id = Column(String, primary_key=True)
    client_name = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Database connection functions
async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)