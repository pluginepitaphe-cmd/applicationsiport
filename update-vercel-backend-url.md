# 🔄 Mettre à Jour l'URL Backend dans Vercel

## 📝 **APRÈS AVOIR DÉPLOYÉ SUR RAILWAY**

Une fois que Railway vous donne une URL (ex: `https://siports-backend-production-abc123.up.railway.app`), suivez ces étapes :

---

## 🎯 **MÉTHODE 1 : Interface Vercel (Recommandé)**

### 1️⃣ **Aller dans votre projet Vercel**
- Ouvrir [vercel.com](https://vercel.com)
- Sélectionner votre projet SIPORTS

### 2️⃣ **Modifier les Variables d'Environnement**
- Aller dans **"Settings"** → **"Environment Variables"**
- Chercher `VITE_BACKEND_URL`
- **Modifier** ou **Ajouter** avec votre URL Railway :

```env
VITE_BACKEND_URL=https://votre-url-railway.up.railway.app
```

### 3️⃣ **Redéployer**
- Aller dans **"Deployments"**
- Cliquer **"Redeploy"** sur le dernier déploiement
- Ou faire un nouveau commit/push

---

## 🎯 **MÉTHODE 2 : CLI Vercel**

```bash
# Configurer la variable
vercel env add VITE_BACKEND_URL

# Entrer votre URL Railway quand demandé
# Exemple: https://siports-backend-production-abc123.up.railway.app

# Redéployer
vercel --prod
```

---

## 🧪 **TESTS DE VALIDATION**

### ✅ **Vérifier la Connexion Backend**

1. **Ouvrir votre frontend Vercel**
2. **Ouvrir la console développeur** (F12)
3. **Aller sur une page avec API** (ex: `/admin/dashboard`)
4. **Vérifier les requêtes** dans l'onglet Network

Les requêtes doivent aller vers votre URL Railway, pas localhost.

### ✅ **Tests Fonctionnels**

**Connexion Admin :**
- Email : `admin@siportevent.com`
- Password : `admin123`
- Doit fonctionner et afficher le dashboard

**Chatbot IA :**
- Cliquer sur le bouton bleu flottant
- Poser une question : "Quels sont les forfaits visiteur ?"
- Doit répondre avec les 4 forfaits

**Mini-site Exposant :**
- Aller sur `/exposant/1/mini-site`
- Navigation smooth-scrolling doit fonctionner
- Toutes les sections doivent s'afficher

---

## 🔧 **DÉPANNAGE**

### ❌ **Si ça ne marche pas :**

**1. Vérifier l'URL Railway**
```bash
curl https://votre-railway-url.up.railway.app/api/
# Doit retourner : {"message":"SIPORTS API v2.0","status":"running"}
```

**2. Vérifier les Variables Vercel**
- Dans Settings → Environment Variables
- `VITE_BACKEND_URL` doit pointer vers Railway
- Pas de `/` à la fin de l'URL

**3. Vider le Cache**
- Dans Vercel : Settings → Functions → Edge Config
- Ou redéployer complètement

**4. Vérifier les CORS**
- Votre backend Railway doit accepter les requêtes de Vercel
- Les CORS sont configurés dans `server.py`

---

## 📊 **RÉSULTAT ATTENDU**

### 🌐 **URLs Finales**
- **Frontend** : `https://votre-projet.vercel.app`
- **Backend** : `https://votre-railway-url.up.railway.app`
- **Admin** : `https://votre-projet.vercel.app/admin/dashboard`
- **Mini-site** : `https://votre-projet.vercel.app/exposant/1/mini-site` ⭐

### ✅ **Fonctionnalités Testables**
- Dashboard admin avec statistiques temps réel
- Chatbot IA avec réponses contextuelles
- Mini-sites exposants avec navigation professionnelle
- Système de forfaits complet
- Calendrier et messagerie intégrés

---

## 🎊 **FÉLICITATIONS !**

Une fois cette étape terminée, votre **plateforme maritime SIPORTS v2.0** sera **100% opérationnelle** en production avec :

✨ **Mini-sites exposants professionnels**  
✨ **Chatbot IA avancé**  
✨ **Système de forfaits complet**  
✨ **Infrastructure cloud robuste**  

**Votre application est prête à accueillir des milliers d'utilisateurs !** 🎉