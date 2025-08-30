# 🚀 SIPORTS v2.0 - DÉPLOIEMENT PRODUCTION

## 📋 Architecture de déploiement

- **Frontend** : Vercel (React + Vite)
- **Backend** : Railway (FastAPI + SQLite)
- **Base de données** : SQLite (intégrée)
- **AI Chatbot** : Ollama simulation (gratuit)

---

## 🖥️ DÉPLOIEMENT BACKEND (Railway)

### 1. Préparation Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login Railway
railway login

# Créer nouveau projet
railway new siports-backend
```

### 2. Configuration Railway

**Fichiers créés :**
- `backend/server_production.py` - API optimisée production
- `backend/requirements_production.txt` - Dépendances minimales
- `railway.json` - Configuration Railway

**Variables d'environnement Railway :**
```env
JWT_SECRET_KEY=your-super-secret-jwt-key-here
DATABASE_URL=instance/siports_production.db
PORT=8001
```

### 3. Déploiement Railway

```bash
# Déployer sur Railway
railway deploy

# Obtenir l'URL de production
railway status
# Exemple: https://siports-api.up.railway.app
```

---

## 🌐 DÉPLOIEMENT FRONTEND (Vercel)

### 1. Préparation Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Login Vercel
vercel login
```

### 2. Configuration Vercel

**Fichiers créés :**
- `vercel.json` - Configuration Vercel + variables d'environnement

**Variables d'environnement Vercel :**
```env
VITE_BACKEND_URL=https://siports-api.up.railway.app
```

### 3. Déploiement Vercel

```bash
# Build de production
yarn build

# Déploiement Vercel
vercel --prod

# Obtenir l'URL de production  
vercel ls
# Exemple: https://siports.vercel.app
```

---

## 📡 ENDPOINTS API PRODUCTION

### 🔐 Authentication
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur

### 👥 Users & Packages  
- `GET /api/visitor-packages` - Forfaits visiteur
- `POST /api/visitor-packages/update` - Mise à jour forfait
- `GET /api/partnership-packages` - Forfaits partenaires

### 🛡️ Admin (Protected)
- `GET /api/admin/dashboard/stats` - Statistiques admin
- `GET /api/admin/users/pending` - Utilisateurs en attente
- `POST /api/admin/users/{id}/validate` - Valider utilisateur
- `POST /api/admin/users/{id}/reject` - Rejeter utilisateur

### 🤖 AI Chatbot
- `POST /api/chat` - Chatbot principal
- `POST /api/chat/exhibitor` - Recommandations exposants
- `POST /api/chat/package` - Suggestions forfaits  
- `POST /api/chat/event` - Informations événements
- `GET /api/chatbot/health` - Health check chatbot

### 📊 System
- `GET /` - Root endpoint
- `GET /health` - Health check système

---

## 🔧 APIs SUPPRIMÉES (Nettoyage)

**Endpoints de développement retirés :**
- WordPress integration (`/api/wordpress/*`)
- Mini-site editor (`/api/mini-site/*`)
- Advanced matching system (`/api/matching/*`)
- Analytics dashboard (`/api/analytics/*`)
- Messaging system (`/api/messages/*`)
- Calendar appointments (`/api/appointments/*`)
- File uploads (`/api/upload/*`)

**Raison :** Version MVP optimisée pour la production

---

## 🗃️ BASE DE DONNÉES PRODUCTION

### Utilisateurs par défaut créés :

```sql
-- Admin
email: admin@siportevent.com
password: admin123
type: admin

-- Visiteur test
email: visitor@example.com  
password: visitor123
type: visitor, package: Premium

-- Exposant test
email: exposant@example.com
password: exhibitor123  
type: exhibitor, package: Gold
```

### Tables automatiquement créées :
- `users` - Utilisateurs et authentification
- Indexes optimisés pour les requêtes fréquentes

---

## 🚀 COMMANDES DE DÉPLOIEMENT RAPIDE

### Backend (Railway)
```bash
cd backend
railway login
railway new siports-backend
railway deploy
```

### Frontend (Vercel)  
```bash
yarn build
vercel login
vercel --prod
```

---

## 🔒 SÉCURITÉ PRODUCTION

- **JWT Authentication** avec tokens sécurisés
- **CORS** configuré pour domaines de production
- **Variables d'environnement** pour secrets
- **Validation des entrées** sur tous les endpoints
- **Logs structurés** pour monitoring
- **Rate limiting** (à configurer sur Railway/Vercel)

---

## 📈 MONITORING

### Health Checks disponibles :
- `GET https://siports-api.up.railway.app/health`
- `GET https://siports-api.up.railway.app/chatbot/health`

### Logs Railway :
```bash
railway logs
```

### Analytics Vercel :
- Dashboard Vercel pour métriques frontend
- Core Web Vitals automatiques

---

## 🎯 FONCTIONNALITÉS PRODUCTION

### ✅ Incluses dans cette version :
- **Authentification complète** (register/login/JWT)
- **Forfaits visiteur** (Free, Basic, Premium, VIP)
- **Forfaits partenaires** (Startup, Silver, Gold, Platinum)  
- **Dashboard admin** avec validation utilisateurs
- **Chatbot IA gratuit** (4 contextes intelligents)
- **Sécurité robuste** et optimisée

### 🔄 Extensions futures possibles :
- Intégration Ollama pour IA avancée
- Système de messagerie avancé
- Calendrier de rendez-vous
- Analytics détaillés
- Multi-langues

---

**🎉 Application prête pour la production !**

**URLs finales :**
- Frontend: `https://siports.vercel.app`  
- Backend API: `https://siports-api.up.railway.app`