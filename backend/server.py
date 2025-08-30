from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
from database import database, connect_db, disconnect_db, create_tables, StatusCheckModel

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic models for API
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Database startup and shutdown events
@app.on_event("startup")
async def startup():
    await connect_db()
    await create_tables()
    logger.info("Database connected and tables created")

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
    logger.info("Database disconnected")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    # Create status check object
    status_obj = StatusCheck(client_name=input.client_name)
    
    # Insert into database
    query = """
        INSERT INTO status_checks (id, client_name, timestamp)
        VALUES (:id, :client_name, :timestamp)
    """
    values = {
        "id": status_obj.id,
        "client_name": status_obj.client_name,
        "timestamp": status_obj.timestamp
    }
    
    try:
        await database.execute(query=query, values=values)
        return status_obj
    except Exception as e:
        logger.error(f"Error creating status check: {e}")
        raise HTTPException(status_code=500, detail="Error creating status check")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    query = "SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC"
    
    try:
        results = await database.fetch_all(query=query)
        status_checks = []
        for row in results:
            status_checks.append(StatusCheck(
                id=row["id"],
                client_name=row["client_name"],
                timestamp=row["timestamp"]
            ))
        return status_checks
    except Exception as e:
        logger.error(f"Error fetching status checks: {e}")
        raise HTTPException(status_code=500, detail="Error fetching status checks")

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
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