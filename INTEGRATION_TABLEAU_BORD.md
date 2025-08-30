# Intégration du Tableau de Bord Administrateur dans SIPORTS

## Vue d'ensemble

Ce document décrit l'intégration réussie du tableau de bord administrateur minimaliste dans l'application principale SIPORTS. Le tableau de bord permet aux administrateurs de gérer efficacement les comptes utilisateurs, valider les inscriptions et modérer les signalements.

## Fonctionnalités intégrées

### 🎯 Workflow de validation des comptes
- **File d'attente** : Affichage des comptes en attente de validation triés par date
- **Actions en 1 clic** :
  - ✅ **Valider** : Active le compte et envoie un email de confirmation
  - ❌ **Rejeter** : Désactive le compte avec motif personnalisable
  - 👁 **Voir détails** : Popup avec informations complètes du profil

### 📊 Vue d'ensemble Dashboard
- **Widgets KPI** :
  - Comptes validés
  - Comptes en attente
  - Comptes rejetés
  - Inscriptions des dernières 24h
  - Modifications récentes
- **Graphique barres** : Visualisation des validations/rejets sur 7 jours

### 👥 Gestion des utilisateurs
- **Filtres** : Par type (exposant/partenaire/visiteur) et statut
- **Actions rapides** :
  - ✉ Relancer : Email de rappel pour compléter le profil
  - 🚫 Désactiver : Bloquer un compte validé
  - 📤 Exporter CSV : Export des données filtrées

### 🚨 Modération des signalements
- **Tableau des signalements** avec actions :
  - 🗑 Supprimer le contenu signalé
  - ⚠ Avertir l'utilisateur
  - ✓ Ignorer le signalement

## Architecture technique

### Backend (Flask)
- **Nouveaux modèles** :
  - `User` : Gestion des utilisateurs avec statuts et types
  - `ValidationAction` : Historique des actions de validation
  - `Signalement` : Gestion des signalements utilisateurs

- **Nouvelles routes API** (`/api/admin/`) :
  - `GET /dashboard/stats` : Statistiques du tableau de bord
  - `GET /users/pending` : Utilisateurs en attente
  - `POST /users/{id}/validate` : Validation d'un utilisateur
  - `POST /users/{id}/reject` : Rejet d'un utilisateur
  - `GET /signalements` : Liste des signalements
  - `POST /signalements/{id}/action` : Action sur un signalement

- **Service email** : Envoi automatique d'emails de notification

### Frontend (React)
- **Nouveaux composants** :
  - `AdminDashboardPage` : Page principale du tableau de bord
  - `Dashboard` : Vue d'ensemble avec KPIs et graphiques
  - `UserManagement` : Gestion des utilisateurs
  - `Reports` : Gestion des signalements
  - `Sidebar` et `Header` : Navigation du tableau de bord

- **Nouvelle route** : `/admin/dashboard` (sans layout principal)

## Accès au tableau de bord

Le tableau de bord administrateur est accessible via l'URL :
```
http://localhost:5174/admin/dashboard
```

Cette route est indépendante du layout principal de SIPORTS pour offrir une expérience dédiée aux administrateurs.

## Installation et démarrage

### Backend
```bash
cd siports-final/siports-backend
source venv/bin/activate
pip install flask-sqlalchemy flask-cors openai
python create_admin_test_data.py  # Créer des données de test
python src/main.py  # Démarrer le serveur
```

### Frontend
```bash
cd siports-final
pnpm run dev --host  # Démarrer le serveur de développement
```

## Données de test

Le script `create_admin_test_data.py` génère automatiquement :
- 9 utilisateurs avec différents statuts
- 4 actions de validation
- 2 signalements
- Données réparties sur les 7 derniers jours pour les graphiques

## Sécurité et permissions

- Le tableau de bord est accessible sans authentification pour les tests
- En production, il faudra ajouter un système d'authentification admin
- Les actions de validation et de rejet sont tracées dans la base de données

## Compatibilité

L'intégration préserve toutes les fonctionnalités existantes de SIPORTS :
- Aucune régression détectée
- Les routes existantes fonctionnent normalement
- Le layout principal reste inchangé

## Support technique

Pour toute question ou problème :
- Vérifier que le backend Flask est démarré sur le port 5000
- Vérifier que le frontend React est démarré sur le port 5174
- Consulter les logs du serveur pour diagnostiquer les erreurs

