#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extensions WordPress pour SIPORTS Backend
Ce fichier contient les modifications à apporter au server.py principal
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import mysql.connector
from mysql.connector import Error
import jwt
import hashlib
from fastapi import HTTPException, Depends, Request, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
from wordpress_config import (
    wp_config, 
    get_database_config,
    get_table_name,
    SIPORTS_TO_WP_USER_MAPPING,
    SIPORTS_TO_WP_PACKAGE_MAPPING,
    WP_REQUIRED_CAPABILITIES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
)

# Configuration du logging
logging.basicConfig(level=getattr(logging, wp_config.log_level))
logger = logging.getLogger('wordpress_integration')

# Security
security = HTTPBearer()

# Models Pydantic pour WordPress
class WordPressLoginRequest(BaseModel):
    username: str
    password: str
    wp_auth: bool = True

class WordPressUserData(BaseModel):
    user_id: int
    username: str
    email: str
    display_name: str
    capabilities: List[str]

class SyncRequest(BaseModel):
    sync_type: str
    force: bool = False
    batch_size: int = wp_config.sync_batch_size

class SyncResult(BaseModel):
    success: bool
    message: str
    records_processed: int
    errors: List[str] = []
    sync_time: datetime
    
class WebhookData(BaseModel):
    action: str
    data: Dict[str, Any]
    source: str = "wordpress"

# Classes principales pour l'intégration WordPress

class WordPressDatabaseManager:
    """Gestionnaire de base de données WordPress"""
    
    def __init__(self):
        self.config = get_database_config()
        self._connection_pool = {}
    
    def get_connection(self):
        """Obtenir une connexion à la base WordPress"""
        try:
            connection = mysql.connector.connect(**self.config)
            if connection.is_connected():
                return connection
        except Error as e:
            logger.error(f"Erreur connexion WordPress DB: {e}")
            raise HTTPException(status_code=500, detail=ERROR_MESSAGES["db_connection_failed"])
    
    def execute_query(self, query: str, params: tuple = None, fetch_one: bool = False):
        """Exécuter une requête sur la base WordPress"""
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if query.strip().upper().startswith('SELECT'):
                return cursor.fetchone() if fetch_one else cursor.fetchall()
            else:
                connection.commit()
                return cursor.rowcount
                
        except Error as e:
            logger.error(f"Erreur exécution requête: {e}")
            if connection:
                connection.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

class WordPressAuthManager:
    """Gestionnaire d'authentification WordPress"""
    
    def __init__(self):
        self.db_manager = WordPressDatabaseManager()
        self.secret_key = wp_config.jwt_secret_key
        self.algorithm = wp_config.jwt_algorithm
    
    def verify_wordpress_password(self, password: str, wp_hash: str) -> bool:
        """Vérifier le mot de passe WordPress (version simplifiée)"""
        # NOTE: Cette implémentation est simplifiée
        # En production, utilisez la vraie vérification de hash WordPress
        try:
            # WordPress utilise un système de hash complexe
            # Pour l'intégration, on peut utiliser une vérification simplifiée
            # ou implémenter l'algorithme complet de WordPress
            return True  # À remplacer par la vraie vérification
        except Exception as e:
            logger.error(f"Erreur vérification mot de passe: {e}")
            return False
    
    def get_user_capabilities(self, user_id: int) -> List[str]:
        """Récupérer les capacités d'un utilisateur WordPress"""
        query = f"""
            SELECT meta_value 
            FROM {get_table_name('usermeta')} 
            WHERE user_id = %s AND meta_key = %s
        """
        params = (user_id, f"{wp_config.wp_table_prefix}capabilities")
        
        result = self.db_manager.execute_query(query, params, fetch_one=True)
        
        if result and result['meta_value']:
            try:
                # WordPress stocke les capacités sous format sérialisé PHP
                # Implémentation simplifiée pour la démo
                capabilities_str = result['meta_value']
                if 'administrator' in capabilities_str:
                    return ['administrator', 'manage_users', 'edit_posts', 'manage_options']
                elif 'editor' in capabilities_str:
                    return ['editor', 'edit_posts', 'manage_categories']
                else:
                    return ['subscriber', 'read']
            except Exception as e:
                logger.error(f"Erreur parsing capacités: {e}")
                return ['subscriber']
        
        return ['subscriber']
    
    def authenticate_user(self, username: str, password: str) -> WordPressUserData:
        """Authentifier un utilisateur WordPress"""
        query = f"""
            SELECT ID, user_login, user_email, user_pass, display_name 
            FROM {get_table_name('users')} 
            WHERE user_login = %s OR user_email = %s
        """
        params = (username, username)
        
        user = self.db_manager.execute_query(query, params, fetch_one=True)
        
        if not user:
            raise HTTPException(status_code=401, detail=ERROR_MESSAGES["wp_user_not_found"])
        
        # Vérifier le mot de passe (simplifiée pour la démo)
        if not self.verify_wordpress_password(password, user['user_pass']):
            raise HTTPException(status_code=401, detail=ERROR_MESSAGES["auth_failed"])
        
        # Récupérer les capacités
        capabilities = self.get_user_capabilities(user['ID'])
        
        return WordPressUserData(
            user_id=user['ID'],
            username=user['user_login'],
            email=user['user_email'],
            display_name=user['display_name'],
            capabilities=capabilities
        )
    
    def create_jwt_token(self, user_data: WordPressUserData) -> str:
        """Créer un token JWT pour l'utilisateur"""
        payload = {
            'user_id': user_data.user_id,
            'username': user_data.username,
            'email': user_data.email,
            'display_name': user_data.display_name,
            'capabilities': user_data.capabilities,
            'exp': datetime.utcnow() + timedelta(hours=wp_config.jwt_expiration_hours),
            'iat': datetime.utcnow(),
            'iss': wp_config.wordpress_url,
            'aud': 'siports-app'
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """Vérifier un token JWT"""
        try:
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm],
                audience='siports-app'
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail=ERROR_MESSAGES["token_expired"])
        except jwt.JWTError as e:
            logger.error(f"Erreur JWT: {e}")
            raise HTTPException(status_code=401, detail=ERROR_MESSAGES["token_invalid"])

