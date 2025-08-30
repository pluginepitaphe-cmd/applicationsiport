# 🚂 Instructions Railway RÉELLES - SIPORTS Backend

## ✅ **OPTIONS ACTUELLES SUR RAILWAY.APP**

Quand vous allez sur Railway, vous avez ces **vraies options** :

1. **Deploy from GitHub repo** 
2. **Empty Project**
3. **Deploy a template**

---

## 🎯 **MÉTHODE 1 : Empty Project + CLI (Recommandée)**

### 1️⃣ **Créer un Empty Project**
- Aller sur [railway.app](https://railway.app)
- Cliquer **"New Project"**
- Sélectionner **"Empty Project"**
- Nommer le projet : `siports-backend-v2`

### 2️⃣ **Installer Railway CLI**
```bash
# Sur votre machine locale
curl -fsSL https://railway.app/install.sh | sh
```

### 3️⃣ **Se connecter et lier le projet**
```bash
# Connexion
railway login

# Dans le dossier deployment-final/backend
cd deployment-final/backend
railway link
# Sélectionner votre projet siports-backend-v2
```

### 4️⃣ **Déployer**
```bash
railway deploy
```

---

## 🎯 **MÉTHODE 2 : GitHub Repository**

### 1️⃣ **Créer un repo GitHub**
- Créer un nouveau repository sur GitHub
- Nommer : `siports-backend-v2`

### 2️⃣ **Push le code**
```bash
cd deployment-final/backend
git init
git add .
git commit -m "SIPORTS backend v2.0"
git branch -M main
git remote add origin https://github.com/votre-username/siports-backend-v2.git
git push -u origin main
```

### 3️⃣ **Déployer depuis GitHub**
- Sur Railway : **"New Project"**
- **"Deploy from GitHub repo"**
- Sélectionner votre repo `siports-backend-v2`
- Railway détecte Python automatiquement

---

## 🎯 **MÉTHODE 3 : Interface Web Simplifiée**

### 1️⃣ **Empty Project**
- Railway : **"New Project"** → **"Empty Project"**

### 2️⃣ **Ajouter un Service**
- Dans le projet, cliquer **"+ New Service"**
- **"Empty Service"**

### 3️⃣ **Configuration du Service**
- **Settings** → **Source**
- **"Connect Repo"** ou **"Deploy from CLI"**

### 4️⃣ **Variables d'Environnement**
Dans **Variables**, ajouter :
```env
PORT=8000
JWT_SECRET_KEY=siports-jwt-production-2024
DATABASE_URL=instance/siports_production.db
PYTHONPATH=/app
```

---

## 📁 **ALTERNATIVE : Zip Upload**

### 1️⃣ **Créer un ZIP**
```bash
# Depuis /app
cd deployment-final
zip -r siports-backend.zip backend/
```

### 2️⃣ **Upload via CLI**
```bash
# Depuis le dossier backend
railway login
railway link [your-project-id]
railway deploy
```

---

## 🔧 **FICHIERS DÉJÀ CONFIGURÉS**

Votre dossier `deployment-final/backend/` contient :

✅ **`Procfile`**
```
web: python server.py
```

✅ **`railway.toml`**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python server.py"
```

✅ **`requirements.txt`**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
python-dotenv==1.0.0
ollama==0.5.2
pydantic==2.5.0
```

✅ **Variables dans `.env`**
```env
PORT=8000
JWT_SECRET_KEY=siports-jwt-production-1754917225
DATABASE_URL=instance/siports_production.db
PYTHONPATH=/app
```

---

## 🧪 **TESTS APRÈS DÉPLOIEMENT**

Une fois Railway déployé, testez :

```bash
# Remplacez par votre URL Railway générée
curl https://votre-projet-production.up.railway.app/api/

# Réponse attendue :
# {"message":"SIPORTS API v2.0","status":"running"}
```

**Autres endpoints à tester :**
- `/api/chatbot/health`
- `/api/visitor-packages`
- `/api/auth/login` (POST)

---

## 🎯 **APRÈS RAILWAY : Mettre à jour Vercel**

### 1️⃣ **Récupérer l'URL Railway**
Dans le dashboard Railway, copier l'URL générée
(ex: `https://siports-backend-v2-production-abc123.up.railway.app`)

### 2️⃣ **Modifier Vercel**
- Vercel Dashboard → Votre projet → **Settings** → **Environment Variables**
- Modifier `VITE_BACKEND_URL` :
```
VITE_BACKEND_URL=https://votre-url-railway.up.railway.app
```

### 3️⃣ **Redéployer Vercel**
- **Deployments** → **Redeploy** le dernier déploiement

---

## 🚨 **SI ÇA NE MARCHE PAS**

### **Logs Railway**
```bash
railway logs --follow
```

### **Vérifier les Variables**
Dans Railway Dashboard → **Variables** :
- `PORT` doit être `8000`
- `JWT_SECRET_KEY` doit exister
- `DATABASE_URL` doit pointer vers `instance/siports_production.db`

### **Redéployer**
```bash
railway deploy --detach
```

---

## 🎊 **RÉSULTAT FINAL**

**Stack complète :**
- **Frontend** : Vercel (déjà fait ✅)
- **Backend** : Railway (à faire)
- **Connexion** : Frontend → Backend via VITE_BACKEND_URL

**URLs finales :**
- Frontend : `https://votre-projet.vercel.app`
- Backend : `https://votre-railway-url.up.railway.app`
- Admin : `https://votre-projet.vercel.app/admin/dashboard`
- Mini-site : `https://votre-projet.vercel.app/exposant/1/mini-site` ⭐

**Temps estimé : 15-20 minutes**