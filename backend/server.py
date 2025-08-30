#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SIPORTS v2.0 - Production Backend for Railway
FastAPI + SQLite + AI Chatbot
Optimisé pour Railway deployment avec corrections
"""

import os
import sys
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import jwt
import secrets
import json
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import logging

# Import chatbot service
from chatbot_service import siports_ai_service, ChatRequest, ChatResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'siports-jwt-secret-key-2024-production')
DATABASE_URL = os.environ.get('DATABASE_URL', 'siports_production.db')

# FastAPI app
app = FastAPI(
    title="SIPORTS v2.0 API",
    description="API pour événements maritimes avec chatbot IA",
    version="2.0.0"
)

# CORS configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure with your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Database initialization
def init_database():
    """Initialize production database"""
    conn = sqlite3.connect(DATABASE_URL)
    
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            user_type TEXT DEFAULT 'visitor',
            first_name TEXT,
            last_name TEXT,
            company TEXT,
            phone TEXT,
            visitor_package TEXT DEFAULT 'Free',
            partnership_package TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert admin user if not exists
    admin_password = generate_password_hash('admin123')
    conn.execute('''
        INSERT OR IGNORE INTO users (email, password_hash, user_type, status, first_name, last_name)
        VALUES (?, ?, 'admin', 'validated', 'Admin', 'SIPORTS')
    ''', ('admin@siportevent.com', admin_password))
    
    # Sample data with correct passwords
    visitor_password = generate_password_hash('visit123')
    exhibitor_password = generate_password_hash('exhibitor123')
    
    conn.execute('''
        INSERT OR IGNORE INTO users (email, password_hash, user_type, visitor_package, status, first_name, last_name, company)
        VALUES (?, ?, 'visitor', 'Premium', 'validated', 'Marie', 'Dupont', 'Port Autonome Marseille')
    ''', ('visiteur@example.com', visitor_password))
    
    conn.execute('''
        INSERT OR IGNORE INTO users (email, password_hash, user_type, partnership_package, status, first_name, last_name, company)
        VALUES (?, ?, 'exhibitor', 'Gold', 'validated', 'Jean', 'Martin', 'Maritime Solutions Ltd')
    ''', ('exposant@example.com', exhibitor_password))
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

# Models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    user_type: str = 'visitor'

class PackageUpdate(BaseModel):
    package_type: str
    user_id: int

# Helper functions
def create_jwt_token(user_data: dict) -> str:
    """Create JWT token"""
    payload = {
        'user_id': user_data['id'],
        'email': user_data['email'],
        'user_type': user_data['user_type'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

def verify_jwt_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    user = conn.execute(
        'SELECT * FROM users WHERE id = ?',
        (payload['user_id'],)
    ).fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    
    return dict(user)

def admin_required(user: dict = Depends(get_current_user)):
    """Admin authorization required"""
    if user['user_type'] != 'admin':
        raise HTTPException(status_code=403, detail="Accès admin requis")
    return user

# =============================================================================
# AUTHENTICATION ENDPOINTS
# =============================================================================

@app.post("/api/auth/register")
async def register(user: UserRegister):
    """User registration"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        
        # Check if user exists
        existing = conn.execute(
            'SELECT id FROM users WHERE email = ?',
            (user.email,)
        ).fetchone()
        
        if existing:
            raise HTTPException(status_code=400, detail="Utilisateur existant")
        
        # Create user
        password_hash = generate_password_hash(user.password)
        cursor = conn.execute('''
            INSERT INTO users (email, password_hash, user_type, first_name, last_name, company, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user.email, password_hash, user.user_type, user.first_name, user.last_name, user.company, user.phone))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {"message": "Inscription réussie", "user_id": user_id}
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur inscription")

@app.post("/api/auth/login")
async def login(user: UserLogin):
    """User login"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        db_user = conn.execute(
            'SELECT * FROM users WHERE email = ?',
            (user.email,)
        ).fetchone()
        conn.close()
        
        if not db_user or not check_password_hash(db_user['password_hash'], user.password):
            raise HTTPException(status_code=401, detail="Identifiants invalides")
        
        # Allow admin login regardless of status, others must be validated
        if db_user['user_type'] != 'admin' and db_user['status'] != 'validated':
            raise HTTPException(status_code=403, detail="Compte en attente de validation")
        
        # Create JWT token
        user_data = dict(db_user)
        token = create_jwt_token(user_data)
        
        # Return user data with token
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_data['id'],
                "email": user_data['email'],
                "first_name": user_data['first_name'],
                "last_name": user_data['last_name'],
                "company": user_data['company'],
                "user_type": user_data['user_type'],
                "visitor_package": user_data['visitor_package'],
                "partnership_package": user_data['partnership_package']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur connexion")

# =============================================================================
# VISITOR PACKAGES ENDPOINTS
# =============================================================================

@app.get("/api/visitor-packages")
async def get_visitor_packages():
    """Get visitor packages"""
    packages = [
        {
            "id": 1,
            "name": "Free Pass",
            "price": 0,
            "currency": "€",
            "description": "Accès gratuit aux espaces d'exposition",
            "features": [
                "Accès aux espaces d'exposition",
                "Conférences publiques",
                "Application mobile",
                "Plan du salon"
            ],
            "limitations": {
                "b2b_meetings": 0,
                "networking": "Limité"
            }
        },
        {
            "id": 2,
            "name": "Basic Pass",
            "price": 150,
            "currency": "€",
            "description": "Pass essentiel pour 1 journée",
            "features": [
                "Tout du Free Pass",
                "2 rendez-vous B2B garantis",
                "Accès aux pauses café",
                "Badge visiteur personnalisé"
            ],
            "limitations": {
                "b2b_meetings": 2,
                "networking": "Standard"
            }
        },
        {
            "id": 3,
            "name": "Premium Pass",
            "price": 350,
            "currency": "€",
            "description": "Pass complet pour 2 journées",
            "features": [
                "Tout du Basic Pass",
                "5 rendez-vous B2B garantis",
                "Ateliers techniques spécialisés",
                "Déjeuners networking",
                "Accès zone VIP"
            ],
            "popular": True,
            "limitations": {
                "b2b_meetings": 5,
                "networking": "Avancé"
            }
        },
        {
            "id": 4,
            "name": "VIP Pass",
            "price": 750,
            "currency": "€",
            "description": "Accès privilégié 3 journées complètes",
            "features": [
                "Tout du Premium Pass",
                "Rendez-vous B2B illimités",
                "Soirée de gala exclusive",
                "Conférences privées C-Level",
                "Service de conciergerie",
                "Transferts inclus"
            ],
            "limitations": {
                "b2b_meetings": "unlimited",
                "networking": "Premium"
            }
        }
    ]
    return {"packages": packages}

@app.post("/api/visitor-packages/update")
async def update_visitor_package(data: PackageUpdate, user: dict = Depends(get_current_user)):
    """Update user's visitor package"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.execute(
            'UPDATE users SET visitor_package = ? WHERE id = ?',
            (data.package_type, user['id'])
        )
        conn.commit()
        conn.close()
        
        return {"message": "Forfait mis à jour avec succès"}
        
    except Exception as e:
        logger.error(f"Package update error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur mise à jour forfait")

# =============================================================================
# PARTNERSHIP PACKAGES ENDPOINTS
# =============================================================================

@app.get("/api/partnership-packages")
async def get_partnership_packages():
    """Get partnership packages"""
    packages = [
        {
            "id": 1,
            "name": "Startup Package",
            "price": 2500,
            "currency": "$",
            "description": "Idéal pour les jeunes entreprises maritimes",
            "features": [
                "Stand 6m² (2x3m)",
                "2 badges exposant",
                "Listing annuaire digital",
                "Support technique de base"
            ],
            "category": "startup"
        },
        {
            "id": 2,
            "name": "Silver Package", 
            "price": 8000,
            "currency": "$",
            "description": "Package standard pour exposants confirmés",
            "features": [
                "Stand 12m² (3x4m)",
                "4 badges exposant",
                "Mobilier standard inclus",
                "1 session de networking sponsorisée",
                "Présence catalogue premium"
            ],
            "category": "standard"
        },
        {
            "id": 3,
            "name": "Gold Package",
            "price": 15000,
            "currency": "$", 
            "description": "Package avancé avec visibilité renforcée",
            "features": [
                "Stand 20m² (4x5m) - Emplacement premium",
                "6 badges exposant",
                "Mobilier sur-mesure",
                "2 conférences sponsorisées (30min)",
                "Logo sur supports officiels",
                "1 cocktail networking privé"
            ],
            "popular": True,
            "category": "premium"
        },
        {
            "id": 4,
            "name": "Platinum Package",
            "price": 25000,
            "currency": "$",
            "description": "Package prestige - Partenaire officiel",
            "features": [
                "Stand 40m² (5x8m) - Hall d'entrée",
                "10 badges exposant",
                "Design stand personnalisé",
                "Keynote session dédiée (45min)",
                "Mini-site SIPORTS Premium dédié",
                "Branding événement (logos, panneaux)",
                "Dîner VIP avec comité d'organisation",
                "Communiqué de presse co-signé"
            ],
            "category": "prestige"
        }
    ]
    return {"packages": packages}

# =============================================================================
# EXPOSANTS/EXHIBITORS ENDPOINTS
# =============================================================================

@app.get("/api/exposants")
async def get_exposants():
    """Get all exhibitors/exposants for the directory"""
    # Mock data for exhibitors - same as frontend
    exposants = [
        {
            "id": 1,
            "name": "TechMarine Solutions",
            "category": "Technologies Maritimes",
            "logo": "/images/logo1.png",
            "description": "Solutions technologiques pour l'industrie maritime",
            "stand": "A12",
            "hall": "Hall Innovation",
            "website": "https://techmarinesolutions.com",
            "email": "contact@techmarinesolutions.com",
            "phone": "+33 1 23 45 67 89",
            "specialties": ["IoT Maritime", "Navigation Intelligente", "Maintenance Prédictive"],
            "products": [
                "SmartShip Navigator - Système de navigation IA",
                "MarineIoT Hub - Plateforme IoT embarquée",
                "PredictMaintain - Solution maintenance prédictive"
            ],
            "certifications": ["ISO 9001", "ISO 14001", "Maritime MED"],
            "founded": 2015,
            "employees": "50-100",
            "countries": ["France", "Allemagne", "Norvège"]
        },
        {
            "id": 2,
            "name": "Green Port Energy",
            "category": "Énergies Renouvelables",
            "logo": "/images/logo2.png",
            "description": "Transition énergétique des ports et terminaux",
            "stand": "B08",
            "hall": "Hall Environnement",
            "website": "https://greenportenergy.com",
            "email": "info@greenportenergy.com", 
            "phone": "+33 2 34 56 78 90",
            "specialties": ["Énergie Solaire", "Éolien Offshore", "Stockage Batterie"],
            "products": [
                "SolarPort - Ombrières solaires pour ports",
                "WindTerminal - Éoliennes portuaires",
                "BatteryHub - Stockage énergétique intelligent"
            ],
            "certifications": ["ISO 50001", "REC Certified", "Wind Power"],
            "founded": 2018,
            "employees": "20-50", 
            "countries": ["France", "Espagne", "Portugal"]
        },
        {
            "id": 3,
            "name": "Smart Container Corp",
            "category": "Logistique Intelligente", 
            "logo": "/images/logo3.png",
            "description": "Conteneurs connectés et logistique 4.0",
            "stand": "C15",
            "hall": "Hall Logistique",
            "website": "https://smartcontainer.com",
            "email": "hello@smartcontainer.com",
            "phone": "+33 3 45 67 89 01",
            "specialties": ["Conteneurs Connectés", "Tracking IoT", "Blockchain Logistique"],
            "products": [
                "ConnectBox - Conteneurs intelligents",
                "TrackChain - Traçabilité blockchain", 
                "LogiAI - Intelligence artificielle logistique"
            ],
            "certifications": ["ISO 28000", "CTPAT", "AEO"],
            "founded": 2020,
            "employees": "10-20",
            "countries": ["France", "Pays-Bas", "Belgique"]
        },
        {
            "id": 4,
            "name": "Ocean Data Analytics",
            "category": "Big Data Maritime",
            "logo": "/images/logo4.png", 
            "description": "Analyse de données pour l'industrie maritime",
            "stand": "D22",
            "hall": "Hall Innovation",
            "website": "https://oceandataanalytics.com",
            "email": "data@oceandataanalytics.com",
            "phone": "+33 4 56 78 90 12",
            "specialties": ["Machine Learning", "Prédiction Météo", "Optimisation Routes"],
            "products": [
                "WeatherPredict - Prédiction météorologique avancée",
                "RouteOptim - Optimisation de routes maritimes",
                "FleetAnalytics - Analyse performance flotte"
            ],
            "certifications": ["ISO 27001", "GDPR Certified", "Cloud Security"],
            "founded": 2017,
            "employees": "30-50",
            "countries": ["France", "UK", "Canada"]
        },
        {
            "id": 5,
            "name": "AquaTech Innovations",
            "category": "Technologies Marines",
            "logo": "/images/logo5.png",
            "description": "Innovations pour l'aquaculture et l'environnement marin", 
            "stand": "E05",
            "hall": "Hall Environnement",
            "website": "https://aquatechinnovations.com",
            "email": "contact@aquatechinnovations.com",
            "phone": "+33 5 67 89 01 23",
            "specialties": ["Aquaculture Durable", "Surveillance Marine", "Biotechnologies"],
            "products": [
                "AquaFarm Pro - Systèmes aquaculture intelligente",
                "MarineWatch - Surveillance écosystèmes marins",
                "BioClean - Solutions bioremédiation"
            ],
            "certifications": ["ASC Aquaculture", "Marine Stewardship", "Bio Certified"],
            "founded": 2016,
            "employees": "25-50",
            "countries": ["France", "Norvège", "Chili"]
        },
        {
            "id": 6,
            "name": "Port Security Systems",
            "category": "Sécurité Portuaire",
            "logo": "/images/logo6.png",
            "description": "Solutions de sécurité et surveillance pour ports",
            "stand": "F18", 
            "hall": "Hall Sécurité",
            "website": "https://portsecuritysystems.com",
            "email": "security@portsecuritysystems.com",
            "phone": "+33 6 78 90 12 34",
            "specialties": ["Vidéosurveillance IA", "Contrôle Accès", "Détection Intrusion"],
            "products": [
                "SecurePort AI - Surveillance intelligente par IA",
                "AccessGuard - Contrôle d'accès biométrique",
                "ThreatDetect - Détection de menaces en temps réel"
            ],
            "certifications": ["ISO 27001", "ANSSI Qualified", "Security Certified"],
            "founded": 2014,
            "employees": "40-80",
            "countries": ["France", "Italie", "Grèce"]
        }
    ]
    
    return {"exposants": exposants, "total": len(exposants)}

@app.get("/api/exposants/{exposant_id}")
async def get_exposant_detail(exposant_id: int):
    """Get detailed information for a specific exposant"""
    # This would normally fetch from database
    # For now, return mock data for the specific exposant
    
    exposants_data = {
        1: {
            "id": 1,
            "name": "TechMarine Solutions",
            "category": "Technologies Maritimes",
            "description": "Leader européen des solutions technologiques pour l'industrie maritime depuis 2015. Spécialisé dans l'IoT maritime, la navigation intelligente et la maintenance prédictive.",
            "stand": "A12",
            "hall": "Hall Innovation",
            "website": "https://techmarinesolutions.com",
            "email": "contact@techmarinesolutions.com",
            "phone": "+33 1 23 45 67 89",
            "logo": "/images/logo1.png",
            "images": ["/images/tech1.jpg", "/images/tech2.jpg", "/images/tech3.jpg"],
            "specialties": ["IoT Maritime", "Navigation Intelligente", "Maintenance Prédictive"],
            "products": [
                {
                    "name": "SmartShip Navigator",
                    "description": "Système de navigation assistée par intelligence artificielle",
                    "features": ["Navigation autonome", "Évitement obstacles", "Optimisation carburant"]
                },
                {
                    "name": "MarineIoT Hub", 
                    "description": "Plateforme IoT embarquée pour navires connectés",
                    "features": ["Capteurs temps réel", "Maintenance prédictive", "Télémétrie avancée"]
                }
            ],
            "team": [
                {"name": "Pierre Durand", "role": "CEO & Fondateur", "email": "p.durand@techmarinesolutions.com"},
                {"name": "Marie Lambert", "role": "CTO", "email": "m.lambert@techmarinesolutions.com"}
            ],
            "presentations": [
                {
                    "title": "L'avenir de la navigation autonome",
                    "date": "2026-03-15T14:30:00",
                    "duration": "45 minutes",
                    "location": "Salle Innovation A"
                }
            ],
            "special_offers": [
                "Démonstration gratuite sur stand",
                "20% de réduction pour commandes salon",
                "Formation gratuite avec installation"
            ],
            "founded": 2015,
            "employees": "50-100",
            "turnover": "12M€ (2024)",
            "countries": ["France", "Allemagne", "Norvège"],
            "certifications": ["ISO 9001", "ISO 14001", "Maritime MED"]
        }
        # Add other exposants as needed...
    }
    
    if exposant_id not in exposants_data:
        raise HTTPException(status_code=404, detail="Exposant non trouvé")
    
    return exposants_data[exposant_id]

# =============================================================================
# ADMIN ENDPOINTS
# =============================================================================

@app.get("/api/admin/dashboard/stats")
async def get_admin_stats(admin: dict = Depends(admin_required)):
    """Get admin dashboard statistics"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        
        # Count users by type
        total_users = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
        visitors = conn.execute('SELECT COUNT(*) FROM users WHERE user_type = "visitor"').fetchone()[0]
        exhibitors = conn.execute('SELECT COUNT(*) FROM users WHERE user_type = "exhibitor"').fetchone()[0]
        partners = conn.execute('SELECT COUNT(*) FROM users WHERE user_type = "partner"').fetchone()[0]
        
        # Count by status
        pending = conn.execute('SELECT COUNT(*) FROM users WHERE status = "pending"').fetchone()[0]
        validated = conn.execute('SELECT COUNT(*) FROM users WHERE status = "validated"').fetchone()[0]
        rejected = conn.execute('SELECT COUNT(*) FROM users WHERE status = "rejected"').fetchone()[0]
        
        conn.close()
        
        return {
            "total_users": total_users,
            "visitors": visitors,
            "exhibitors": exhibitors,
            "partners": partners,
            "pending": pending,
            "validated": validated,
            "rejected": rejected
        }
        
    except Exception as e:
        logger.error(f"Admin stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur statistiques")

@app.get("/api/admin/users/pending")
async def get_pending_users(admin: dict = Depends(admin_required)):
    """Get users pending validation"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        users = conn.execute('''
            SELECT id, email, first_name, last_name, company, user_type, created_at
            FROM users WHERE status = 'pending'
            ORDER BY created_at DESC
        ''').fetchall()
        conn.close()
        
        return {"users": [dict(user) for user in users]}
        
    except Exception as e:
        logger.error(f"Pending users error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur récupération utilisateurs")

@app.post("/api/admin/users/{user_id}/validate")
async def validate_user(user_id: int, admin: dict = Depends(admin_required)):
    """Validate a user"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.execute(
            'UPDATE users SET status = "validated" WHERE id = ?',
            (user_id,)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Utilisateur validé avec succès"}
        
    except Exception as e:
        logger.error(f"User validation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur validation utilisateur")

@app.post("/api/admin/users/{user_id}/reject") 
async def reject_user(user_id: int, admin: dict = Depends(admin_required)):
    """Reject a user"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.execute(
            'UPDATE users SET status = "rejected" WHERE id = ?',
            (user_id,)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Utilisateur rejeté"}
        
    except Exception as e:
        logger.error(f"User rejection error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur rejet utilisateur")

# =============================================================================
# AI MATCHING & NETWORKING ENDPOINTS
# =============================================================================

class NetworkingProfile(BaseModel):
    """Model for networking profile data"""
    objectives: List[str] = []
    interests: List[str] = []
    expertise: List[str] = []
    availability: dict = {}
    budget_range: Optional[str] = None
    language_preferences: List[str] = []

class MatchingFilters(BaseModel):
    """Model for AI matching filters"""
    match_type: str = 'all'
    sector: str = 'all' 
    compatibility_min: int = 70
    location: str = 'all'
    budget: str = 'all'
    language: str = 'all'
    semantic_search: bool = False
    search_query: Optional[str] = None

@app.post("/api/networking/profiles")
async def get_networking_profiles(filters: MatchingFilters, user: dict = Depends(get_current_user)):
    """Get networking profiles with AI matching"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        # Base query for all users except current user
        query = '''
            SELECT id, email, first_name, last_name, company, user_type, 
                   visitor_package, partnership_package, status, created_at
            FROM users 
            WHERE id != ? AND status = 'validated'
        '''
        params = [user['id']]
        
        # Apply filters
        if filters.match_type != 'all':
            if filters.match_type == 'partner':
                query += ' AND user_type IN ("exhibitor", "partner")'
            else:
                query += ' AND user_type = ?'
                params.append(filters.match_type)
        
        profiles = conn.execute(query, params).fetchall()
        conn.close()
        
        # Convert to enhanced profile format
        enhanced_profiles = []
        for profile in profiles:
            profile_dict = dict(profile)
            
            # Add mock data for demonstration (in production, this would come from extended profile tables)
            enhanced_profile = {
                **profile_dict,
                'name': f"{profile_dict['first_name']} {profile_dict['last_name']}",
                'title': get_mock_title(profile_dict['user_type']),
                'sector': get_mock_sector(profile_dict['user_type']),
                'location': get_mock_location(),
                'description': get_mock_description(profile_dict['user_type']),
                'interests': get_mock_interests(profile_dict['user_type']),
                'languages': ['Français', 'Anglais'],
                'availability': {
                    'status': 'Disponible',
                    'preferred_slots': ['09:00-12:00', '14:00-17:00']
                },
                'compatibility': calculate_mock_compatibility(user, profile_dict),
                'business_potential': get_business_potential(profile_dict['user_type']),
                'connection_status': 'not_connected'
            }
            
            enhanced_profiles.append(enhanced_profile)
        
        # Apply AI filtering and sorting
        if filters.semantic_search and filters.search_query:
            enhanced_profiles = apply_semantic_search(enhanced_profiles, filters.search_query)
        
        # Filter by compatibility
        enhanced_profiles = [p for p in enhanced_profiles if p['compatibility'] >= filters.compatibility_min]
        
        # Sort by compatibility
        enhanced_profiles.sort(key=lambda x: x['compatibility'], reverse=True)
        
        return {"profiles": enhanced_profiles[:20]}  # Limit to 20 results
        
    except Exception as e:
        logger.error(f"Networking profiles error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur récupération profils")

@app.post("/api/networking/ai-suggestions")
async def get_ai_suggestions(user: dict = Depends(get_current_user)):
    """Get AI-powered networking suggestions"""
    try:
        suggestions = [
            {
                'type': 'connection',
                'title': 'Nouvelle connexion suggérée',
                'description': 'Expert en IA maritime avec 4 intérêts communs détectés',
                'priority': 'high',
                'action': 'Se connecter'
            },
            {
                'type': 'meeting',
                'title': 'Créneau optimal détecté', 
                'description': 'Partenaire disponible dans 2h - compatibilité 94%',
                'priority': 'medium',
                'action': 'Planifier RDV'
            },
            {
                'type': 'content',
                'title': 'Contenu pertinent',
                'description': 'Nouveau whitepaper publié par votre réseau',
                'priority': 'low',
                'action': 'Consulter'
            }
        ]
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        logger.error(f"AI suggestions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur suggestions IA")

@app.post("/api/networking/conversation-starters/{profile_id}")
async def get_conversation_starters(profile_id: int, user: dict = Depends(get_current_user)):
    """Get AI-generated conversation starters for a profile"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        profile = conn.execute(
            'SELECT * FROM users WHERE id = ?', (profile_id,)
        ).fetchone()
        conn.close()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profil non trouvé")
        
        # Generate conversation starters based on profile
        starters = [
            {
                'category': 'Professionnel',
                'message': f'Bonjour {profile["first_name"]}, j\'ai vu votre expertise en {get_mock_sector(profile["user_type"])}. Quelles sont vos approches innovantes dans ce domaine ?',
                'context': 'Basé sur le secteur d\'expertise'
            },
            {
                'category': 'Business',
                'message': f'Nous partageons des objectifs similaires. Seriez-vous intéressé pour explorer des synergies entre nos organisations ?',
                'context': 'Objectifs business alignés'
            },
            {
                'category': 'Technique', 
                'message': f'J\'aimerais échanger sur les dernières innovations dans votre secteur. Avez-vous du temps pour une discussion ?',
                'context': 'Échange technique et innovation'
            }
        ]
        
        return {"conversation_starters": starters}
        
    except Exception as e:
        logger.error(f"Conversation starters error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur suggestions conversation")

@app.post("/api/networking/connect/{profile_id}")
async def send_connection_request(profile_id: int, user: dict = Depends(get_current_user)):
    """Send a connection request"""
    try:
        # In a real implementation, this would create a connection request record
        return {"message": "Demande de connexion envoyée avec succès"}
        
    except Exception as e:
        logger.error(f"Connection request error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur demande de connexion")

@app.post("/api/matching/calculate-compatibility") 
async def calculate_compatibility(profile_data: dict, user: dict = Depends(get_current_user)):
    """Calculate AI compatibility score between users"""
    try:
        # Simplified compatibility calculation
        base_score = 70
        
        # Sector compatibility
        if profile_data.get('sector') and user.get('sector'):
            if profile_data['sector'] == user['sector']:
                base_score += 20
            elif are_compatible_sectors(profile_data['sector'], user['sector']):
                base_score += 10
        
        # User type synergy
        user_type_bonus = {
            ('visitor', 'exhibitor'): 15,
            ('visitor', 'partner'): 12,
            ('exhibitor', 'partner'): 18
        }
        
        user_types = tuple(sorted([user.get('user_type', ''), profile_data.get('user_type', '')]))
        base_score += user_type_bonus.get(user_types, 0)
        
        # Cap at 100%
        compatibility = min(100, base_score)
        
        return {
            "compatibility_score": compatibility,
            "breakdown": {
                "sectorial": min(100, base_score - 70 + 70),
                "user_type": user_type_bonus.get(user_types, 0),
                "overall": compatibility
            }
        }
        
    except Exception as e:
        logger.error(f"Compatibility calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur calcul compatibilité")

# Helper functions for mock data generation
def get_mock_title(user_type):
    titles = {
        'visitor': ['Directeur Général', 'Directeur Innovation', 'Chef de Projet'],
        'exhibitor': ['CTO', 'VP Sales', 'Business Development Manager'],
        'partner': ['CEO', 'VP Partnerships', 'Chief Innovation Officer']
    }
    import random
    return random.choice(titles.get(user_type, ['Manager']))

def get_mock_sector(user_type):
    sectors = {
        'visitor': ['Gestion Portuaire', 'Logistique Maritime', 'Transport Maritime'],
        'exhibitor': ['Technologies Marines', 'Equipment Portuaire', 'Solutions IoT'],
        'partner': ['Innovation Maritime', 'Investissement Tech', 'Consulting Maritime']
    }
    import random
    return random.choice(sectors.get(user_type, ['Maritime']))

def get_mock_location():
    locations = ['Paris, France', 'Rotterdam, Pays-Bas', 'Singapour', 'Dubaï, EAU', 'Hambourg, Allemagne']
    import random
    return random.choice(locations)

def get_mock_description(user_type):
    descriptions = {
        'visitor': 'Dirigeant expérimenté dans la modernisation des infrastructures maritimes avec focus sur l\'innovation et la durabilité.',
        'exhibitor': 'Expert en solutions technologiques pour l\'industrie maritime, spécialisé dans l\'IoT et l\'automatisation portuaire.',
        'partner': 'Leader de l\'innovation maritime, spécialisé dans les partenariats technologiques stratégiques et les investissements.'
    }
    return descriptions.get(user_type, 'Professionnel du secteur maritime.')

def get_mock_interests(user_type):
    interests = {
        'visitor': ['Digital Transformation', 'Port Automation', 'Sustainability', 'Smart Logistics'],
        'exhibitor': ['IoT Maritime', 'AI & ML', 'Blockchain', 'Green Technology'],
        'partner': ['Innovation', 'Strategic Partnerships', 'Investment', 'Market Expansion']
    }
    return interests.get(user_type, ['Maritime', 'Innovation'])

def calculate_mock_compatibility(user, profile):
    """Calculate a mock compatibility score"""
    base_score = 75
    
    # User type compatibility
    if user['user_type'] == 'visitor' and profile['user_type'] in ['exhibitor', 'partner']:
        base_score += 15
    elif user['user_type'] in ['exhibitor', 'partner'] and profile['user_type'] == 'visitor':
        base_score += 15
    
    # Random variation
    import random
    variation = random.randint(-10, 20)
    
    return min(100, max(60, base_score + variation))

def get_business_potential(user_type):
    potentials = ['Élevé', 'Très élevé', 'Exceptionnel', 'Modéré']
    import random
    return random.choice(potentials)

def apply_semantic_search(profiles, query):
    """Apply semantic search to profiles"""
    if not query:
        return profiles
    
    query_terms = query.lower().split()
    scored_profiles = []
    
    for profile in profiles:
        score = 0
        search_text = f"{profile['description']} {' '.join(profile['interests'])} {profile['sector']}".lower()
        
        for term in query_terms:
            if term in search_text:
                score += 10
        
        if score > 0:
            profile['semantic_score'] = score
            scored_profiles.append(profile)
    
    return sorted(scored_profiles, key=lambda x: x.get('semantic_score', 0), reverse=True)

def are_compatible_sectors(sector1, sector2):
    """Check if two sectors are compatible"""
    compatible_pairs = [
        ('Gestion Portuaire', 'Technologies Marines'),
        ('Logistique Maritime', 'Solutions IoT'),
        ('Innovation Maritime', 'Equipment Portuaire')
    ]
    
    return (sector1, sector2) in compatible_pairs or (sector2, sector1) in compatible_pairs

# =============================================================================
# ENHANCED MINI-SITE EDITOR ENDPOINTS
# =============================================================================

# Models for enhanced mini-site data
class EnhancedMiniSiteData(BaseModel):
    # Basic info
    name: str
    tagline: str
    category: str
    icon: str
    description: str
    fullDescription: str
    location: str
    phone: str
    email: str
    website: str
    standNumber: str
    pavilion: str
    employees: str
    founded: str
    revenue: str
    clientsServed: str
    logo: Optional[str] = None
    coverImage: Optional[str] = None
    
    # Complex data structures
    timeline: List[dict] = []
    team: List[dict] = []
    values: List[dict] = []
    certifications: List[dict] = []
    services: List[dict] = []
    projects: List[dict] = []
    news: List[dict] = []
    gallery: dict = {}
    contacts: dict = {}
    social: dict = {}

@app.get("/api/minisite/enhanced/{user_id}")
async def get_enhanced_minisite_data(user_id: int, user: dict = Depends(get_current_user)):
    """Get enhanced mini-site data for a user"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        # Check if user has permission to access this data
        if user['id'] != user_id and user['user_type'] != 'admin':
            raise HTTPException(status_code=403, detail="Accès refusé")
        
        # Get the stored mini-site data
        result = conn.execute(
            'SELECT enhanced_minisite_data FROM users WHERE id = ?', 
            (user_id,)
        ).fetchone()
        
        if not result:
            conn.close()
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        if result and result['enhanced_minisite_data']:
            data = json.loads(result['enhanced_minisite_data'])
        else:
            # Return default structure if no data exists
            user_data = conn.execute(
                'SELECT * FROM users WHERE id = ?', (user_id,)
            ).fetchone()
            
            if not user_data:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
            
            data = {
                "name": user_data['company'] or 'Mon Entreprise',
                "tagline": 'Révolutionner l\'avenir maritime grâce à l\'innovation technologique',
                "category": 'Technologie Maritime',
                "icon": '⚓',
                "description": 'Solutions technologiques innovantes pour l\'industrie maritime et portuaire.',
                "fullDescription": 'Description complète de votre entreprise et de ses activités...',
                "location": 'Votre ville, Pays',
                "phone": user_data['phone'] or '+33 1 23 45 67 89',
                "email": user_data['email'],
                "website": 'www.votre-site.com',
                "standNumber": 'A-001',
                "pavilion": 'Pavillon Principal',
                "employees": '50+',
                "founded": '2020',
                "revenue": '€5M+',
                "clientsServed": '100+ clients satisfaits',
                "logo": '/images/logo-placeholder.png',
                "coverImage": '/images/cover-placeholder.jpg',
                "timeline": [],
                "team": [],
                "values": [],
                "certifications": [],
                "services": [],
                "projects": [],
                "news": [],
                "gallery": {"products": [], "installations": [], "team": [], "events": []},
                "contacts": {
                    "general": {"name": "Accueil général", "email": user_data['email'], "phone": user_data['phone'] or '+33 1 23 45 67 89'},
                    "sales": {"name": "Commercial", "role": "Directeur Commercial", "email": "sales@exemple.com", "phone": "+33 1 23 45 67 90"},
                    "support": {"name": "Support Technique", "email": "support@exemple.com", "phone": "+33 1 23 45 67 91"}
                },
                "social": {"linkedin": "", "twitter": "", "facebook": "", "youtube": ""}
            }
        
        conn.close()
        return {"data": data}
        
    except Exception as e:
        logger.error(f"Error getting enhanced minisite data: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des données")

@app.put("/api/minisite/enhanced/{user_id}")
async def save_enhanced_minisite_data(user_id: int, data: EnhancedMiniSiteData, user: dict = Depends(get_current_user)):
    """Save enhanced mini-site data for a user"""
    try:
        # Check if user has permission to modify this data
        if user['id'] != user_id and user['user_type'] != 'admin':
            raise HTTPException(status_code=403, detail="Accès refusé")
        
        conn = sqlite3.connect(DATABASE_URL)
        
        # Check if we need to add the column (for backward compatibility)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'enhanced_minisite_data' not in columns:
            # Add the column if it doesn't exist
            conn.execute('ALTER TABLE users ADD COLUMN enhanced_minisite_data TEXT')
        
        # Convert data to JSON and store
        data_json = json.dumps(data.dict())
        
        conn.execute(
            'UPDATE users SET enhanced_minisite_data = ? WHERE id = ?',
            (data_json, user_id)
        )
        conn.commit()
        conn.close()
        
        logger.info(f"Enhanced mini-site data saved for user {user_id}")
        return {"message": "Données du mini-site sauvegardées avec succès"}
        
    except Exception as e:
        logger.error(f"Error saving enhanced minisite data: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la sauvegarde des données")

@app.delete("/api/minisite/enhanced/{user_id}")
async def delete_enhanced_minisite_data(user_id: int, user: dict = Depends(get_current_user)):
    """Delete enhanced mini-site data for a user"""
    try:
        # Check if user has permission to delete this data
        if user['id'] != user_id and user['user_type'] != 'admin':
            raise HTTPException(status_code=403, detail="Accès refusé")
        
        conn = sqlite3.connect(DATABASE_URL)
        conn.execute(
            'UPDATE users SET enhanced_minisite_data = NULL WHERE id = ?',
            (user_id,)
        )
        conn.commit()
        conn.close()
        
        logger.info(f"Enhanced mini-site data deleted for user {user_id}")
        return {"message": "Données du mini-site supprimées avec succès"}
        
    except Exception as e:
        logger.error(f"Error deleting enhanced minisite data: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression des données")

@app.get("/api/minisite/enhanced/{user_id}/public")
async def get_public_enhanced_minisite(user_id: int):
    """Get public enhanced mini-site data (no authentication required)"""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        conn.row_factory = sqlite3.Row
        
        # Get the stored mini-site data and user info
        result = conn.execute(
            '''SELECT * FROM users WHERE id = ? AND user_type IN ('exhibitor', 'partner')''', 
            (user_id,)
        ).fetchone()
        
        if not result:
            # Check if user exists but is not exhibitor/partner
            user_check = conn.execute('SELECT user_type FROM users WHERE id = ?', (user_id,)).fetchone()
            conn.close()
            if user_check:
                raise HTTPException(status_code=404, detail="Mini-site non disponible pour ce type d'utilisateur")
            else:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        user_data = dict(result)
        
        # Get enhanced mini-site data
        enhanced_data = None
        if user_data.get('enhanced_minisite_data'):
            enhanced_data = json.loads(user_data['enhanced_minisite_data'])
        
        # Mock products for demonstration (in production, this would come from a products table)
        products = [
            {
                "id": 1,
                "name": "SmartShip Navigator",
                "description": "Système de navigation assistée par intelligence artificielle",
                "category": "Navigation",
                "price": "Sur devis",
                "images": ["/images/product1.jpg"]
            },
            {
                "id": 2,
                "name": "MarineIoT Hub",
                "description": "Plateforme IoT embarquée pour navires connectés",
                "category": "IoT",
                "price": "À partir de €15,000",
                "images": ["/images/product2.jpg"]
            }
        ]
        
        # Build response with enhanced data if available, fallback to basic data
        if enhanced_data:
            enhanced_data['products'] = products
            response_data = enhanced_data
        else:
            response_data = {
                "name": user_data.get('company') or f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
                "tagline": 'Expert du secteur maritime',
                "category": 'Professionnel Maritime',
                "icon": '⚓',
                "description": 'Professionnel expérimenté dans le secteur maritime.',
                "email": user_data.get('email', ''),
                "phone": user_data.get('phone', ''),
                "products": products,
                "contacts": {
                    "general": {
                        "name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
                        "email": user_data.get('email', ''),
                        "phone": user_data.get('phone') or 'Non renseigné'
                    }
                }
            }
        
        conn.close()
        return {"data": response_data}
        
    except Exception as e:
        logger.error(f"Error getting public enhanced minisite: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du mini-site")

# =============================================================================
# AI CHATBOT ENDPOINTS
# =============================================================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main AI chatbot endpoint"""
    try:
        response = await siports_ai_service.generate_response(request)
        logger.info(f"Chatbot response generated for context: {request.context_type}")
        return response
        
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur chatbot")

@app.post("/api/chat/exhibitor", response_model=ChatResponse)
async def exhibitor_chat_endpoint(request: ChatRequest):
    """Specialized endpoint for exhibitor recommendations"""
    request.context_type = "exhibitor"
    return await chat_endpoint(request)

@app.post("/api/chat/package", response_model=ChatResponse) 
async def package_chat_endpoint(request: ChatRequest):
    """Specialized endpoint for package suggestions"""
    request.context_type = "package"
    return await chat_endpoint(request)

@app.post("/api/chat/event", response_model=ChatResponse)
async def event_chat_endpoint(request: ChatRequest):
    """Specialized endpoint for event information"""
    request.context_type = "event"
    return await chat_endpoint(request)

@app.get("/api/chatbot/health")
async def chatbot_health_check():
    """Chatbot health check"""
    try:
        test_request = ChatRequest(message="test health", context_type="general")
        response = await siports_ai_service.generate_response(test_request)
        
        return {
            "status": "healthy",
            "service": "siports-ai-chatbot",
            "version": "2.0.0",
            "mock_mode": siports_ai_service.mock_mode,
            "test_response_length": len(response.response)
        }
    except Exception as e:
        logger.error(f"Chatbot health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}

# =============================================================================
# HEALTH CHECK
# =============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "SIPORTS v2.0 API", "status": "active", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "siports-api", "version": "2.0.0"}

# =============================================================================
# STARTUP EVENT
# =============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("SIPORTS v2.0 API starting...")
    logger.info(f"Database: {DATABASE_URL}")
    logger.info("AI Chatbot service initialized")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)