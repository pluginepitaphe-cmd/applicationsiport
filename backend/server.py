from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import database after logging is configured
from database import database, connect_db, disconnect_db, create_tables, StatusCheckModel

# Pydantic models for API
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class StatusCheckCreate(BaseModel):
    client_name: str

# Database lifespan context manager (replaces deprecated on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await connect_db()
        await create_tables()
        logger.info("Database connected and tables created")
        yield
    except Exception as e:
        logger.error(f"Database startup error: {e}")
        raise
    finally:
        # Shutdown
        try:
            await disconnect_db()
            logger.info("Database disconnected")
        except Exception as e:
            logger.error(f"Database shutdown error: {e}")

# Create the main app with lifespan
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ROOT ENDPOINT FOR RAILWAY SERVICE DETECTION
@app.get("/")
async def root_health():
    """Root endpoint for Railway service detection"""
    return {
        "message": "SiportApplication API", 
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "api_base": "/api"
    }

# HEALTH ENDPOINT AT ROOT LEVEL FOR RAILWAY
@app.get("/health")
async def root_health_check():
    """Health check at root level for Railway"""
    return {
        "status": "healthy", 
        "timestamp": datetime.utcnow(),
        "service": "SiportApplication"
    }

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World", "status": "online"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Create a new status check"""
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
        logger.info(f"Created status check: {status_obj.id}")
        return status_obj
    except Exception as e:
        logger.error(f"Error creating status check: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating status check: {str(e)}")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks"""
    query = "SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC LIMIT 100"
    
    try:
        results = await database.fetch_all(query=query)
        status_checks = []
        for row in results:
            status_checks.append(StatusCheck(
                id=row["id"],
                client_name=row["client_name"],
                timestamp=row["timestamp"]
            ))
        logger.info(f"Retrieved {len(status_checks)} status checks")
        return status_checks
    except Exception as e:
        logger.error(f"Error fetching status checks: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching status checks: {str(e)}")

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

# Railway requires this for port detection
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)