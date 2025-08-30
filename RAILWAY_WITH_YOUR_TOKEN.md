# 🚂 Déploiement Railway avec Votre Token

## 🔑 **VOTRE TOKEN : aba6f132-6c3e-4347-a9a6-be8bdcc49664**

Le token que vous avez fourni pourrait être un **Project Token** ou **Service Token** spécifique plutôt qu'un token d'API général.

---

## 🎯 **MÉTHODE ALTERNATIVE RECOMMANDÉE**

### **Option 1 : Interface Web Railway (5 min)**

#### 1️⃣ **Créer le projet**
- Aller sur **railway.app**
- Se connecter avec votre compte
- **New Project** → **Empty Project**
- Nommer : `siports-backend-v2`

#### 2️⃣ **Ajouter le service**
- Dans le projet créé : **+ New** → **GitHub Repo** ou **Empty Service**

#### 3️⃣ **Déployer le code**
**Méthode A : Upload ZIP**
```bash
# Créer le ZIP
cd deployment-final
zip -r siports-backend.zip backend/
# Upload ce ZIP sur Railway
```

**Méthode B : GitHub**
```bash
# Push vers GitHub
cd deployment-final/backend
git init
git add .
git commit -m "SIPORTS Backend v2.0"
# Push vers un repo GitHub
# Puis connecter le repo sur Railway
```

#### 4️⃣ **Variables d'environnement**
Dans Railway → Variables → Ajouter :
```env
PORT=8000
JWT_SECRET_KEY=siports-jwt-production-2024
DATABASE_URL=instance/siports_production.db
PYTHONPATH=/app
```

---

## 🎯 **OPTION 2 : CLI avec Token Project**

Si votre token est un token de projet spécifique :

```bash
# Configurer le token
export RAILWAY_TOKEN="aba6f132-6c3e-4347-a9a6-be8bdcc49664"

# Aller dans le backend
cd deployment-final/backend

# Essayer de lier directement avec le token
railway link --project-id aba6f132-6c3e-4347-a9a6-be8bdcc49664

# Ou essayer la connexion normale
railway login
# Puis sélectionner le bon projet

# Variables
railway variables set PORT=8000
railway variables set JWT_SECRET_KEY="siports-jwt-production-$(date +%s)"
railway variables set DATABASE_URL="instance/siports_production.db"
railway variables set PYTHONPATH="/app"

# Déployer
railway deploy
```

---

## 🎯 **OPTION 3 : Nouveau Token d'API**

Si le token actuel ne fonctionne pas, générer un nouveau :

#### **Créer un token API :**
1. **railway.app** → **Account** → **Tokens**
2. **Create Token**
3. **Type** : Choisir **"API Token"** (pas Project Token)
4. **Permissions** : Toutes les permissions
5. Copier le nouveau token (format : `railway_live_...`)

#### **Puis utiliser :**
```bash
./railway-auto-deploy.sh NOUVEAU_TOKEN_API
```

---

## 🎯 **OPTION 4 : Déploiement Manuel Guidé**

Si les options automatiques ne marchent pas :

```bash
# Suivre le guide étape par étape
cat RAILWAY_GUIDE_SIMPLE.md

# Ou utiliser les scripts d'aide
cd deployment-final/backend
./setup-railway-cli.sh
```

---

## 🧪 **TESTS APRÈS DÉPLOIEMENT**

Une fois Railway déployé, l'URL sera comme :
```
https://siports-backend-v2-production.up.railway.app
```

**Tester :**
```bash
curl https://VOTRE-URL-RAILWAY.up.railway.app/api/
# Doit retourner : {"message":"SIPORTS API v2.0","status":"running"}
```

---

## 🔄 **CONNECTER À VERCEL**

1. **Vercel Dashboard** → Votre projet SIPORTS
2. **Settings** → **Environment Variables**
3. **Modifier** `VITE_BACKEND_URL` :
   ```env
   VITE_BACKEND_URL=https://VOTRE-URL-RAILWAY.up.railway.app
   ```
4. **Deployments** → **Redeploy**

---

## 🎊 **RÉSULTAT FINAL**

**Stack complète :**
- ✅ **Frontend** : Vercel
- ✅ **Backend** : Railway (avec votre token)
- ✅ **Fonctionnalités** : Mini-sites + Chatbot IA + Forfaits

**URLs finales :**
- Frontend : `https://votre-projet.vercel.app`
- Backend : `https://siports-backend-v2.up.railway.app`
- Admin : `/admin/dashboard`
- Mini-site : `/exposant/1/mini-site` ⭐

---

## 💡 **RECOMMANDATION**

**Pour gagner du temps :** Utilisez l'**Option 1 (Interface Web)** qui est la plus fiable et simple !

**Temps estimé : 10-15 minutes**