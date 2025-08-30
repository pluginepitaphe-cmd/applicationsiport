# SiportApplication - Guide de Déploiement

## 🏗️ Architecture
- **Backend**: FastAPI avec PostgreSQL
- **Frontend**: React (Create React App)
- **Base de données**: PostgreSQL

## 🚀 Déploiement sur Railway

### 1. Préparer votre repository
```bash
git add .
git commit -m "Configure PostgreSQL and Railway deployment"
git push origin main
```

### 2. Créer un projet Railway
1. Aller sur [railway.app](https://railway.app)
2. Connecter votre repository GitHub `siportapplication`
3. Railway détectera automatiquement les configurations

### 3. Ajouter une base de données PostgreSQL
1. Dans votre projet Railway, cliquer sur "Add Service"
2. Sélectionner "Database" → "PostgreSQL"
3. Railway générera automatiquement la variable `DATABASE_URL`

### 4. Configurer les variables d'environnement
Dans Railway, ajouter :
```
DATABASE_URL=${DATABASE_URL} # Auto-généré par Railway
CORS_ORIGINS=*
```

### 5. Obtenir votre domaine public
1. Dans Railway, aller dans les settings de votre service
2. Section "Networking" → "Generate Domain"
3. Votre URL sera : `https://your-app-name.up.railway.app`

## 🌐 Déploiement sur Vercel (Frontend seulement)

### 1. Déployer le frontend sur Vercel
```bash
cd frontend
vercel --prod
```

### 2. Configurer les variables d'environnement Vercel
```
REACT_APP_BACKEND_URL=https://your-railway-backend.up.railway.app
```

## 🔧 Résolution des problèmes courants

### Problème 1: Railway ne génère pas de domaine public
**Solution**: 
1. Aller dans Settings → Networking
2. Cliquer sur "Generate Domain"
3. Si le bouton n'apparaît pas, redéployer votre service

### Problème 2: Vercel ne voit pas les repositories privés
**Solutions**:
1. Aller dans GitHub Settings → Applications → Vercel
2. Donner accès aux repositories privés
3. Ou rendre le repository public temporairement

### Problème 3: Erreur de connexion à la base de données
**Solution**:
1. Vérifier que `DATABASE_URL` est bien configuré
2. Format correct: `postgresql://username:password@host:port/database`

## 📁 Structure des fichiers de configuration

- `railway.json` - Configuration Railway
- `vercel.json` - Configuration Vercel  
- `Dockerfile` - Pour déploiement containerisé
- `Procfile` - Commande de démarrage Railway
- `nixpacks.toml` - Configuration de build Railway
