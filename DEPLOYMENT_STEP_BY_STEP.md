# 🚀 GUIDE DÉPLOIEMENT COMPLET - SIPORTS v2.0

## 📋 Vue d'ensemble du déploiement

- **Frontend** : Vercel (gratuit) - https://vercel.com
- **Backend** : Railway (gratuit) - https://railway.app  
- **Base de données** : SQLite (incluse avec Railway)
- **WordPress** : Synchronisation optionnelle

---

## 🎯 ÉTAPE 1 - CRÉATION COMPTE RAILWAY (Backend)

### 1.1 Créer le compte Railway

1. **Aller sur** : https://railway.app
2. **Cliquer** : "Start Building"
3. **S'inscrire** avec GitHub (recommandé) ou email
4. **Vérifier** l'email si nécessaire
5. **Confirmer** le compte gratuit (500h/mois gratuit)

### 1.2 Installer Railway CLI

```bash
# Sur Windows (avec npm)
npm install -g @railway/cli

# Sur macOS (avec Homebrew)
brew install railway

# Sur Linux
curl -fsSL https://railway.app/install.sh | sh
```

### 1.3 Login Railway CLI

```bash
railway login
# Suivre les instructions dans le navigateur
```

---

## 🎯 ÉTAPE 2 - DÉPLOIEMENT BACKEND RAILWAY

### 2.1 Préparer les fichiers backend

```bash
# Dans le dossier /app/backend, copier les fichiers production
cp server_production_wp.py server.py
cp requirements_production_wp.txt requirements.txt

# Vérifier que ces fichiers sont présents :
# - server.py
# - requirements.txt  
# - chatbot_service.py
# - wordpress_config.py
# - wordpress_sync.py
```

### 2.2 Créer le projet Railway

```bash
# Dans le dossier /app/backend
railway new siports-backend

# Ou si vous préférez dans le dossier principal
cd /app
railway new siports-app
```

### 2.3 Configurer les variables d'environnement

```bash
# Variables essentielles
railway variables set JWT_SECRET_KEY="votre-cle-jwt-super-secrete-ici"
railway variables set DATABASE_URL="instance/siports_production.db"
railway variables set PORT="8001"

# Variables WordPress (optionnelles)
railway variables set WORDPRESS_ENABLED="false"
railway variables set WP_DB_HOST="votre-mysql-host"
railway variables set WP_DB_NAME="wordpress"
railway variables set WP_DB_USER="wp_user"
railway variables set WP_DB_PASSWORD="wp_password"
railway variables set WP_SITE_URL="https://siportevent.com"
railway variables set WP_JWT_SECRET="wordpress-jwt-secret"
```

### 2.4 Déployer sur Railway

```bash
# Déployer le backend
railway deploy

# Attendre la fin du déploiement (2-5 minutes)
# Railway va automatiquement :
# - Installer Python et les dépendances
# - Créer la base SQLite
# - Démarrer le serveur FastAPI
```

### 2.5 Obtenir l'URL Railway

```bash
# Voir le statut et l'URL
railway status

# L'URL sera quelque chose comme :
# https://siports-backend-production.up.railway.app
```

**⚠️ IMPORTANT : Notez cette URL, vous en aurez besoin pour Vercel !**

---

## 🎯 ÉTAPE 3 - CRÉATION COMPTE VERCEL (Frontend)

### 3.1 Créer le compte Vercel

1. **Aller sur** : https://vercel.com
2. **Cliquer** : "Sign Up"
3. **S'inscrire** avec GitHub (recommandé)
4. **Autoriser** Vercel à accéder à vos repos
5. **Confirmer** le plan gratuit (100GB bandwidth/mois)

### 3.2 Installer Vercel CLI

```bash
npm install -g vercel
# ou
yarn global add vercel
```

### 3.3 Login Vercel CLI

```bash
vercel login
# Entrer votre email et suivre les instructions
```

---

## 🎯 ÉTAPE 4 - DÉPLOIEMENT FRONTEND VERCEL

### 4.1 Préparer le frontend

```bash
# Dans le dossier /app, mettre à jour l'URL backend
# Éditer le fichier .env ou créer .env.production

echo "VITE_BACKEND_URL=https://votre-url-railway.up.railway.app" > .env.production
```

### 4.2 Build et test local

