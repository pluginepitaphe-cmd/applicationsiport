# 🚂 Railway Deployment - Trouver votre URL

## 🎯 **APRÈS DEPLOYMENT RAILWAY - OÙ ALLER ?**

### **ÉTAPE 1 : Trouver l'URL de votre backend**

#### **Dans Railway Dashboard :**
1. **Aller sur** [railway.app](https://railway.app)
2. **Se connecter** avec votre compte
3. **Cliquer** sur votre projet (siports-backend ou similar)
4. **Onglet "Settings"** → **"Networking"**
5. **Voir "Public URL"** ou **"Custom Domain"**

#### **Ou dans l'onglet "Deployments" :**
1. **Cliquer** sur le dernier déploiement
2. **Voir l'URL** dans les détails
3. **Format typique :** `https://nom-projet-production.up.railway.app`

---

## 🧪 **ÉTAPE 2 : Tester votre backend**

### **URL à tester :**
```
https://VOTRE-URL-RAILWAY.up.railway.app/api/
```

**Réponse attendue :**
```json
{
  "message": "SIPORTS API v2.0",
  "status": "running"
}
```

### **Si ça ne marche pas :**
1. **Vérifier les logs** Railway → **View Logs**
2. **Status** : Doit être "Running" (vert)
3. **Port** : Doit être 8000

---

## 🔗 **ÉTAPE 3 : URLs importantes à tester**

### **APIs principales :**
- **Status API :** `/api/`
- **Chatbot :** `/api/chatbot/health`  
- **Forfaits :** `/api/visitor-packages`
- **Auth :** `/api/auth/login` (POST)

### **Exemple complet :**
```
https://votre-projet.up.railway.app/api/chatbot/health
```

---

## 🎯 **ÉTAPE 4 : Connecter à Vercel**

Une fois que vous avez votre URL Railway :

1. **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. **Modifier/Ajouter :**
   ```
   VITE_BACKEND_URL = https://votre-url-railway.up.railway.app
   ```
4. **Redeploy** Vercel

---

## 🚨 **SI VOUS NE TROUVEZ PAS L'URL**

### **Via Railway CLI :**
```bash
railway status
```

### **Via Railway Dashboard :**
- **Projects** → **Votre projet** → **Settings** → **Networking**

---

## 📞 **BESOIN D'AIDE ?**

**Dites-moi :**
1. Le nom de votre projet Railway
2. Si vous voyez "Deployed successfully" 
3. Le statut (Running/Building/Failed)

**Je vous aiderai à trouver l'URL exacte !**