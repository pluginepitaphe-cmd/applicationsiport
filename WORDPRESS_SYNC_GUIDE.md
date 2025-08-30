# 🔄 SIPORTS v2.0 - SYNCHRONISATION WORDPRESS

## 🎯 Architecture de synchronisation

**Synchronisation bidirectionnelle** entre SIPORTS et WordPress :
- **SIPORTS → WordPress** : Packages, utilisateurs, activité
- **WordPress → SIPORTS** : Authentification, événements, exposants
- **Temps réel** : Webhooks pour synchronisation instantanée

---

## 🔧 CONFIGURATION WORDPRESS

### Variables d'environnement Railway :

```env
# WordPress Database
WP_DB_HOST=your-mysql-host
WP_DB_NAME=wordpress_database
WP_DB_USER=wordpress_user
WP_DB_PASSWORD=your-secure-password
WP_DB_PORT=3306
WP_TABLE_PREFIX=wp_

# WordPress Site
WP_SITE_URL=https://siportevent.com
WP_ADMIN_EMAIL=admin@siportevent.com
WP_JWT_SECRET=your-wordpress-jwt-secret

# SIPORTS Integration
WORDPRESS_ENABLED=true
```

### Base de données WordPress

**Tables personnalisées requises :**

```sql
-- Custom post types pour événements
CREATE TABLE wp_posts (
  ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  post_type varchar(20) DEFAULT 'post',
  post_title text,
  post_content longtext,
  post_status varchar(20) DEFAULT 'publish',
  post_date datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);

-- Meta données pour événements/exposants
CREATE TABLE wp_postmeta (
  meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  post_id bigint(20) unsigned DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (meta_id),
  KEY post_id (post_id),
  KEY meta_key (meta_key(191))
);

-- Meta données utilisateurs pour packages SIPORTS
CREATE TABLE wp_usermeta (
  umeta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (umeta_id),
  KEY user_id (user_id),
  KEY meta_key (meta_key(191))
);
```

---

## 🔗 ENDPOINTS SYNCHRONISATION

### 🔐 Authentification WordPress

```http
POST /api/wordpress/login
Content-Type: application/json

{
  "username": "user@siportevent.com",
  "password": "wordpress_password"
}

Response:
{
  "access_token": "jwt_token",
  "user": {
    "id": 123,
    "email": "user@siportevent.com",
    "wp_user_id": 456,
    "wp_role": "subscriber",
    "visitor_package": "Premium"
  }
}
```

### 📅 Événements WordPress

```http
GET /api/wordpress/events

Response:
{
  "events": [
    {
      "id": 1,
      "title": "Conférence Maritime Innovation",
      "content": "Description de l'événement...",
      "date": "2025-06-15 09:00:00",
      "location": "Centre des Congrès Paris",
      "type": "conference"
    }
  ],
  "source": "wordpress"
}
```

### 🏢 Exposants WordPress

```http
GET /api/wordpress/exhibitors

Response:
{
  "exhibitors": [
    {
      "id": 1,
      "name": "Maritime Solutions Inc",
      "description": "Leader en solutions portuaires...",
      "website": "https://maritime-solutions.com",
      "sector": "Équipements Portuaires",
      "booth": "A12"
    }
  ],
  "source": "wordpress"
}
```

### 🔄 Webhooks WordPress

```http
POST /api/wordpress/webhook
Content-Type: application/json

{
  "action": "user_register",
  "user_email": "newuser@example.com",
  "data": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### 📊 Statut synchronisation

```http
GET /api/wordpress/sync-status/123

Response:
{
  "wp_user_id": 456,
  "sync_enabled": true,
  "last_sync": "2025-01-07T14:30:00Z",
  "recent_logs": [
    {
      "action": "package_update",
      "status": "success",
      "created_at": "2025-01-07T14:29:00Z"
    }
  ]
}
```

---

## 🎮 PLUGIN WORDPRESS

### Installation du plugin SIPORTS

**Fichier : `siports-integration.php`**

```php
<?php
/**
 * Plugin Name: SIPORTS Integration
 * Description: Synchronisation avec l'application SIPORTS v2.0
 * Version: 2.0.0
 */

// Configuration
define('SIPORTS_API_URL', 'https://siports-api.up.railway.app');

// Hooks WordPress
add_action('user_register', 'siports_sync_new_user');
add_action('updated_user_meta', 'siports_sync_user_meta', 10, 4);
add_action('publish_siports_event', 'siports_sync_event');
add_action('publish_siports_exhibitor', 'siports_sync_exhibitor');

