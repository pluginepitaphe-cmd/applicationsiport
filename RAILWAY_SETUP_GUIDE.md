# 🚂 Configuration Railway pour SIPORTS Backend

## 🎯 **ÉTAPES DE CONFIGURATION RAILWAY**

### 1️⃣ **Préparation des Fichiers Backend**

Votre backend est déjà prêt dans le dossier `deployment-final/backend/` avec :
- ✅ `server.py` (598 lignes optimisées)
- ✅ `requirements.txt` (7 dépendances)
- ✅ `Procfile` (commande de démarrage)
- ✅ `railway.toml` (configuration Railway)
- ✅ `Dockerfile` (containerisation)
- ✅ `instance/siports_production.db` (base de données)

### 2️⃣ **Créer le Projet Railway**

#### **Option A : Interface Web (Recommandé)**
1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur **"New Project"**
3. Sélectionner **"Deploy from local directory"** ou **"Empty Project"**
4. Si Empty Project, cliquer **"Deploy Now"**

#### **Option B : CLI**
```bash
railway login
railway new siports-backend-v2
```

### 3️⃣ **Upload du Code Backend**

#### **Méthode 1 : Drag & Drop (Plus Simple)**
1. Ouvrir le projet Railway créé
2. Aller dans l'onglet **"Deploy"**
3. **Glisser-déposer** le dossier `deployment-final/backend/`
4. Railway détecte automatiquement Python

#### **Méthode 2 : Git Push**
```bash
cd deployment-final/backend
git init
git add .
git commit -m "Initial SIPORTS backend deployment"
railway link [votre-project-id]
git push railway main
```

### 4️⃣ **Configuration des Variables d'Environnement**

Dans le dashboard Railway, aller dans **"Variables"** et ajouter :

```env
PORT=8000
JWT_SECRET_KEY=siports-jwt-production-2024-secure
DATABASE_URL=instance/siports_production.db
PYTHONPATH=/app
RAILWAY_ENVIRONMENT=production
```

### 5️⃣ **Vérification du Déploiement**

Railway va automatiquement :
1. **Détecter Python** via `requirements.txt`
2. **Installer les dépendances** avec `pip install -r requirements.txt`
3. **Démarrer le serveur** avec `python server.py` (depuis Procfile)
4. **Générer une URL** publique

## 🔧 **FICHIERS DE CONFIGURATION INCLUS**

### `Procfile`
```
web: python server.py
```

### `railway.toml`
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python server.py"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### `requirements.txt`
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
python-dotenv==1.0.0
ollama==0.5.2
pydantic==2.5.0
```

## 🌐 **Récupérer l'URL Backend**

Une fois déployé, Railway fournira une URL comme :
```
https://siports-backend-v2-production.up.railway.app
```

### Tester l'URL :
```bash
curl https://votre-url-railway.up.railway.app/api/
# Réponse attendue : {"message":"SIPORTS API v2.0","status":"running"}
```

## ⚙️ **Mettre à Jour Vercel avec l'URL Railway**

1. Dans votre projet Vercel, aller dans **"Settings" → "Environment Variables"**
2. Modifier ou ajouter :
```env
VITE_BACKEND_URL=https://votre-url-railway.up.railway.app
```
3. **Redéployer** le frontend Vercel

## 🧪 **Tests de Validation**

### Backend Railway :
- ✅ `https://votre-railway-url.up.railway.app/api/`
- ✅ `https://votre-railway-url.up.railway.app/api/chatbot/health`
- ✅ `https://votre-railway-url.up.railway.app/api/visitor-packages`

### Frontend Vercel :
- ✅ Connexion admin : admin@siportevent.com / admin123
- ✅ Mini-site : `/exposant/1/mini-site`
- ✅ Chatbot fonctionne avec le backend Railway

## 🚨 **Dépannage Railway**

### Si le déploiement échoue :
```bash
# Voir les logs
railway logs

# Vérifier les variables
railway variables

# Redéployer
railway deploy
```

### Erreurs communes :
- **Port incorrect** : Vérifier que PORT=8000
- **Requirements manquants** : Vérifier requirements.txt
- **Database path** : Vérifier DATABASE_URL=instance/siports_production.db

## 📊 **Monitoring Railway**

Dans le dashboard Railway :
- **Metrics** : CPU, RAM, Network usage
- **Logs** : Real-time application logs
- **Deployments** : Historique des déploiements
- **Settings** : Variables, domaines, scaling

---

## 🎊 **RÉSULTAT FINAL**

Après configuration Railway + Vercel :

**🌐 URLs de Production :**
- Frontend : `https://votre-projet.vercel.app`
- Backend : `https://siports-backend-v2.up.railway.app`
- Admin : `https://votre-projet.vercel.app/admin/dashboard`
- Mini-site : `https://votre-projet.vercel.app/exposant/1/mini-site` ⭐

**✅ Stack Complète :**
- Frontend Vercel (React + Vite)
- Backend Railway (FastAPI + Python)
- Database SQLite intégrée
- Chatbot IA fonctionnel

**🎯 Temps estimé : 10-15 minutes**