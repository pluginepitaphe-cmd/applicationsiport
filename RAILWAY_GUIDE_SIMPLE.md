# 🚂 Guide Railway Simple - SIPORTS Backend

## 🎯 **ÉTAPES EXACTES (15 minutes)**

### 1️⃣ **Aller sur Railway** 
🌐 **https://railway.app**

### 2️⃣ **Créer compte** (si nécessaire)
- Sign up gratuit avec GitHub/Google/Email

### 3️⃣ **Nouveau Projet**
- Cliquer **"New Project"**
- Options disponibles :
  - ✅ **"Empty Project"** ← CHOISIR CETTE OPTION
  - "Deploy from GitHub repo"
  - "Deploy a template"

### 4️⃣ **Nommer le projet**
- Nom : **`siports-backend-v2`**

---

## 🚂 **APRÈS CRÉATION DU PROJET**

### 5️⃣ **Méthode A : CLI (Rapide)**

**Sur votre ordinateur :**
```bash
# Installer Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Se connecter
railway login

# Aller dans le dossier backend
cd deployment-final/backend

# Lier au projet Railway
railway link
# → Sélectionner "siports-backend-v2"

# Déployer
railway deploy
```

### 6️⃣ **Méthode B : GitHub**

**Créer repo GitHub :**
```bash
cd deployment-final/backend
git init
git add .
git commit -m "SIPORTS Backend v2.0"

# Sur GitHub : créer repo "siports-backend-v2"
git remote add origin https://github.com/VOTRE-USERNAME/siports-backend-v2.git
git push -u origin main
```

**Dans Railway :**
- Supprimer le projet Empty
- **"New Project"** → **"Deploy from GitHub repo"**
- Sélectionner votre repo `siports-backend-v2`

---

## ⚙️ **VARIABLES D'ENVIRONNEMENT** 

Railway détectera automatiquement le fichier `.env` avec :
```env
PORT=8000
JWT_SECRET_KEY=siports-jwt-production-1754917225
DATABASE_URL=instance/siports_production.db
PYTHONPATH=/app
```

**Si besoin d'ajouter manuellement :**
- Dans Railway Dashboard → **Variables**
- Ajouter chaque variable ci-dessus

---

## 🧪 **VÉRIFICATION DU DÉPLOIEMENT**

### Railway vous donnera une URL comme :
```
https://siports-backend-v2-production-abc123.up.railway.app
```

### **Tester l'API :**
```bash
curl https://VOTRE-URL-RAILWAY.up.railway.app/api/
```

**Réponse attendue :**
```json
{"message":"SIPORTS API v2.0","status":"running"}
```

---

## 🔄 **CONNECTER À VERCEL**

### **Mettre à jour Vercel :**
1. Aller sur **vercel.com** → Votre projet
2. **Settings** → **Environment Variables**
3. Modifier `VITE_BACKEND_URL` :
   ```
   VITE_BACKEND_URL=https://VOTRE-URL-RAILWAY.up.railway.app
   ```
4. **Deployments** → **Redeploy**

---

## ✅ **TESTS FINAUX**

### **Frontend Vercel :**
- Ouvrir votre site Vercel
- Aller sur `/admin/dashboard`
- Se connecter : `admin@siportevent.com` / `admin123`
- ✅ Dashboard doit s'afficher

### **Mini-site Exposant :**
- Aller sur `/exposant/1/mini-site`
- ✅ Design professionnel doit s'afficher
- ✅ Navigation smooth-scrolling

### **Chatbot IA :**
- Cliquer bouton bleu flottant
- Poser question : "Quels sont les forfaits ?"
- ✅ Doit répondre avec les 4 forfaits

---

## 🚨 **EN CAS DE PROBLÈME**

### **Logs Railway :**
```bash
railway logs --follow
```

### **Variables manquantes :**
- Railway Dashboard → Variables
- Vérifier que `PORT=8000` existe

### **Redéploiement :**
```bash
railway deploy
```

---

## 🎊 **RÉSULTAT FINAL**

**Stack complète déployée :**
- ✅ **Frontend** : Vercel
- ✅ **Backend** : Railway  
- ✅ **Connection** : Frontend → Backend

**URLs finales :**
- **Frontend** : `https://votre-projet.vercel.app`
- **Backend** : `https://siports-backend-v2-production.up.railway.app`
- **Admin** : `/admin/dashboard`
- **Mini-site** : `/exposant/1/mini-site` ⭐

**Fonctionnalités opérationnelles :**
🏢 Mini-sites exposants professionnels  
🤖 Chatbot IA avec 9 endpoints  
💼 Système de forfaits complet  
📊 Dashboard admin temps réel  

**🎉 SIPORTS v2.0 EN PRODUCTION !**