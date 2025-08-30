#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Configuration WordPress pour SIPORTS
"""

import os
from typing import List
from pydantic import BaseSettings

class WordPressConfig(BaseSettings):
    # Configuration base de données WordPress
    wp_db_host: str = os.getenv("WP_DB_HOST", "localhost")
    wp_db_name: str = os.getenv("WP_DB_NAME", "siportevent_db")
    wp_db_user: str = os.getenv("WP_DB_USER", "siportevent_user")
    wp_db_password: str = os.getenv("WP_DB_PASSWORD", "")
    wp_table_prefix: str = os.getenv("WP_TABLE_PREFIX", "wp_")
    wp_db_port: int = int(os.getenv("WP_DB_PORT", "3306"))
    
    # Configuration JWT
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "siports-wordpress-integration-secret-2024")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # Configuration SIPORTS
    wordpress_url: str = os.getenv("WORDPRESS_URL", "https://siportevent.com")
    siports_api_url: str = os.getenv("SIPORTS_API_URL", "https://react-router-upgrade.preview.emergentagent.com")
    
    # Configuration CORS
    cors_origins: List[str] = [
        "https://siportevent.com",
        "https://www.siportevent.com",
        "https://react-router-upgrade.preview.emergentagent.com",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000"
    ]
    
    # Configuration synchronisation
    sync_batch_size: int = 100
    sync_timeout_seconds: int = 300
    auto_sync_enabled: bool = True
    sync_interval_minutes: int = 30
    
    # Configuration sécurité
    max_login_attempts: int = 5
    lockout_duration_minutes: int = 15
    password_min_length: int = 8
    
    # Configuration logs
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    log_file: str = os.getenv("LOG_FILE", "/app/logs/wordpress_integration.log")
    
    # Configuration cache
    redis_host: str = os.getenv("REDIS_HOST", "localhost")
    redis_port: int = int(os.getenv("REDIS_PORT", "6379"))
    redis_db: int = int(os.getenv("REDIS_DB", "0"))
    cache_ttl_seconds: int = 3600  # 1 heure
    
    # Configuration email (pour les notifications de sync)
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email: str = os.getenv("SMTP_FROM_EMAIL", "noreply@siportevent.com")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Instance globale de configuration
wp_config = WordPressConfig()

# Configuration des mappings de données
SIPORTS_TO_WP_USER_MAPPING = {
    "id": "siports_user_id",
    "email": "user_email",
    "first_name": "first_name", 
    "last_name": "last_name",
    "user_type": "siports_user_type",
    "visitor_package": "siports_visitor_package",
    "partnership_package": "siports_partnership_package",
    "exhibition_package": "siports_exhibition_package",
    "company": "siports_company",
    "phone": "siports_phone",
    "created_at": "siports_created_at",
    "profile_completion": "siports_profile_completion"
}

SIPORTS_TO_WP_PACKAGE_MAPPING = {
    "id": "siports_package_id",
    "title": "post_title",
    "description": "post_content",
    "price": "siports_price",
    "features": "siports_features",
    "package_type": "siports_package_type",
    "status": "post_status",
    "created_at": "post_date",
    "updated_at": "post_modified"
}

# Configuration des types de posts WordPress
WP_POST_TYPES = {
    "package": "siports_package",
    "match": "siports_match",
    "event": "siports_event",
    "company": "siports_company"
}

# Configuration des capacités WordPress nécessaires
WP_REQUIRED_CAPABILITIES = {
    "sync_users": "manage_users",
    "sync_packages": "edit_posts",
    "full_sync": "administrator",
    "view_analytics": "edit_posts",
    "manage_siports": "administrator"
}

# Configuration des endpoints API
API_ENDPOINTS = {
    "auth": {
        "login": "/api/auth/wordpress-login",
        "refresh": "/api/auth/refresh-token",
        "logout": "/api/auth/logout",
        "verify": "/api/auth/verify-token"
    },
    "sync": {
        "users": "/api/sync/users",
        "packages": "/api/sync/packages", 
        "full": "/api/sync/full-sync",
        "status": "/api/sync/status"
    },
    "webhook": {
        "user_updated": "/api/webhook/user-updated",
        "package_updated": "/api/webhook/package-updated",
        "wordpress_updated": "/api/webhook/wordpress-updated"
    }
}

# Configuration des hooks WordPress
WP_HOOKS = {
    "user_register": "siports_user_registered",
    "profile_update": "siports_profile_updated", 
    "post_save": "siports_package_updated",
    "user_login": "siports_user_login",
    "user_logout": "siports_user_logout"
}

def get_database_config():
    """Retourne la configuration de base de données WordPress"""
    return {
        "host": wp_config.wp_db_host,
        "port": wp_config.wp_db_port,
        "database": wp_config.wp_db_name,
        "user": wp_config.wp_db_user,
        "password": wp_config.wp_db_password,
        "charset": "utf8mb4",
        "autocommit": True,
        "raise_on_warnings": True
    }

def get_table_name(base_table: str) -> str:
    """Retourne le nom complet d'une table WordPress avec préfixe"""
    return f"{wp_config.wp_table_prefix}{base_table}"

def is_sync_enabled() -> bool:
    """Vérifie si la synchronisation est activée"""
    return wp_config.auto_sync_enabled

def get_cors_settings():
    """Retourne la configuration CORS"""
    return {
        "allow_origins": wp_config.cors_origins,
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"]
    }

# Configuration des messages d'erreur
ERROR_MESSAGES = {
    "auth_failed": "Authentification échouée",
    "token_expired": "Token expiré", 
    "token_invalid": "Token invalide",
    "permission_denied": "Permission refusée",
    "sync_failed": "Synchronisation échouée",
    "db_connection_failed": "Connexion base de données échouée",
    "wp_user_not_found": "Utilisateur WordPress non trouvé",
    "siports_user_not_found": "Utilisateur SIPORTS non trouvé",
    "invalid_request": "Requête invalide",
    "rate_limit_exceeded": "Limite de taux dépassée"
}

# Configuration des messages de succès
SUCCESS_MESSAGES = {
    "auth_success": "Authentification réussie",
    "sync_success": "Synchronisation réussie", 
    "user_created": "Utilisateur créé",
    "user_updated": "Utilisateur mis à jour",
    "package_created": "Package créé",
    "package_updated": "Package mis à jour"
}

# Configuration de logging
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
        "detailed": {
            "format": "%(asctime)s [%(levelname)s] %(name)s [%(filename)s:%(lineno)d]: %(message)s"
        }
    },
    "handlers": {
        "default": {
            "level": wp_config.log_level,
            "formatter": "standard",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout"
        },
        "file": {
            "level": wp_config.log_level,
            "formatter": "detailed", 
            "class": "logging.handlers.RotatingFileHandler",
            "filename": wp_config.log_file,
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5
        }
    },
    "loggers": {
        "": {
            "handlers": ["default", "file"],
            "level": wp_config.log_level,
            "propagate": False
        },
        "wordpress_integration": {
            "handlers": ["default", "file"],
            "level": wp_config.log_level,
            "propagate": False
        }
    }
}