```bash
# Installer les dépendances si nécessaire
yarn install

# Build de production
yarn build

# Test local (optionnel)
yarn preview
```

### 4.3 Déployer sur Vercel

```bash
# Dans le dossier /app
vercel

# Suivre les questions :
# Set up and deploy? [Y/n] y
# Which scope? Choisir votre compte
# Link to existing project? [y/N] n
# What's your project's name? siports
# In which directory is your code located? ./
# Want to override the settings? [y/N] n
```

### 4.4 Déploiement production

```bash
# Déployer en production
vercel --prod

# L'URL sera quelque chose comme :
# https://siports.vercel.app
```

---

## 🎯 ÉTAPE 5 - CONFIGURATION FINALE

### 5.1 Configurer CORS sur Railway

```bash
# Mettre à jour les variables avec l'URL Vercel
railway variables set FRONTEND_URL="https://votre-app.vercel.app"
```

### 5.2 Configurer l'URL backend sur Vercel

```bash
# Via le dashboard Vercel ou CLI
vercel env add VITE_BACKEND_URL
# Entrer : https://votre-backend.up.railway.app
```

### 5.3 Redéployer pour appliquer les changements

```bash
# Redéployer Railway
railway deploy

# Redéployer Vercel
vercel --prod
```

---

## 🧪 ÉTAPE 6 - TESTS DE DÉPLOIEMENT

### 6.1 Tester le backend

```bash
# Tester l'API Railway
curl https://votre-backend.up.railway.app/health

# Réponse attendue :
# {"status":"healthy","service":"siports-api","version":"2.0.0"}
```

### 6.2 Tester le frontend

1. **Ouvrir** : https://votre-app.vercel.app
2. **Vérifier** : Page d'accueil se charge
3. **Tester** : Bouton chatbot (en bas à droite)
4. **Tester** : Page login/register

### 6.3 Tester l'intégration complète

1. **S'inscrire** avec un nouveau compte
2. **Se connecter** avec les credentials
3. **Naviguer** vers les forfaits
4. **Tester** le chatbot IA
5. **Vérifier** le dashboard admin avec :
   - Email : admin@siportevent.com
   - Password : admin123

---

## 🔧 DÉPANNAGE FRÉQUENT

### Problème : Backend Railway ne démarre pas

```bash
# Voir les logs
railway logs

# Vérifier les variables
railway variables

# Redéployer
railway deploy
```

### Problème : Frontend Vercel erreur 500

```bash
# Vérifier les variables d'environnement
vercel env ls

# Vérifier les builds
vercel logs
```

### Problème : CORS errors

```bash
# Mettre à jour l'URL frontend sur Railway
railway variables set FRONTEND_URL="https://votre-vercel-url.vercel.app"
railway deploy
```

---

## 📊 MONITORING ET LOGS

### Railway (Backend)

```bash
# Logs en temps réel
railway logs -f

# Statut du service
railway status

# Variables d'environnement
railway variables
```

### Vercel (Frontend)

1. **Dashboard** : https://vercel.com/dashboard
2. **Analytics** : Trafic et performances
3. **Logs** : Erreurs et builds

---

## 💰 LIMITES GRATUITES

### Railway (Gratuit)
- **500 heures/mois** d'exécution
- **1GB RAM** par service
- **1GB stockage** 
- **Pas de carte bancaire** requise

### Vercel (Gratuit)
- **100GB bandwidth/mois**
- **6000 minutes build/mois**
- **Domaines personnalisés** inclus
- **Analytics basiques**

---

## ✅ CHECKLIST FINALE

- [ ] Compte Railway créé ✅
- [ ] Backend déployé sur Railway ✅
- [ ] URL Railway notée ✅
- [ ] Compte Vercel créé ✅
- [ ] Frontend déployé sur Vercel ✅
- [ ] Variables d'environnement configurées ✅
- [ ] CORS configuré ✅
- [ ] Tests backend réussis ✅
- [ ] Tests frontend réussis ✅
- [ ] Tests intégration complets ✅

---

## 🎉 URLS FINALES

Après déploiement, vous aurez :

- **Frontend** : https://siports.vercel.app
- **Backend API** : https://siports-backend.up.railway.app
- **Admin** : https://siports.vercel.app/admin/dashboard
- **Chatbot** : Disponible sur toutes les pages

**🚀 SIPORTS v2.0 est maintenant en production !**