class WordPressSyncManager:
    """Gestionnaire de synchronisation des données"""
    
    def __init__(self):
        self.db_manager = WordPressDatabaseManager()
        self.sqlite_db = "siports.db"  # Chemin vers la DB SQLite de SIPORTS
    
    def get_siports_connection(self):
        """Obtenir une connexion à la base SIPORTS"""
        return sqlite3.connect(self.sqlite_db)
    
    def sync_users_to_wordpress(self, force: bool = False) -> SyncResult:
        """Synchroniser les utilisateurs SIPORTS vers WordPress"""
        start_time = datetime.utcnow()
        processed = 0
        errors = []
        
        try:
            # Connexions aux bases de données
            siports_conn = self.get_siports_connection()
            siports_cursor = siports_conn.cursor()
            
            # Récupérer les utilisateurs SIPORTS à synchroniser
            if force:
                query = "SELECT * FROM users"
            else:
                query = "SELECT * FROM users WHERE wp_sync_status != 'synced' OR wp_sync_status IS NULL"
            
            siports_cursor.execute(query)
            siports_users = siports_cursor.fetchall()
            
            # Récupérer les noms de colonnes
            column_names = [description[0] for description in siports_cursor.description]
            
            for user_row in siports_users:
                try:
                    # Convertir en dictionnaire
                    user = dict(zip(column_names, user_row))
                    
                    # Vérifier si l'utilisateur existe déjà dans WordPress
                    wp_user_check = f"""
                        SELECT ID FROM {get_table_name('users')} 
                        WHERE user_email = %s
                    """
                    existing_user = self.db_manager.execute_query(
                        wp_user_check, 
                        (user['email'],), 
                        fetch_one=True
                    )
                    
                    if existing_user:
                        # Mettre à jour l'utilisateur existant
                        self.update_wordpress_user(existing_user['ID'], user)
                    else:
                        # Créer un nouvel utilisateur
                        wp_user_id = self.create_wordpress_user(user)
                        
                        # Mettre à jour SIPORTS avec l'ID WordPress
                        siports_cursor.execute(
                            "UPDATE users SET wp_user_id = ?, wp_sync_status = 'synced' WHERE id = ?",
                            (wp_user_id, user['id'])
                        )
                    
                    processed += 1
                    
                except Exception as e:
                    error_msg = f"Erreur sync utilisateur {user.get('id', 'unknown')}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            siports_conn.commit()
            siports_conn.close()
            
            return SyncResult(
                success=True,
                message=f"{SUCCESS_MESSAGES['sync_success']}: {processed} utilisateurs",
                records_processed=processed,
                errors=errors,
                sync_time=start_time
            )
            
        except Exception as e:
            logger.error(f"Erreur sync utilisateurs: {e}")
            return SyncResult(
                success=False,
                message=f"{ERROR_MESSAGES['sync_failed']}: {str(e)}",
                records_processed=processed,
                errors=errors + [str(e)],
                sync_time=start_time
            )
    
    def create_wordpress_user(self, siports_user: Dict) -> int:
        """Créer un utilisateur WordPress"""
        insert_query = f"""
            INSERT INTO {get_table_name('users')} 
            (user_login, user_email, user_registered, display_name, user_nicename, user_status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        display_name = f"{siports_user.get('first_name', '')} {siports_user.get('last_name', '')}".strip()
        if not display_name:
            display_name = siports_user.get('email', '').split('@')[0]
        
        params = (
            siports_user['email'].split('@')[0],  # user_login
            siports_user['email'],  # user_email
            datetime.now(),  # user_registered
            display_name,  # display_name
            siports_user['email'].split('@')[0].lower(),  # user_nicename
            0  # user_status
        )
        
        # Exécuter l'insertion
        self.db_manager.execute_query(insert_query, params)
        
        # Récupérer l'ID du nouvel utilisateur
        user_id_query = f"""
            SELECT ID FROM {get_table_name('users')} 
            WHERE user_email = %s ORDER BY ID DESC LIMIT 1
        """
        result = self.db_manager.execute_query(user_id_query, (siports_user['email'],), fetch_one=True)
        
        user_id = result['ID']
        
        # Ajouter les métadonnées SIPORTS
        self.add_user_metadata(user_id, siports_user)
        
        return user_id
    
    def update_wordpress_user(self, wp_user_id: int, siports_user: Dict):
        """Mettre à jour un utilisateur WordPress"""
        display_name = f"{siports_user.get('first_name', '')} {siports_user.get('last_name', '')}".strip()
        if not display_name:
            display_name = siports_user.get('email', '').split('@')[0]
        
        update_query = f"""
            UPDATE {get_table_name('users')} 
            SET display_name = %s, user_email = %s 
            WHERE ID = %s
        """
        
        params = (display_name, siports_user['email'], wp_user_id)
        self.db_manager.execute_query(update_query, params)
        
        # Mettre à jour les métadonnées
        self.add_user_metadata(wp_user_id, siports_user)
    
    def add_user_metadata(self, wp_user_id: int, siports_user: Dict):
        """Ajouter les métadonnées SIPORTS à un utilisateur WordPress"""
        metadata_map = {
            'siports_user_id': siports_user.get('id'),
            'siports_user_type': siports_user.get('user_type'),
            'siports_visitor_package': siports_user.get('visitor_package'),
            'siports_partnership_package': siports_user.get('partnership_package'),
            'siports_company': siports_user.get('company'),
            'siports_phone': siports_user.get('phone'),
            'siports_profile_completion': siports_user.get('profile_completion', 0),
            'siports_sync_date': datetime.now().isoformat()
        }
        
        for meta_key, meta_value in metadata_map.items():
            if meta_value is not None:
                # Vérifier si la métadonnée existe déjà
                check_query = f"""
                    SELECT umeta_id FROM {get_table_name('usermeta')} 
                    WHERE user_id = %s AND meta_key = %s
                """
                existing = self.db_manager.execute_query(
                    check_query, 
                    (wp_user_id, meta_key), 
                    fetch_one=True
                )
                
                if existing:
                    # Mettre à jour
                    update_query = f"""
                        UPDATE {get_table_name('usermeta')} 
                        SET meta_value = %s 
                        WHERE user_id = %s AND meta_key = %s
                    """
                    params = (str(meta_value), wp_user_id, meta_key)
                else:
                    # Insérer
                    insert_query = f"""
                        INSERT INTO {get_table_name('usermeta')} 
                        (user_id, meta_key, meta_value) 
                        VALUES (%s, %s, %s)
                    """
                    params = (wp_user_id, meta_key, str(meta_value))
                
                self.db_manager.execute_query(insert_query if not existing else update_query, params)

    def sync_packages_to_wordpress(self, force: bool = False) -> SyncResult:
        """Synchroniser les packages SIPORTS vers WordPress"""
        start_time = datetime.utcnow()
        processed = 0
        errors = []
        
        try:
            siports_conn = self.get_siports_connection()
            siports_cursor = siports_conn.cursor()
            
            # Récupérer les packages à synchroniser
            if force:
                query = "SELECT * FROM packages"
            else:
                query = "SELECT * FROM packages WHERE wp_sync_status != 'synced' OR wp_sync_status IS NULL"
            
            siports_cursor.execute(query)
            packages = siports_cursor.fetchall()
            column_names = [description[0] for description in siports_cursor.description]
            
            for package_row in packages:
                try:
                    package = dict(zip(column_names, package_row))
                    
                    # Créer ou mettre à jour le post WordPress
                    wp_post_id = self.create_wordpress_post(package)
                    
                    # Mettre à jour SIPORTS
                    siports_cursor.execute(
                        "UPDATE packages SET wp_post_id = ?, wp_sync_status = 'synced' WHERE id = ?",
                        (wp_post_id, package['id'])
                    )
                    
                    processed += 1
                    
                except Exception as e:
                    error_msg = f"Erreur sync package {package.get('id', 'unknown')}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            siports_conn.commit()
            siports_conn.close()
            
            return SyncResult(
                success=True,
                message=f"{SUCCESS_MESSAGES['sync_success']}: {processed} packages",
                records_processed=processed,
                errors=errors,
                sync_time=start_time
            )
            
        except Exception as e:
            logger.error(f"Erreur sync packages: {e}")
            return SyncResult(
                success=False,
                message=f"{ERROR_MESSAGES['sync_failed']}: {str(e)}",
                records_processed=processed,
                errors=errors + [str(e)],
                sync_time=start_time
            )
    
    def create_wordpress_post(self, siports_package: Dict) -> int:
        """Créer un post WordPress pour un package"""
        insert_query = f"""
            INSERT INTO {get_table_name('posts')} 
            (post_title, post_content, post_status, post_type, post_date, post_modified, post_author)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            siports_package.get('title', ''),
            siports_package.get('description', ''),
            'publish',  # post_status
            'siports_package',  # post_type
            datetime.now(),  # post_date
            datetime.now(),  # post_modified
            1  # post_author (admin)
        )
        
        self.db_manager.execute_query(insert_query, params)
        
        # Récupérer l'ID du post
        post_id_query = f"""
            SELECT ID FROM {get_table_name('posts')} 
            WHERE post_title = %s AND post_type = 'siports_package' 
            ORDER BY ID DESC LIMIT 1
        """
        result = self.db_manager.execute_query(
            post_id_query, 
            (siports_package.get('title', ''),), 
            fetch_one=True
        )
        
        post_id = result['ID']
        
        # Ajouter les métadonnées du package
        self.add_post_metadata(post_id, siports_package)
        
        return post_id
    
    def add_post_metadata(self, post_id: int, siports_package: Dict):
        """Ajouter les métadonnées SIPORTS à un post"""
        metadata_map = {
            'siports_package_id': siports_package.get('id'),
            'siports_price': siports_package.get('price'),
            'siports_features': json.dumps(siports_package.get('features', [])),
            'siports_package_type': siports_package.get('package_type'),
            'siports_status': siports_package.get('status'),
            'siports_sync_date': datetime.now().isoformat()
        }
        
        for meta_key, meta_value in metadata_map.items():
            if meta_value is not None:
                insert_query = f"""
                    INSERT INTO {get_table_name('postmeta')} 
                    (post_id, meta_key, meta_value) 
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)
                """
                params = (post_id, meta_key, str(meta_value))
                self.db_manager.execute_query(insert_query, params)

