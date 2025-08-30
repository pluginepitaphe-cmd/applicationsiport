#!/bin/bash
# 📦 Package SIPORTS WordPress Integration pour déploiement
# Ce script crée un package complet prêt à être déployé sur siportevent.com

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════════════════╗"
    echo "║                📦 SIPORTS WordPress Integration Package                       ║"
    echo "║                            Packaging for siportevent.com                      ║"
    echo "╚════════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$CURRENT_DIR/siports-wordpress-package"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="siports-wordpress-integration-$TIMESTAMP"

print_header

echo -e "${BLUE}📁 Création du package de déploiement...${NC}"

# Nettoyer et créer le répertoire de package
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Structure WordPress Plugin
echo -e "${BLUE}🔧 Création structure plugin WordPress...${NC}"
PLUGIN_DIR="$PACKAGE_DIR/wordpress-plugin"
mkdir -p "$PLUGIN_DIR"
mkdir -p "$PLUGIN_DIR/build/static/js"
mkdir -p "$PLUGIN_DIR/build/static/css"

# Copier le plugin WordPress
cp "$CURRENT_DIR/siports-integration.php" "$PLUGIN_DIR/"
cp "$CURRENT_DIR/build/static/js/init.js" "$PLUGIN_DIR/build/static/js/main.js"
cp "$CURRENT_DIR/build/static/css/main.css" "$PLUGIN_DIR/build/static/css/"

echo -e "${GREEN}✅ Plugin WordPress créé${NC}"

# Backend Extensions
echo -e "${BLUE}⚙️  Préparation extensions backend...${NC}"
BACKEND_DIR="$PACKAGE_DIR/backend-extensions"
mkdir -p "$BACKEND_DIR"

cp "$CURRENT_DIR/wordpress_config.py" "$BACKEND_DIR/"
cp "$CURRENT_DIR/wordpress_extensions.py" "$BACKEND_DIR/"

# Créer le fichier requirements supplémentaires
cat > "$BACKEND_DIR/wordpress_requirements.txt" << 'EOF'
# Dépendances WordPress pour SIPORTS
mysql-connector-python==8.2.0
PyJWT==2.8.0
python-multipart==0.0.6
pydantic-settings==2.1.0
redis==5.0.1
EOF

echo -e "${GREEN}✅ Extensions backend créées${NC}"

# Configuration
echo -e "${BLUE}📝 Préparation fichiers de configuration...${NC}"
CONFIG_DIR="$PACKAGE_DIR/configuration"
mkdir -p "$CONFIG_DIR"

# Fichier .env template
cat > "$CONFIG_DIR/env.template" << 'EOF'
# WordPress Integration Settings pour SIPORTS
# Copiez ce fichier vers backend/.env et remplissez les valeurs

# Base de données WordPress
WP_DB_HOST=localhost
WP_DB_NAME=siportevent_db
WP_DB_USER=votre_utilisateur_db
WP_DB_PASSWORD=votre_mot_de_passe_db
WP_TABLE_PREFIX=wp_

# Configuration JWT (générez une clé sécurisée)
JWT_SECRET_KEY=votre-clé-jwt-sécurisée-32-caractères

# URLs
WORDPRESS_URL=https://siportevent.com
SIPORTS_API_URL=https://react-router-upgrade.preview.emergentagent.com

# Logs
LOG_LEVEL=INFO
EOF

# Script de configuration automatique
cat > "$CONFIG_DIR/configure.sh" << 'EOF'
#!/bin/bash
# Configuration automatique pour siportevent.com

echo "🔧 Configuration SIPORTS WordPress Integration"
echo "=============================================="

# Demander les informations de base de données
read -p "Host de la base de données [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Nom de la base de données: " DB_NAME
read -p "Utilisateur de la base de données: " DB_USER
read -s -p "Mot de passe de la base de données: " DB_PASSWORD
echo

# Générer une clé JWT
JWT_KEY=$(openssl rand -hex 32)

# Créer le fichier .env
cat > .env << EOL
WP_DB_HOST=$DB_HOST
WP_DB_NAME=$DB_NAME
WP_DB_USER=$DB_USER
WP_DB_PASSWORD=$DB_PASSWORD
WP_TABLE_PREFIX=wp_
JWT_SECRET_KEY=$JWT_KEY
WORDPRESS_URL=https://siportevent.com
SIPORTS_API_URL=https://react-router-upgrade.preview.emergentagent.com
LOG_LEVEL=INFO
EOL

echo "✅ Fichier .env créé avec succès!"
echo "🔐 Clé JWT générée automatiquement"
echo "📋 Vérifiez le fichier .env et ajustez si nécessaire"
EOF

chmod +x "$CONFIG_DIR/configure.sh"

echo -e "${GREEN}✅ Configuration créée${NC}"