function siports_sync_new_user($user_id) {
    $user = get_userdata($user_id);
    
    wp_remote_post(SIPORTS_API_URL . '/api/wordpress/webhook', [
        'body' => json_encode([
            'action' => 'user_register',
            'user_id' => $user_id,
            'user_email' => $user->user_email,
            'data' => [
                'display_name' => $user->display_name
            ]
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
}

function siports_sync_user_meta($meta_id, $user_id, $meta_key, $meta_value) {
    if (strpos($meta_key, 'siports_') === 0) {
        wp_remote_post(SIPORTS_API_URL . '/api/wordpress/webhook', [
            'body' => json_encode([
                'action' => 'user_meta_update',
                'user_id' => $user_id,
                'meta_key' => $meta_key,
                'meta_value' => $meta_value
            ]),
            'headers' => ['Content-Type' => 'application/json']
        ]);
    }
}

// Shortcode pour intégrer l'app React
add_shortcode('siports_app', 'siports_render_app');

function siports_render_app($atts) {
    $attributes = shortcode_atts([
        'page' => 'home',
        'width' => '100%',
        'height' => '600px'
    ], $atts);
    
    return '<div id="siports-react-app" 
                 data-page="' . $attributes['page'] . '"
                 style="width: ' . $attributes['width'] . '; height: ' . $attributes['height'] . '">
            </div>
            <script src="https://siports.vercel.app/assets/siports-wp.js"></script>';
}
?>
```

---

## 🔄 FLUX DE SYNCHRONISATION

### Scénario 1 : Connexion utilisateur WordPress

```
1. User → WordPress login
2. WordPress → SIPORTS API (/api/wordpress/login)
3. SIPORTS vérifie credentials WordPress
4. SIPORTS crée/met à jour utilisateur local
5. SIPORTS retourne JWT token
6. User accède aux fonctionnalités SIPORTS
```

### Scénario 2 : Mise à jour package SIPORTS

```
1. User → SIPORTS change package
2. SIPORTS → WordPress webhook
3. WordPress met à jour user_meta
4. WordPress notifie admin si nécessaire
```

### Scénario 3 : Nouvel événement WordPress

```
1. Admin → WordPress crée événement
2. WordPress → SIPORTS webhook
3. SIPORTS met à jour cache événements
4. Chatbot IA utilise nouvelles données
```

---

## 🛠️ DÉPLOIEMENT AVEC WORDPRESS

### Railway (Backend avec WordPress)

```bash
# Déployer version WordPress
cp server_production_wp.py server.py
cp requirements_production_wp.txt requirements.txt

# Configurer variables d'environnement
railway variables set WP_DB_HOST=your-mysql-host
railway variables set WP_DB_NAME=wordpress_db
railway variables set WORDPRESS_ENABLED=true

# Déployer
railway deploy
```

### WordPress Configuration

1. **Installer le plugin** `siports-integration.php`
2. **Créer custom post types** :
   - `siports_event` pour les événements
   - `siports_exhibitor` pour les exposants
3. **Configurer webhooks** vers l'API SIPORTS
4. **Ajouter shortcodes** pour intégrer l'app React

---

## 📊 MONITORING SYNCHRONISATION

### Logs disponibles

```sql
-- Table wp_sync_log dans SIPORTS
SELECT * FROM wp_sync_log 
WHERE created_at >= DATE('now', '-1 day')
ORDER BY created_at DESC;
```

### Métriques

- **Utilisateurs synchronisés** : `/api/admin/dashboard/stats`
- **Erreurs sync** : Logs Railway + WordPress
- **Performance** : Temps de réponse webhooks

---

## 🔒 SÉCURITÉ

### Authentification
- **JWT tokens** sécurisés partagés
- **Secrets WordPress** en variables d'environnement
- **Validation CORS** entre domaines

### Données
- **Synchronisation chiffrée** (HTTPS)
- **Validation inputs** sur tous les webhooks
- **Logs d'audit** complets

---

## ✅ FONCTIONNALITÉS SYNCHRONISÉES

### ✅ Authentification
- Login WordPress → Accès SIPORTS
- Single Sign-On (SSO)
- Rôles WordPress → Permissions SIPORTS

### ✅ Données utilisateur
- Profils synchronisés
- Packages SIPORTS ↔ WordPress meta
- Historique d'activité

### ✅ Contenus
- Événements WordPress → SIPORTS
- Exposants WordPress → Annuaire SIPORTS
- Actualités et notifications

### ✅ Temps réel
- Webhooks bidirectionnels
- Synchronisation instantanée
- Notifications push

---

**🎉 Synchronisation WordPress complète et prête pour la production !**

L'application SIPORTS peut maintenant fonctionner en parfaite harmonie avec votre site WordPress existant.