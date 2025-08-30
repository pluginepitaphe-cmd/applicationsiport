# 🚀 Guide de Déploiement SIPORTS v2.0

## 🌟 **NOUVELLES FONCTIONNALITÉS v2.0**

✨ **Mini-sites Exposants Professionnels**
- 3 niveaux de profils : Basic, Premium, Mini-site Pro
- Design moderne style siportevent.com
- Navigation smooth-scrolling professionnelle
- Intégration SIPORTS (stands, présentations)

✨ **Chatbot IA Avancé**
- 9 endpoints spécialisés
- Mode simulation intelligent
- Réponses contextuelles (général, exposants, forfaits, événements)
- Support Ollama pour modèles locaux

✨ **Système de Forfaits Complet**
- 4 forfaits visiteur (Free, Basic, Premium, VIP)
- 4 forfaits partenaires (Platinum, Gold, Silver, Startup)
- Gestion des limitations et quotas

---

## 📋 **OPTIONS DE DÉPLOIEMENT**

### 🎯 **Option 1: Déploiement Automatique (Recommandé)**
```bash
./auto-deploy.sh
```
- Installation automatique des CLI
- Authentification guidée
- Déploiement complet backend + frontend
- Tests automatiques

### 📖 **Option 2: Déploiement Manuel Guidé**
```bash
./deploy-manual.sh
```
- Guide étape par étape
- Contrôle total du processus
- Parfait pour apprendre

### ⚙️ **Option 3: Déploiement Personnalisé**
```bash
./deploy-production.sh  # Préparation
# Puis suivre les instructions affichées
```

---

## 🔧 **PRÉREQUIS**

### 📱 **Comptes Requis (Gratuits)**
- [Railway.app](https://railway.app) - Déploiement backend
- [Vercel.com](https://vercel.com) - Déploiement frontend

### 💻 **Outils Locaux**
- Node.js 16+ et Yarn
- Python 3.8+
- Git

---

## 🚀 **DÉPLOIEMENT RAPIDE**

### 1️⃣ **Préparation**
```bash
# Cloner et préparer
cd /app
yarn install
./deploy-production.sh
```

### 2️⃣ **Installation CLI**
```bash
npm install -g @railway/cli vercel
```

### 3️⃣ **Authentification**
```bash
railway login
vercel login
```

### 4️⃣ **Déploiement Backend**
```bash
cd backend
railway deploy
# Noter l'URL fournie
```

### 5️⃣ **Déploiement Frontend**
```bash
cd ..
# Mettre à jour frontend/.env avec l'URL backend
vercel --prod
```

---

## 🧪 **TESTS POST-DÉPLOIEMENT**

### ✅ **Checklist de Validation**

**🔧 Backend API**
- [ ] `GET /api/` - API status
- [ ] `POST /api/auth/login` - Authentification
- [ ] `GET /api/chatbot/health` - Chatbot IA
- [ ] `GET /api/visitor-packages` - Forfaits

**🌐 Frontend**
- [ ] Page d'accueil charge
- [ ] Connexion admin fonctionne
- [ ] Mini-site exposant accessible
- [ ] Chatbot répond correctement

**👤 Comptes de Test**
- Admin: `admin@siportevent.com` / `admin123`
- Exhibitor: `exposant@example.com` / `expo123`
- Visitor: `visiteur@example.com` / `visit123`

---

## 📊 **URLS IMPORTANTES**

### 🎯 **Pages Principales**
- `/` - Accueil
- `/admin/dashboard` - Dashboard admin
- `/exposants` - Annuaire exposants
- `/exposant/1/mini-site` - Mini-site professionnel
- `/forfaits-visiteur` - Forfaits visiteur
- `/partenaires/forfaits` - Forfaits partenaires
- `/chatbot-test` - Test chatbot IA

### 🔗 **APIs Backend**
- `/api/` - Status API
- `/api/auth/*` - Authentification
- `/api/chat/*` - Chatbot (9 endpoints)
- `/api/visitor-packages` - Forfaits visiteur
- `/api/partnership-packages` - Forfaits partenaires
- `/api/admin/*` - Administration

---

## 🛠️ **PERSONNALISATION**

### 🎨 **Branding**
- Logo: `/public/images/`
- Couleurs: `/src/App.css` et Tailwind
- Textes: Dans les composants React

### ⚙️ **Configuration**
- Backend: `backend/server_production.py`
- Frontend: `frontend/.env`
- Déploiement: `vercel.json`, `railway.json`

### 🤖 **Chatbot**
- Service: `backend/chatbot_service.py`
- Configuration: Variables d'environnement
- Interface: `src/components/ai/SiportsChatbot.jsx`

---

## 🆘 **DÉPANNAGE**

### 🔧 **Problèmes Courants**

**Backend ne démarre pas**
```bash
railway logs  # Voir les erreurs
railway variables  # Vérifier la config
```

**Frontend ne build pas**
```bash
yarn install --frozen-lockfile
yarn build
```

**Chatbot ne répond pas**
```bash
curl YOUR_BACKEND_URL/api/chatbot/health
```

**Mini-sites ne s'affichent pas**
- Vérifier les routes dans `App.jsx`
- Vérifier les composants `ExhibitorMiniSitePro.jsx`

### 📞 **Support**
- Logs Railway: `railway logs`
- Logs Vercel: `vercel logs`
- Status: `railway status`, `vercel ls`
- Rebuild: `railway deploy`, `vercel --prod`

---

## 🎊 **FÉLICITATIONS !**

Votre application SIPORTS v2.0 est maintenant déployée avec :

✅ **Mini-sites exposants professionnels**
✅ **Chatbot IA avancé**
✅ **Système de forfaits complet**
✅ **Dashboard admin moderne**
✅ **Design siportevent.com**

### 🌐 **Partagez votre application !**
Votre plateforme maritime professionnelle est prête à accueillir exposants, visiteurs et partenaires.

---

*Guide créé pour SIPORTS v2.0 - Maritime Events Platform*