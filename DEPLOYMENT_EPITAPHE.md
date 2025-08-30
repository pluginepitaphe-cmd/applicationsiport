# 🚀 GUIDE DÉPLOIEMENT PERSONNALISÉ - Epitaphemarket@gmail.com

## ✅ VOS CREDENTIALS RAILWAY

```
Email: Epitaphemarket@gmail.com
Token: cfa3bf0e-c619-4b02-b854-7ceebd1eee92
```

---

## 📱 ÉTAPE 1 - CONNEXION RAILWAY (2 minutes)

### Option A: Via navigateur mobile (recommandé)

1. **Ouvrir** : https://railway.app
2. **Cliquer** : "Login"
3. **Email** : `Epitaphemarket@gmail.com`
4. **Se connecter** avec GitHub ou password
5. **Vérifier** : Dashboard accessible ✅

### Option B: Via Railway CLI (si vous avez un terminal)

```bash
# Se connecter avec votre token
railway login --token cfa3bf0e-c619-4b02-b854-7ceebd1eee92

# Vérifier la connexion
railway whoami
# Devrait afficher: Epitaphemarket@gmail.com
```

---

## 🚂 ÉTAPE 2 - DÉPLOIEMENT BACKEND (5 minutes)

### 2.1 Créer le projet dans Railway Dashboard

1. **Dashboard Railway** : https://railway.app/dashboard
2. **Cliquer** : "+ New Project"
3. **Choisir** : "Deploy from GitHub repo" (ou "Empty Project")
4. **Nom du projet** : `siports-backend-prod`

### 2.2 Configurer les variables d'environnement

**Aller dans Settings → Environment → Add Variable :**

```env
JWT_SECRET_KEY=9a8f7e6d5c4b3a2918273645abcdef1234567890fedcba0987654321abcdef12
DATABASE_URL=instance/siports_production.db
PORT=8001
WORDPRESS_ENABLED=false
WP_DB_HOST=localhost
WP_DB_NAME=wordpress
WP_DB_USER=root
WP_DB_PASSWORD=
WP_SITE_URL=https://siportevent.com
WP_JWT_SECRET=wp-jwt-secret-epitaphe-2024-siports
WP_TABLE_PREFIX=wp_
WP_ADMIN_EMAIL=Epitaphemarket@gmail.com
```

### 2.3 Configuration Build/Deploy

**Settings → Deploy :**

```
Root Directory: backend
Build Command: pip install -r requirements_production_wp.txt
Start Command: python server_production_wp.py
```

### 2.4 Déployer

1. **Upload les fichiers** ou connecter GitHub
2. **Cliquer** : "Deploy"
3. **Attendre** 3-5 minutes
4. **Copier l'URL** générée

**Votre URL Backend sera quelque chose comme :**
```
https://siports-backend-prod-production.up.railway.app
```

---

## 🌐 ÉTAPE 3 - DÉPLOIEMENT VERCEL (5 minutes)

### 3.1 Connexion Vercel

1. **Ouvrir** : https://vercel.com
2. **Se connecter** avec le même compte GitHub
3. **Dashboard** : https://vercel.com/dashboard

### 3.2 Créer le projet

1. **Cliquer** : "Add New..." → "Project"
2. **Import** votre repo SIPORTS
3. **Nom du projet** : `siports-epitaphe`

### 3.3 Configuration avec votre URL Railway

**Environment Variables :**

```
VITE_BACKEND_URL=https://siports-backend-prod-production.up.railway.app
```

*(Remplacez par votre vraie URL Railway)*

### 3.4 Configuration Build

```
Framework Preset: Vite
Build Command: yarn build
Output Directory: dist
Install Command: yarn install
```

### 3.5 Déployer

1. **Cliquer** : "Deploy"
2. **Attendre** 2-3 minutes
3. **Copier l'URL** générée

**Votre URL Frontend sera quelque chose comme :**
```
https://siports-epitaphe.vercel.app
```

