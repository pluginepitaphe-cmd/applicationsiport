# 📱 SIPORTS v2.0 - DÉPLOIEMENT MOBILE

## 🎯 Guide complet pour déploiement depuis téléphone

**Pas de terminal nécessaire !** Tout se fait via les interfaces web.

---

## 📋 ÉTAPE 1 - CRÉER LES COMPTES (5 minutes)

### 🚂 Railway (Backend)

1. **Ouvrir** : https://railway.app sur votre téléphone
2. **Cliquer** : "Start Building" 
3. **Se connecter** avec GitHub (recommandé)
   - Autoriser Railway à accéder à vos repos
4. **Choisir** : Plan gratuit (500h/mois)
5. **Noter** : Vous êtes maintenant connecté Railway ✅

### 🌐 Vercel (Frontend) 

1. **Ouvrir** : https://vercel.com sur votre téléphone
2. **Cliquer** : "Sign Up"
3. **Se connecter** avec GitHub
   - Autoriser Vercel à accéder à vos repos
4. **Choisir** : Plan Hobby (gratuit)
5. **Noter** : Vous êtes maintenant connecté Vercel ✅

---

## 📋 ÉTAPE 2 - DÉPLOIEMENT BACKEND (Railway)

### 2.1 Créer le projet

1. **Dans Railway dashboard** : https://railway.app/dashboard
2. **Cliquer** : "New Project"
3. **Choisir** : "Deploy from GitHub repo"
4. **Sélectionner** votre repo SIPORTS
5. **Nom du projet** : `siports-backend`

### 2.2 Configurer le service

1. **Cliquer** sur votre projet créé
2. **Aller** dans "Settings" → "Environment"
3. **Ajouter ces variables** (cliquer "+ Add Variable") :

```
JWT_SECRET_KEY = votre-secret-jwt-super-long-ici
DATABASE_URL = instance/siports_production.db
PORT = 8001
WORDPRESS_ENABLED = false
WP_SITE_URL = https://siportevent.com
```

### 2.3 Configurer le build

1. **Aller** dans "Settings" → "Build"
2. **Root Directory** : `backend`
3. **Build Command** : `pip install -r requirements_production_wp.txt`
4. **Start Command** : `python server_production_wp.py`

### 2.4 Déployer

1. **Cliquer** : "Deploy"
2. **Attendre** 3-5 minutes
3. **Copier l'URL** générée (ex: `https://siports-backend.up.railway.app`)
4. **Tester** : Ouvrir l'URL + `/health` dans votre navigateur
   - Vous devriez voir : `{"status":"healthy"}`

**✅ Backend déployé ! Noter l'URL Railway pour l'étape suivante.**

---

## 📋 ÉTAPE 3 - DÉPLOIEMENT FRONTEND (Vercel)

### 3.1 Préparer le projet

1. **Dans Vercel dashboard** : https://vercel.com/dashboard
2. **Cliquer** : "Add New..." → "Project"
3. **Sélectionner** votre repo SIPORTS
4. **Cliquer** : "Import"

### 3.2 Configurer les variables

1. **Dans "Configure Project"** → "Environment Variables"
2. **Ajouter** :

```
Name: VITE_BACKEND_URL
Value: https://votre-url-railway.up.railway.app
```

*Remplacez par votre vraie URL Railway de l'étape 2*

### 3.3 Configurer le build

1. **Framework Preset** : Vite
2. **Build Command** : `yarn build`
3. **Output Directory** : `dist`
4. **Install Command** : `yarn install`

### 3.4 Déployer

1. **Cliquer** : "Deploy"
2. **Attendre** 2-4 minutes
3. **Copier l'URL** générée (ex: `https://siports.vercel.app`)
4. **Tester** : Ouvrir l'URL dans votre navigateur

**✅ Frontend déployé !**

---

## 📋 ÉTAPE 4 - CONFIGURATION FINALE (2 minutes)

### 4.1 Mettre à jour Railway avec l'URL Vercel

1. **Retourner** sur Railway dashboard
2. **Ouvrir** votre projet backend
3. **Aller** dans "Variables" 
4. **Ajouter** :

```
FRONTEND_URL = https://votre-url-vercel.vercel.app
```

5. **Cliquer** : "Redeploy" pour appliquer

### 4.2 Vérifier Vercel

1. **Dans Vercel dashboard**
2. **Vérifier** que `VITE_BACKEND_URL` est bien configuré
3. **Redéployer** si nécessaire

---

## 📋 ÉTAPE 5 - TESTS (5 minutes)

### 🧪 Tests Backend

**Ouvrir ces URLs dans votre navigateur :**

1. `https://votre-backend.railway.app/health`
   - ✅ Doit afficher : `{"status":"healthy"}`

2. `https://votre-backend.railway.app/api/visitor-packages`  
   - ✅ Doit afficher la liste des forfaits

3. `https://votre-backend.railway.app/api/chatbot/health`
   - ✅ Doit afficher : `{"status":"healthy","service":"siports-ai-chatbot"}`

### 🧪 Tests Frontend

1. **Ouvrir** : `https://votre-app.vercel.app`
   - ✅ Page d'accueil doit se charger

2. **Tester chatbot** : Cliquer bouton bleu en bas à droite
   - ✅ Interface chatbot doit s'ouvrir
   - ✅ Envoyer un message test

3. **Tester login admin** : `/admin/dashboard`
   - Email : `admin@siportevent.com`
   - Password : `admin123`
   - ✅ Dashboard doit se charger

---

## 📋 ÉTAPE 6 - VÉRIFICATION FINALE

### ✅ Checklist déploiement réussi :

- [ ] Railway backend accessible
- [ ] API health check OK
- [ ] Vercel frontend accessible  
- [ ] Chatbot fonctionne
- [ ] Login admin fonctionne
- [ ] Pages forfaits se chargent
- [ ] Mobile responsive OK

### 🌐 Vos URLs finales :

```
🏠 Site web : https://votre-app.vercel.app
🔧 API : https://votre-backend.railway.app  
👤 Admin : https://votre-app.vercel.app/admin/dashboard
```

### 👤 Comptes de test :

```
Admin :
📧 admin@siportevent.com  
🔑 admin123

Visiteur :
📧 visitor@example.com
🔑 visitor123
```

---

## 🔧 DÉPANNAGE MOBILE

### ❌ Backend ne répond pas :
1. Railway dashboard → Logs
2. Vérifier les variables d'environnement
3. Redéployer si nécessaire

### ❌ Frontend erreurs CORS :
1. Vérifier `VITE_BACKEND_URL` dans Vercel
2. Vérifier `FRONTEND_URL` dans Railway
3. Redéployer les deux services

### ❌ Chatbot ne fonctionne pas :
1. Tester `https://backend/api/chatbot/health`
2. Vérifier console navigateur (F12)
3. Tester avec un autre message

---

## 🎉 SUCCÈS !

**SIPORTS v2.0 est maintenant déployé et accessible depuis n'importe où !**

### 📱 Optimisé mobile :
- Interface responsive
- Chatbot mobile-friendly  
- Navigation tactile
- Performance optimisée

### 🚀 Production ready :
- Backend sécurisé et scalable
- Frontend ultra-rapide
- Base de données persistante
- Monitoring inclus

**Votre application maritime est maintenant en ligne ! 🌊⚓**