# Instances globales
auth_manager = WordPressAuthManager()
sync_manager = WordPressSyncManager()

# Fonctions de dépendance
def get_current_wp_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Obtenir l'utilisateur WordPress authentifié"""
    token = credentials.credentials
    return auth_manager.verify_jwt_token(token)

def require_wp_capability(capability: str):
    """Vérifier qu'un utilisateur a une capacité WordPress spécifique"""
    def check_capability(user: Dict[str, Any] = Depends(get_current_wp_user)):
        if capability not in user.get('capabilities', []):
            raise HTTPException(
                status_code=403, 
                detail=f"{ERROR_MESSAGES['permission_denied']}: {capability} required"
            )
        return user
    return check_capability

# Routes d'API WordPress (à ajouter au FastAPI principal)

def add_wordpress_routes(app):
    """Ajouter les routes WordPress à l'application FastAPI"""
    
    @app.post("/api/auth/wordpress-login")
    async def wordpress_login(request: WordPressLoginRequest):
        """Authentification WordPress"""
        try:
            user_data = auth_manager.authenticate_user(request.username, request.password)
            token = auth_manager.create_jwt_token(user_data)
            
            return {
                'success': True,
                'access_token': token,
                'token_type': 'Bearer',
                'expires_in': wp_config.jwt_expiration_hours * 3600,
                'user': user_data.dict()
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erreur login WordPress: {e}")
            raise HTTPException(status_code=500, detail=ERROR_MESSAGES["auth_failed"])
    
    @app.post("/api/sync/users")
    async def sync_users_endpoint(
        request: SyncRequest,
        background_tasks: BackgroundTasks,
        user: Dict = Depends(require_wp_capability('manage_users'))
    ):
        """Synchroniser les utilisateurs"""
        result = sync_manager.sync_users_to_wordpress(force=request.force)
        return result
    
    @app.post("/api/sync/packages")
    async def sync_packages_endpoint(
        request: SyncRequest,
        background_tasks: BackgroundTasks,
        user: Dict = Depends(require_wp_capability('edit_posts'))
    ):
        """Synchroniser les packages"""
        result = sync_manager.sync_packages_to_wordpress(force=request.force)
        return result
    
    @app.post("/api/sync/full-sync")
    async def full_sync_endpoint(
        request: SyncRequest,
        background_tasks: BackgroundTasks,
        user: Dict = Depends(require_wp_capability('administrator'))
    ):
        """Synchronisation complète"""
        users_result = sync_manager.sync_users_to_wordpress(force=request.force)
        packages_result = sync_manager.sync_packages_to_wordpress(force=request.force)
        
        return {
            'success': users_result.success and packages_result.success,
            'users': users_result,
            'packages': packages_result,
            'total_processed': users_result.records_processed + packages_result.records_processed
        }
    
    @app.get("/api/sync/status")
    async def sync_status_endpoint(user: Dict = Depends(get_current_wp_user)):
        """Statut de synchronisation"""
        try:
            siports_conn = sync_manager.get_siports_connection()
            cursor = siports_conn.cursor()
            
            # Statistiques de synchronisation
            cursor.execute("SELECT COUNT(*) FROM users WHERE wp_user_id IS NOT NULL")
            synced_users = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM packages WHERE wp_post_id IS NOT NULL")
            synced_packages = cursor.fetchone()[0]
            
            cursor.execute("SELECT MAX(updated_at) FROM users WHERE wp_sync_status = 'synced'")
            last_user_sync = cursor.fetchone()[0]
            
            cursor.execute("SELECT MAX(updated_at) FROM packages WHERE wp_sync_status = 'synced'")
            last_package_sync = cursor.fetchone()[0]
            
            siports_conn.close()
            
            return {
                'synced_users': synced_users,
                'synced_packages': synced_packages,
                'last_user_sync': last_user_sync,
                'last_package_sync': last_package_sync,
                'sync_enabled': wp_config.auto_sync_enabled,
                'last_check': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur statut sync: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/webhook/wordpress-updated")
    async def wordpress_webhook(webhook_data: WebhookData):
        """Webhook pour les mises à jour WordPress"""
        try:
            logger.info(f"Webhook WordPress reçu: {webhook_data.action}")
            
            # Traiter le webhook selon l'action
            if webhook_data.action == "user_updated":
                # Traiter mise à jour utilisateur
                pass
            elif webhook_data.action == "post_updated":
                # Traiter mise à jour post
                pass
            
            return {'success': True, 'message': 'Webhook traité'}
            
        except Exception as e:
            logger.error(f"Erreur webhook: {e}")
            raise HTTPException(status_code=500, detail=str(e))

def configure_wordpress_cors(app):
    """Configurer CORS pour WordPress"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=wp_config.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Fonction principale pour initialiser l'intégration WordPress
def init_wordpress_integration(app):
    """Initialiser l'intégration WordPress"""
    logger.info("Initialisation de l'intégration WordPress SIPORTS")
    
    # Configurer CORS
    configure_wordpress_cors(app)
    
    # Ajouter les routes
    add_wordpress_routes(app)
    
    # Vérifier la connectivité WordPress
    try:
        db_manager = WordPressDatabaseManager()
        connection = db_manager.get_connection()
        if connection:
            logger.info("✅ Connexion WordPress DB établie")
            connection.close()
    except Exception as e:
        logger.error(f"❌ Erreur connexion WordPress DB: {e}")
    
    logger.info("🎉 Intégration WordPress initialisée avec succès")