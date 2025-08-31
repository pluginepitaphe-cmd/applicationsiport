from fastapi import FastAPI, APIRouter, Depends
from sqlalchemy import select
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# PostgreSQL connection
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(Base):
    __tablename__ = "status_checks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_name = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate, db: AsyncSession = Depends(get_db)):
    new_status = StatusCheck(client_name=input.client_name)
    db.add(new_status)
    await db.commit()
    await db.refresh(new_status)
    return new_status

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StatusCheck))
    status_checks = result.scalars().all()
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)




@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


