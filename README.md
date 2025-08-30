# SIPORTS - Application Finale avec Tableau de Bord Administrateur

## Description
Application finale intégrant le frontend de siports-application, les corrections de siporteventapp, et maintenant un **tableau de bord administrateur complet** pour la gestion et validation des comptes utilisateurs.

## 🆕 Nouvelles fonctionnalités - Tableau de bord administrateur

### Accès direct
- **URL** : `http://localhost:5174/admin/dashboard`
- **Interface dédiée** : Layout indépendant pour les administrateurs

### Fonctionnalités principales
- ✅ **Validation des comptes** : Workflow complet de validation/rejet avec emails automatiques
- 📊 **Statistiques en temps réel** : KPIs et graphiques de suivi des validations
- 👥 **Gestion des utilisateurs** : Filtres, actions rapides, export CSV
- 🚨 **Modération** : Gestion des signalements utilisateurs
- 📧 **Notifications automatiques** : Emails de validation/rejet personnalisables

## Structure du Projet

```
siports-application-finale/
├── src/                    # Frontend React
│   ├── components/         # Composants React (incluant admin)
│   ├── pages/             # Pages (incluant AdminDashboardPage)
│   └── lib/               # Utilitaires (incluant API admin)
├── public/                 # Assets publics
├── siports-backend/        # Backend Flask
│   ├── src/
│   │   ├── models/        # Modèles (incluant admin)
│   │   ├── routes/        # Routes (incluant admin)
│   │   └── utils/         # Utilitaires (incluant emails)
│   └── create_admin_test_data.py  # Données de test admin
├── package.json           # Dépendances frontend
├── vite.config.js         # Configuration Vite
├── INTEGRATION_TABLEAU_BORD.md  # Documentation d'intégration
└── README.md              # Ce fichier
```

## Installation et Démarrage

### 1. Backend Flask
```bash
cd siports-backend
source venv/bin/activate
pip install flask flask-cors flask-sqlalchemy PyJWT openai
python create_admin_test_data.py  # Créer des données de test pour le tableau de bord
python src/main.py
```
Le backend sera accessible sur http://localhost:5000

### 2. Frontend React
```bash
# Dans le répertoire racine
pnpm install
pnpm run dev --host
```
Le frontend sera accessible sur http://localhost:5174

## Accès aux fonctionnalités

- **Application principale** : `http://localhost:5174`
- **Tableau de bord admin** : `http://localhost:5174/admin/dashboard`

## Fonctionnalités

### Application principale
- ✅ Interface utilisateur moderne avec React et Tailwind CSS
- ✅ Backend API Flask avec authentification JWT
- ✅ Base de données SQLite avec utilisateurs de démonstration
- ✅ Gestion des événements maritimes
- ✅ Système d'authentification complet
- ✅ Interface responsive et accessible

### Tableau de bord administrateur
- ✅ **Dashboard** : Vue d'ensemble avec KPIs (validés, en attente, rejetés, inscrits 24h)
- ✅ **Graphiques** : Visualisation des validations/rejets sur 7 jours
- ✅ **File d'attente** : Gestion des comptes en attente de validation
- ✅ **Actions rapides** : Valider/Rejeter/Voir détails en 1 clic
- ✅ **Gestion utilisateurs** : Filtres par type et statut, actions de relance
- ✅ **Modération** : Gestion des signalements avec actions appropriées
- ✅ **Emails automatiques** : Notifications de validation/rejet

## Comptes de Test

- **Admin** : admin@siportevent.com / admin123
- **Exposant** : exposant@example.com / expo123
- **Visiteur** : visiteur@example.com / visit123
- **Partenaire** : partenaire@example.com / partner123

## Données de test du tableau de bord

Le script `create_admin_test_data.py` génère automatiquement :
- 9 utilisateurs avec différents statuts (en attente, validés, rejetés)
- 4 actions de validation historiques
- 2 signalements pour la modération
- Données réparties sur 7 jours pour les graphiques

## Technologies Utilisées

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React (icônes)
- Recharts (graphiques)
- Sonner (notifications)

### Backend
- Flask
- SQLAlchemy
- JWT Authentication
- SQLite
- CORS
- Service d'emails

## Documentation

- [Guide d'intégration du tableau de bord](./INTEGRATION_TABLEAU_BORD.md)
- [Guide de démarrage](./GUIDE-DEMARRAGE.md)
- [Modifications apportées](./MODIFICATIONS_APPORTEES.md)

## Déploiement

L'application est prête pour le déploiement en production. Le frontend peut être déployé sur Vercel, Netlify ou tout autre service d'hébergement statique, tandis que le backend peut être déployé sur Heroku, Railway ou tout autre service d'hébergement Python.

## Support technique

Pour toute question ou problème :
- Consulter la documentation d'intégration
- Vérifier que les deux serveurs (backend et frontend) sont démarrés
- Consulter les logs des serveurs pour diagnostiquer les erreurs

