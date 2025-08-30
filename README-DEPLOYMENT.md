# 🚀 SIPORTS v2.0 - Déploiement Production

## 🎯 Déploiement automatisé

### Option 1: Scripts automatiques (Recommandé)

```bash
# 1. Déployer le backend sur Railway
./deploy-railway.sh

# 2. Déployer le frontend sur Vercel  
./deploy-vercel.sh

# 3. Tester le déploiement
./test-deployment.sh
```

### Option 2: Déploiement complet en une commande

```bash
# Déploiement full-stack automatique
npm run deploy:full
```

---

## 📋 Prérequis

### Comptes gratuits requis:
- **Railway** : https://railway.app (500h/mois gratuit)
- **Vercel** : https://vercel.com (100GB/mois gratuit)

### Outils nécessaires:
```bash
# Node.js (pour les CLI)
node --version  # v16+ requis

# Railway CLI
npm install -g @railway/cli

# Vercel CLI  
npm install -g vercel
```

---

## 🔧 Scripts disponibles

| Script | Description |
|--------|-------------|
| `./deploy-railway.sh` | Déploie le backend sur Railway |
| `./deploy-vercel.sh` | Déploie le frontend sur Vercel |
| `./test-deployment.sh` | Tests complets après déploiement |
| `npm run logs:railway` | Logs Railway |
| `npm run logs:vercel` | Logs Vercel |

---

## 🎯 Processus de déploiement

### 1. Railway Backend (2-5 minutes)

Le script `deploy-railway.sh` :
- ✅ Installe Railway CLI si nécessaire
- ✅ Crée un nouveau projet
- ✅ Configure les variables d'environnement
- ✅ Génère les secrets JWT automatiquement
- ✅ Déploie l'API FastAPI + SQLite
- ✅ Teste la connectivité
- ✅ Sauvegarde l'URL dans `railway-url.txt`

### 2. Vercel Frontend (1-3 minutes)

Le script `deploy-vercel.sh` :
- ✅ Installe Vercel CLI si nécessaire
- ✅ Lit l'URL Railway automatiquement
- ✅ Configure les variables d'environnement
- ✅ Build l'application React + Vite
- ✅ Déploie sur Vercel
- ✅ Configure CORS sur Railway
- ✅ Sauvegarde l'URL dans `vercel-url.txt`

### 3. Tests automatisés

Le script `test-deployment.sh` :
- ✅ Teste tous les endpoints backend
- ✅ Vérifie l'accessibilité frontend
- ✅ Teste l'intégration complète
- ✅ Génère un rapport détaillé
- ✅ Fournit les URLs et comptes de test

---

## 🌐 URLs de production

Après déploiement, vous aurez :

```
🌐 Frontend: https://siports-[random].vercel.app
🔧 Backend:  https://siports-backend-[timestamp].up.railway.app  
👤 Admin:    https://siports-[random].vercel.app/admin/dashboard
```

---

## 👤 Comptes de test inclus

```
Admin:
  📧 admin@siportevent.com
  🔑 admin123

Visiteur test:
  📧 visitor@example.com  
  🔑 visitor123

Exposant test:
  📧 exposant@example.com
  🔑 exhibitor123
```

---

## 🔧 Dépannage

### Backend Railway ne démarre pas
```bash
npm run logs:railway
# ou
cd backend && railway logs
```

### Frontend Vercel erreur
```bash
npm run logs:vercel
# ou 
vercel logs
```

### CORS errors
```bash
# Vérifier les variables Railway
cd backend && railway variables
```

---

## 🎛️ Configuration avancée

### Activer WordPress sync
```bash
cd backend
railway variables set WORDPRESS_ENABLED=true
railway variables set WP_DB_HOST=your-mysql-host
railway deploy
```

### Domaine personnalisé Vercel
```bash
vercel domains add your-domain.com
```

### Variables d'environnement
```bash
# Railway
cd backend && railway variables set KEY=value

# Vercel  
vercel env add KEY
```

---

## 📊 Monitoring

### Logs temps réel
```bash
# Backend
npm run logs:railway

# Frontend
npm run logs:vercel
```

### Status des services
```bash
npm run status:railway
npm run status:vercel
```

### URLs importantes
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Health Check Backend**: https://your-backend.railway.app/health
- **Chatbot Health**: https://your-backend.railway.app/api/chatbot/health

---

## 🎉 Succès du déploiement

Vous saurez que le déploiement est réussi quand :

- ✅ Script `test-deployment.sh` passe tous les tests
- ✅ Page d'accueil s'affiche correctement
- ✅ Chatbot IA répond (bouton bleu)
- ✅ Login admin fonctionne
- ✅ Dashboard affiche les statistiques
- ✅ Forfaits se chargent correctement

**🚀 SIPORTS v2.0 est maintenant en production !**