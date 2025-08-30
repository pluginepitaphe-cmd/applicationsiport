# Guide de Démarrage - SIPORTS Application Finale

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et pnpm
- Python 3.11+
- Git

### 1. Cloner et Installer

```bash
# Cloner le projet
git clone <votre-repo>
cd siports-application-finale

# Installer les dépendances frontend
pnpm install
```

### 2. Démarrer le Backend

```bash
cd siports-backend

# Installer les dépendances Python
pip3 install flask flask-cors flask-sqlalchemy PyJWT openai

# Démarrer le serveur
python3 src/main.py
```

Le backend sera accessible sur **http://localhost:5001**

### 3. Démarrer le Frontend

```bash
# Retourner au répertoire racine
cd ..

# Démarrer le serveur de développement
pnpm run dev
```

Le frontend sera accessible sur **http://localhost:5174**

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` dans le répertoire `siports-backend` :

```env
SECRET_KEY=votre-clé-secrète-jwt
DATABASE_URL=sqlite:///siports.db
OPENAI_API_KEY=votre-clé-openai
```

### Configuration API

Le frontend est configuré pour utiliser automatiquement l'API backend locale. Les URLs sont définies dans `src/utils/api.js`.

## 🧪 Tests et Validation

### Comptes de Test Disponibles

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@siportevent.com | admin123 |
| Exposant | exposant@example.com | expo123 |
| Visiteur | visiteur@example.com | visit123 |
| Partenaire | partenaire@example.com | partner123 |

### Endpoints API Principaux

- `GET /api/users` - Liste des utilisateurs
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

```bash
# Build de production
pnpm run build

# Le dossier dist/ contient les fichiers à déployer
```

### Backend (Heroku/Railway)

1. Créer un `requirements.txt` :
```
flask
flask-cors
flask-sqlalchemy
PyJWT
openai
```

2. Créer un `Procfile` :
```
web: python siports-backend/src/main.py
```

3. Configurer les variables d'environnement sur la plateforme

## 📁 Structure Détaillée

```
siports-application-finale/
├── src/
│   ├── components/         # Composants React
│   ├── contexts/          # Contextes React (Auth, etc.)
│   ├── pages/             # Pages de l'application
│   ├── utils/             # Utilitaires (API, helpers)
│   └── App.jsx            # Composant principal
├── public/                # Assets statiques
├── siports-backend/
│   ├── src/
│   │   ├── models/        # Modèles de données
│   │   ├── routes/        # Routes API
│   │   └── main.py        # Point d'entrée
│   └── siports.db         # Base de données SQLite
├── package.json           # Dépendances Node.js
├── vite.config.js         # Configuration Vite
└── tailwind.config.js     # Configuration Tailwind
```

## 🔍 Dépannage

### Problèmes Courants

1. **Port déjà utilisé** : Modifier le port dans `vite.config.js` ou `main.py`
2. **CORS Error** : Vérifier que flask-cors est installé et configuré
3. **Base de données** : Supprimer `siports.db` pour recréer la DB

### Logs

- Backend : Les logs s'affichent dans le terminal où `main.py` est exécuté
- Frontend : Ouvrir les DevTools du navigateur (F12)

## 📞 Support

Pour toute question ou problème, consulter :
- Les logs d'erreur dans la console
- La documentation des dépendances utilisées
- Les issues GitHub du projet