# Scripts de déploiement
echo -e "${BLUE}🚀 Préparation scripts de déploiement...${NC}"
SCRIPTS_DIR="$PACKAGE_DIR/scripts"
mkdir -p "$SCRIPTS_DIR"

# Copier le script de déploiement principal
cp "$CURRENT_DIR/deploy.sh" "$SCRIPTS_DIR/"

# Script d'installation rapide
cat > "$SCRIPTS_DIR/install.sh" << 'EOF'
#!/bin/bash
# Installation rapide SIPORTS WordPress Integration

set -e

echo "🚀 Installation SIPORTS WordPress Integration"
echo "============================================"

# Vérifier les prérequis
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root"
    exit 1
fi

# Chemins par défaut
WORDPRESS_PATH="/var/www/html"
SIPORTS_PATH="/app"

# Vérifier WordPress
if [ ! -f "$WORDPRESS_PATH/wp-config.php" ]; then
    echo "❌ WordPress non trouvé dans $WORDPRESS_PATH"
    exit 1
fi

echo "✅ WordPress trouvé"

# Installer le plugin
echo "📦 Installation du plugin WordPress..."
cp -r wordpress-plugin/* "$WORDPRESS_PATH/wp-content/plugins/siports-integration/"
chown -R www-data:www-data "$WORDPRESS_PATH/wp-content/plugins/siports-integration/"

echo "✅ Plugin installé"

# Installer les extensions backend
echo "⚙️  Installation des extensions backend..."
cp backend-extensions/*.py "$SIPORTS_PATH/backend/"

# Installer les dépendances
echo "📚 Installation des dépendances..."
pip install -r backend-extensions/wordpress_requirements.txt

echo "✅ Extensions backend installées"

# Configuration
echo "🔧 Configuration..."
if [ -f "configuration/.env" ]; then
    cp configuration/.env "$SIPORTS_PATH/backend/"
    echo "✅ Configuration copiée"
else
    echo "⚠️  Fichier .env non trouvé, utilisez configuration/configure.sh"
fi

# Activer le plugin WordPress
echo "🔌 Activation du plugin..."
cd "$WORDPRESS_PATH"
wp plugin activate siports-integration --allow-root || echo "⚠️  Activation manuelle requise"

echo ""
echo "🎉 Installation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez la base de données avec configuration/configure.sh"
echo "2. Redémarrez les services SIPORTS"
echo "3. Testez l'intégration dans WordPress admin"
echo ""
EOF

chmod +x "$SCRIPTS_DIR/install.sh"

echo -e "${GREEN}✅ Scripts de déploiement créés${NC}"

# Documentation
echo -e "${BLUE}📚 Création de la documentation...${NC}"
DOCS_DIR="$PACKAGE_DIR/documentation"
mkdir -p "$DOCS_DIR"

cp "$CURRENT_DIR/INSTALLATION_GUIDE.md" "$DOCS_DIR/"

# README principal du package
cat > "$PACKAGE_DIR/README.md" << 'EOF'
# 📦 SIPORTS WordPress Integration Package

Ce package contient tous les éléments nécessaires pour intégrer SIPORTS avec WordPress sur siportevent.com.

## 📁 Contenu du Package

```
siports-wordpress-package/
├── wordpress-plugin/          # Plugin WordPress complet
│   ├── siports-integration.php
│   └── build/                 # Assets JS/CSS
├── backend-extensions/        # Extensions FastAPI
│   ├── wordpress_config.py
│   ├── wordpress_extensions.py
│   └── wordpress_requirements.txt
├── configuration/             # Configuration
│   ├── env.template          # Template .env
│   └── configure.sh          # Script de configuration
├── scripts/                   # Scripts de déploiement
│   ├── deploy.sh            # Déploiement complet
│   └── install.sh           # Installation rapide
└── documentation/            # Documentation
    └── INSTALLATION_GUIDE.md # Guide détaillé

```

## 🚀 Installation Rapide

### Option 1: Installation automatique
```bash
sudo ./scripts/install.sh
```

### Option 2: Installation manuelle
1. Copiez `wordpress-plugin/` vers `/var/www/html/wp-content/plugins/siports-integration/`
2. Copiez `backend-extensions/*.py` vers `/app/backend/`
3. Installez les dépendances: `pip install -r backend-extensions/wordpress_requirements.txt`
4. Configurez avec `./configuration/configure.sh`
5. Activez le plugin dans WordPress admin

## 🔧 Configuration

### Base de données WordPress
Assurez-vous d'avoir:
- Host: localhost (ou votre host MySQL)
- Base: nom de votre base WordPress
- Utilisateur/mot de passe avec permissions

### Variables d'environnement
Copiez `configuration/env.template` vers `backend/.env` et remplissez:
```env
WP_DB_HOST=localhost
WP_DB_NAME=votre_base
WP_DB_USER=votre_user
WP_DB_PASSWORD=votre_password
```

## 📝 Utilisation

### Shortcodes WordPress

#### Dashboard Admin
```
[siports_app component="admin" height="800px"]
```

#### Packages Visiteur
```
[siports_app component="packages" height="600px"]
```

#### Système de Matching
```
[siports_app component="matching" height="700px"]
```

#### Application Complète
```
[siports_app component="main" height="900px"]
```

### Interface d'administration

Après activation, accédez à:
- **Configuration**: WordPress Admin → Réglages → SIPORTS Config
- **Synchronisation**: WordPress Admin → SIPORTS Sync

## 🔄 Synchronisation

L'intégration permet la synchronisation bidirectionnelle entre:
- Utilisateurs SIPORTS ↔ Utilisateurs WordPress  
- Packages SIPORTS ↔ Posts personnalisés WordPress
- Métadonnées et champs personnalisés

## 🛠️ Dépannage

### Plugin ne s'active pas
- Vérifiez les permissions fichiers (755/644)
- Consultez `/wp-content/debug.log`
- Vérifiez la syntaxe PHP

### Synchronisation échoue
- Vérifiez la configuration base de données
- Testez la connexion MySQL
- Consultez les logs backend

### Shortcodes ne fonctionnent pas
- Plugin activé ?
- Cache vidé ?
- Console navigateur pour erreurs JS

## 📞 Support

- Documentation complète: `documentation/INSTALLATION_GUIDE.md`
- Logs WordPress: `/wp-content/debug.log`
- Logs SIPORTS: `/app/logs/wordpress_integration.log`

## ✅ Checklist de Déploiement

- [ ] WordPress accessible et fonctionnel
- [ ] Plugin installé et activé
- [ ] Configuration base de données complétée
- [ ] Extensions backend installées
- [ ] Services SIPORTS redémarrés
- [ ] Tests shortcodes effectués
- [ ] Synchronisation testée

---

🎉 **Votre intégration SIPORTS WordPress est prête !**

Pour toute question ou problème, consultez la documentation détaillée ou les logs système.
EOF

echo -e "${GREEN}✅ Documentation créée${NC}"

# Créer l'archive finale
echo -e "${BLUE}📦 Création de l'archive de déploiement...${NC}"
cd "$CURRENT_DIR"
tar -czf "${PACKAGE_NAME}.tar.gz" -C "$PACKAGE_DIR" .

# Créer également un ZIP pour Windows
if command -v zip &> /dev/null; then
    cd "$PACKAGE_DIR"
    zip -r "../${PACKAGE_NAME}.zip" . -q
    cd "$CURRENT_DIR"
    echo -e "${GREEN}✅ Archive ZIP créée${NC}"
fi

# Nettoyage
rm -rf "$PACKAGE_DIR"

# Résumé
echo -e "\n${BLUE}📊 RÉSUMÉ DU PACKAGE${NC}"
echo "══════════════════════════════"
echo "📦 Package créé: ${PACKAGE_NAME}.tar.gz"
if [ -f "${PACKAGE_NAME}.zip" ]; then
    echo "📦 Archive ZIP: ${PACKAGE_NAME}.zip"
fi
echo "📍 Dossier: $(pwd)"

# Taille des fichiers
if [ -f "${PACKAGE_NAME}.tar.gz" ]; then
    TAR_SIZE=$(du -h "${PACKAGE_NAME}.tar.gz" | cut -f1)
    echo "📏 Taille TAR.GZ: $TAR_SIZE"
fi

if [ -f "${PACKAGE_NAME}.zip" ]; then
    ZIP_SIZE=$(du -h "${PACKAGE_NAME}.zip" | cut -f1)
    echo "📏 Taille ZIP: $ZIP_SIZE"
fi

echo -e "\n${BLUE}🚀 INSTRUCTIONS DE DÉPLOIEMENT${NC}"
echo "═════════════════════════════════"
echo "1. Transférez l'archive sur votre serveur siportevent.com"
echo "2. Extrayez: tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "3. Exécutez: sudo ./scripts/install.sh"
echo "4. Configurez avec ./configuration/configure.sh"
echo "5. Testez l'intégration dans WordPress admin"

echo -e "\n${YELLOW}📋 CONTENU DU PACKAGE:${NC}"
echo "• Plugin WordPress complet avec shortcodes"
echo "• Extensions FastAPI pour synchronisation"  
echo "• Scripts d'installation automatique"
echo "• Configuration et documentation"
echo "• Fichiers CSS/JS optimisés"

echo -e "\n${GREEN}🎉 PACKAGE CRÉÉ AVEC SUCCÈS !${NC}"
echo -e "Prêt pour déploiement sur ${YELLOW}siportevent.com${NC}"

echo -e "\n${BLUE}💡 ASTUCE:${NC}"
echo "Gardez ce package comme sauvegarde et versioning de votre intégration SIPORTS."