---

## 🔧 ÉTAPE 4 - CONFIGURATION FINALE

### 4.1 Mettre à jour Railway

**Retourner sur Railway → Variables → Ajouter :**

```
FRONTEND_URL=https://siports-epitaphe.vercel.app
```

**Puis Redeploy**

### 4.2 Test de connectivité

**Testez ces URLs dans votre navigateur :**

1. **Backend Health** : 
   ```
   https://siports-backend-prod-production.up.railway.app/health
   ```

2. **Chatbot Health** :
   ```
   https://siports-backend-prod-production.up.railway.app/api/chatbot/health
   ```

3. **Frontend** :
   ```
   https://siports-epitaphe.vercel.app
   ```

---

## 🧪 TESTS COMPLETS

### ✅ Test 1: Backend API

**Dans votre navigateur mobile, ouvrir :**

```
https://votre-backend-url/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "service": "siports-api", 
  "version": "2.0.0",
  "wordpress": "disabled"
}
```

### ✅ Test 2: Chatbot API

```
https://votre-backend-url/api/chatbot/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "service": "siports-ai-chatbot",
  "version": "2.0.0",
  "mock_mode": true
}
```

### ✅ Test 3: Frontend complet

1. **Ouvrir** : `https://votre-frontend-url`
2. **Vérifier** : Page d'accueil se charge
3. **Tester chatbot** : Bouton bleu en bas à droite
4. **Envoyer message** : "Bonjour, quels forfaits proposez-vous ?"
5. **Vérifier réponse** : Le chatbot doit répondre intelligemment

### ✅ Test 4: Admin Dashboard

1. **Aller sur** : `https://votre-frontend-url/admin/dashboard`
2. **Se connecter avec :**
   ```
   Email: admin@siportevent.com
   Password: admin123
   ```
3. **Vérifier** : Statistiques s'affichent

---

## 🎯 COMMANDES CLI PERSONNALISÉES (Optionnel)

Si vous avez accès à un terminal :

```bash
# Se connecter à Railway
railway login --token cfa3bf0e-c619-4b02-b854-7ceebd1eee92

# Voir vos projets
railway project list

# Voir les logs
railway logs

# Voir les variables
railway variables

# Déployer des changements
railway deploy
```

---

## 📊 MONITORING VOS SERVICES

### Railway Dashboard
- **URL** : https://railway.app/dashboard
- **Logs** : Temps réel des erreurs backend
- **Metrics** : Usage CPU/RAM
- **Variables** : Gérer la configuration

### Vercel Dashboard  
- **URL** : https://vercel.com/dashboard
- **Analytics** : Trafic et performance
- **Deployments** : Historique des déploiements
- **Functions** : Logs des API routes

---

## 🎉 VOS URLS FINALES

Une fois déployé, vous aurez :

```
🌐 SIPORTS Frontend: https://siports-epitaphe.vercel.app
🔧 SIPORTS Backend:  https://siports-backend-prod-production.up.railway.app
👤 Admin Dashboard:  https://siports-epitaphe.vercel.app/admin/dashboard
🤖 Chatbot Health:   https://backend-url/api/chatbot/health
```

### Comptes de test disponibles :

```
🔐 Admin:
Email: admin@siportevent.com  
Password: admin123

🔐 Visiteur:
Email: visitor@example.com
Password: visitor123

🔐 Exposant:  
Email: exposant@example.com
Password: exhibitor123
```

---

## ⚡ RÉSUMÉ EXPRESS

**Pour déployer rapidement :**

1. **Railway** → New Project → Configure variables → Deploy
2. **Vercel** → New Project → Set VITE_BACKEND_URL → Deploy  
3. **Test** → Backend health + Frontend + Chatbot + Admin
4. **Done!** → App en production ✅

**Temps estimé : 15-20 minutes**

---

🚀 **SIPORTS v2.0 ready for Epitaphemarket@gmail.com !**