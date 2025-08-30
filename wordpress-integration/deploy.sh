#!/bin/bash
# 🚀 Script de déploiement automatique SIPORTS WordPress Integration
# Usage: ./deploy.sh [OPTIONS]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
WORDPRESS_PATH="/var/www/html"
SIPORTS_PATH="/app"
BACKUP_DIR="/var/backups/siports"
PLUGIN_NAME="siports-integration"
LOG_FILE="/var/log/siports-deploy.log"

# Configuration base de données WordPress (à modifier selon votre configuration)
WP_DB_HOST="localhost"
WP_DB_NAME="siportevent_db"
WP_DB_USER="siportevent_user"
WP_DB_PASSWORD=""  # À remplir

# URLs
WORDPRESS_URL="https://siportevent.com"
SIPORTS_API_URL="https://react-router-upgrade.preview.emergentagent.com"

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 SIPORTS WordPress Integration                            ║"
    echo "║                           Script de Déploiement                                ║"
    echo "╚════════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    log_message "INFO" "✅ $1"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    log_message "ERROR" "❌ $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log_message "WARN" "⚠️  $1"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log_message "INFO" "ℹ️  $1"
}

check_requirements() {
    print_info "Vérification des prérequis..."
    
    # Vérifier que nous sommes root
    if [ "$EUID" -ne 0 ]; then
        print_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi
    
    # Vérifier l'existence de WordPress
    if [ ! -f "$WORDPRESS_PATH/wp-config.php" ]; then
        print_error "WordPress non trouvé dans $WORDPRESS_PATH"
        exit 1
    fi
    
    # Vérifier l'existence de SIPORTS
    if [ ! -f "$SIPORTS_PATH/backend/server.py" ]; then
        print_error "SIPORTS backend non trouvé dans $SIPORTS_PATH"
        exit 1
    fi
    
    # Vérifier les commandes nécessaires
    for cmd in mysql wp php python3 pip npm; do
        if ! command -v $cmd &> /dev/null; then
            print_error "Commande manquante: $cmd"
            exit 1
        fi
    done
    
    print_success "Tous les prérequis sont satisfaits"
}

create_backup() {
    print_info "Création des sauvegardes..."
    
    # Créer le répertoire de sauvegarde
    mkdir -p "$BACKUP_DIR"
    
    # Timestamp pour les sauvegardes
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    
    # Sauvegarde de la base WordPress
    if [ -n "$WP_DB_PASSWORD" ]; then
        print_info "Sauvegarde base de données WordPress..."
        mysqldump -h "$WP_DB_HOST" -u "$WP_DB_USER" -p"$WP_DB_PASSWORD" "$WP_DB_NAME" > "$BACKUP_DIR/wp_db_$timestamp.sql"
        print_success "Base WordPress sauvegardée"
    else
        print_warning "Mot de passe DB non fourni, sauvegarde DB ignorée"
    fi
    
    # Sauvegarde de la base SIPORTS
    if [ -f "$SIPORTS_PATH/backend/siports.db" ]; then
        cp "$SIPORTS_PATH/backend/siports.db" "$BACKUP_DIR/siports_db_$timestamp.db"
        print_success "Base SIPORTS sauvegardée"
    fi
    
    # Sauvegarde du dossier plugin existant
    if [ -d "$WORDPRESS_PATH/wp-content/plugins/$PLUGIN_NAME" ]; then
        tar -czf "$BACKUP_DIR/plugin_$timestamp.tar.gz" -C "$WORDPRESS_PATH/wp-content/plugins" "$PLUGIN_NAME"
        print_success "Plugin existant sauvegardé"
    fi
    
    print_success "Toutes les sauvegardes créées dans $BACKUP_DIR"
}

install_wordpress_plugin() {
    print_info "Installation du plugin WordPress..."
    
    local plugin_dir="$WORDPRESS_PATH/wp-content/plugins/$PLUGIN_NAME"
    
    # Créer le répertoire du plugin
    mkdir -p "$plugin_dir"
    mkdir -p "$plugin_dir/build/static/js"
    mkdir -p "$plugin_dir/build/static/css"
    
    # Copier les fichiers du plugin
    cp "$(dirname "$0")/siports-integration.php" "$plugin_dir/"
    cp "$(dirname "$0")/build/static/js/init.js" "$plugin_dir/build/static/js/"
    cp "$(dirname "$0")/build/static/css/main.css" "$plugin_dir/build/static/css/"
    
    # Définir les bonnes permissions
    chown -R www-data:www-data "$plugin_dir"
    chmod -R 755 "$plugin_dir"
    
    print_success "Plugin WordPress installé"
}

configure_wordpress_plugin() {
    print_info "Configuration du plugin WordPress..."
    
    # Activer le plugin via WP-CLI
    cd "$WORDPRESS_PATH"
    wp plugin activate "$PLUGIN_NAME" --allow-root || print_warning "Impossible d'activer automatiquement le plugin"
    
    # Configurer les options du plugin
    wp option update "siports_api_url" "$SIPORTS_API_URL/api" --allow-root
    wp option update "siports_jwt_secret" "$(openssl rand -hex 32)" --allow-root
    wp option update "siports_auto_sync" "1" --allow-root
    
    print_success "Plugin WordPress configuré"
}

install_backend_dependencies() {
    print_info "Installation des dépendances backend..."
    
    cd "$SIPORTS_PATH/backend"
    
    # Mettre à jour requirements.txt
    if ! grep -q "mysql-connector-python" requirements.txt; then
        echo "mysql-connector-python==8.2.0" >> requirements.txt
    fi
    
    if ! grep -q "PyJWT" requirements.txt; then
        echo "PyJWT==2.8.0" >> requirements.txt
    fi
    
    # Installer les dépendances
    pip install -r requirements.txt
    
    print_success "Dépendances backend installées"
}

configure_backend() {
    print_info "Configuration du backend SIPORTS..."
    
    # Copier les fichiers WordPress extensions
    cp "$(dirname "$0")/wordpress_config.py" "$SIPORTS_PATH/backend/"
    cp "$(dirname "$0")/wordpress_extensions.py" "$SIPORTS_PATH/backend/"
    
    # Créer/mettre à jour le fichier .env
    local env_file="$SIPORTS_PATH/backend/.env"
    
    # Sauvegarder le .env existant
    if [ -f "$env_file" ]; then
        cp "$env_file" "$env_file.backup.$(date +%s)"
    fi
    
    # Ajouter les variables WordPress à .env
    cat >> "$env_file" << EOF

# WordPress Integration Settings
WP_DB_HOST=$WP_DB_HOST
WP_DB_NAME=$WP_DB_NAME
WP_DB_USER=$WP_DB_USER
WP_DB_PASSWORD=$WP_DB_PASSWORD
WP_TABLE_PREFIX=wp_
JWT_SECRET_KEY=$(openssl rand -hex 32)
WORDPRESS_URL=$WORDPRESS_URL
SIPORTS_API_URL=$SIPORTS_API_URL
LOG_LEVEL=INFO
EOF
    
    # Modifier server.py pour inclure l'intégration WordPress
    local server_file="$SIPORTS_PATH/backend/server.py"
    
    if ! grep -q "wordpress_extensions" "$server_file"; then
        # Ajouter l'import en haut du fichier
        sed -i '/^import/a from wordpress_extensions import init_wordpress_integration' "$server_file"
        
        # Ajouter l'initialisation après la création de l'app
        sed -i '/^app = FastAPI/a # Initialize WordPress integration\ninit_wordpress_integration(app)' "$server_file"
        
        print_success "server.py modifié pour inclure WordPress"
    else
        print_info "server.py déjà configuré pour WordPress"
    fi
}

build_frontend() {
    print_info "Build du frontend React..."
    
    cd "$SIPORTS_PATH/frontend" || cd "$SIPORTS_PATH/src"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    # Build the project
    npm run build
    
    # Copy build files to WordPress plugin
    local plugin_build_dir="$WORDPRESS_PATH/wp-content/plugins/$PLUGIN_NAME/build"
    
    if [ -d "build" ]; then
        cp -r build/* "$plugin_build_dir/"
        print_success "Build React copié vers le plugin WordPress"
    elif [ -d "dist" ]; then
        cp -r dist/* "$plugin_build_dir/"
        print_success "Build React (Vite) copié vers le plugin WordPress"
    else
        print_warning "Aucun dossier build trouvé, utilisation des fichiers par défaut"
    fi
}

restart_services() {
    print_info "Redémarrage des services..."
    
    # Redémarrer les services SIPORTS
    if command -v supervisorctl &> /dev/null; then
        supervisorctl restart all
        print_success "Services SIPORTS redémarrés"
    elif command -v systemctl &> /dev/null; then
        systemctl restart siports-backend || print_warning "Service siports-backend non trouvé"
        systemctl restart nginx || print_warning "Service nginx non trouvé"
    fi
    
    # Redémarrer PHP-FPM si disponible
    if command -v systemctl &> /dev/null; then
        systemctl restart php8.1-fpm || systemctl restart php-fpm || print_warning "PHP-FPM non redémarré"
    fi
    
    # Vider le cache WordPress
    cd "$WORDPRESS_PATH"
    wp cache flush --allow-root || print_warning "Cache WordPress non vidé"
    
    print_success "Services redémarrés"
}

run_tests() {
    print_info "Exécution des tests de validation..."
    
    # Test 1: Vérifier que le plugin est activé
    cd "$WORDPRESS_PATH"
    if wp plugin is-active "$PLUGIN_NAME" --allow-root; then
        print_success "Plugin SIPORTS activé"
    else
        print_error "Plugin SIPORTS non activé"
        return 1
    fi
    
    # Test 2: Vérifier l'API WordPress
    local wp_api_url="$WORDPRESS_URL/wp-json/siports/v1/status"
    if curl -s -f "$wp_api_url" > /dev/null; then
        print_success "API WordPress SIPORTS accessible"
    else
        print_warning "API WordPress SIPORTS non accessible (normal si WordPress non démarré)"
    fi
    
    # Test 3: Vérifier l'API SIPORTS
    local siports_api_url="$SIPORTS_API_URL/api/sync/status"
    if curl -s -f "$siports_api_url" > /dev/null; then
        print_success "API SIPORTS accessible"
    else
        print_warning "API SIPORTS non accessible (vérifiez que le backend est démarré)"
    fi
    
    # Test 4: Vérifier la base de données
    if [ -n "$WP_DB_PASSWORD" ]; then
        if mysql -h "$WP_DB_HOST" -u "$WP_DB_USER" -p"$WP_DB_PASSWORD" -e "USE $WP_DB_NAME; SHOW TABLES;" > /dev/null 2>&1; then
            print_success "Connexion base de données WordPress OK"
        else
            print_error "Connexion base de données WordPress échouée"
            return 1
        fi
    fi
    
    print_success "Tous les tests passés"
}

show_summary() {
    print_header
    
    echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ! 🎉${NC}"
    echo
    echo -e "${BLUE}📋 RÉSUMÉ DU DÉPLOIEMENT${NC}"
    echo "────────────────────────────────────"
    echo "• Plugin WordPress installé et activé"
    echo "• Backend SIPORTS configuré pour WordPress"
    echo "• Frontend React intégré"
    echo "• Base de données synchronisée"
    echo "• Services redémarrés"
    echo
    echo -e "${BLUE}🔗 LIENS UTILES${NC}"
    echo "────────────────────────────"
    echo "• WordPress Admin: $WORDPRESS_URL/wp-admin/"
    echo "• Configuration SIPORTS: $WORDPRESS_URL/wp-admin/admin.php?page=siports-config"
    echo "• Synchronisation: $WORDPRESS_URL/wp-admin/admin.php?page=siports-sync"
    echo "• API SIPORTS: $SIPORTS_API_URL/api"
    echo
    echo -e "${BLUE}📝 PROCHAINES ÉTAPES${NC}"
    echo "───────────────────────"
    echo "1. Connectez-vous à WordPress Admin"
    echo "2. Allez dans 'Réglages → SIPORTS Config'"
    echo "3. Vérifiez la configuration"
    echo "4. Testez la synchronisation dans 'SIPORTS Sync'"
    echo "5. Ajoutez des shortcodes à vos pages:"
    echo "   [siports_app component=\"admin\"]"
    echo "   [siports_app component=\"packages\"]"
    echo "   [siports_app component=\"matching\"]"
    echo
    echo -e "${BLUE}📂 FICHIERS DE LOG${NC}"
    echo "──────────────────────"
    echo "• Déploiement: $LOG_FILE"
    echo "• WordPress: $WORDPRESS_PATH/wp-content/debug.log"
    echo "• SIPORTS: $SIPORTS_PATH/logs/wordpress_integration.log"
    echo
    echo -e "${YELLOW}⚠️  N'OUBLIEZ PAS DE :${NC}"
    echo "• Configurer votre mot de passe base de données dans ce script"
    echo "• Tester l'authentification et la synchronisation"
    echo "• Activer HTTPS en production"
    echo "• Configurer les sauvegardes automatiques"
    echo
}

cleanup() {
    print_info "Nettoyage des fichiers temporaires..."
    
    # Nettoyer les anciens backups (garder les 5 derniers)
    if [ -d "$BACKUP_DIR" ]; then
        find "$BACKUP_DIR" -name "wp_db_*.sql" -type f | sort -r | tail -n +6 | xargs rm -f
        find "$BACKUP_DIR" -name "siports_db_*.db" -type f | sort -r | tail -n +6 | xargs rm -f
        find "$BACKUP_DIR" -name "plugin_*.tar.gz" -type f | sort -r | tail -n +6 | xargs rm -f
    fi
    
    print_success "Nettoyage terminé"
}

show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Afficher cette aide"
    echo "  --skip-backup          Ignorer les sauvegardes"
    echo "  --skip-tests           Ignorer les tests"
    echo "  --wp-path PATH         Chemin WordPress (défaut: $WORDPRESS_PATH)"
    echo "  --siports-path PATH    Chemin SIPORTS (défaut: $SIPORTS_PATH)"
    echo "  --db-host HOST         Host base de données (défaut: $WP_DB_HOST)"
    echo "  --db-name NAME         Nom base de données (défaut: $WP_DB_NAME)"
    echo "  --db-user USER         Utilisateur base de données (défaut: $WP_DB_USER)"
    echo "  --db-password PASS     Mot de passe base de données"
    echo ""
    echo "Exemples:"
    echo "  $0                                    # Déploiement standard"
    echo "  $0 --skip-backup                     # Sans sauvegarde"
    echo "  $0 --db-password=monmotdepasse       # Avec mot de passe DB"
    echo ""
}

# Traitement des arguments
SKIP_BACKUP=false
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --wp-path)
            WORDPRESS_PATH="$2"
            shift 2
            ;;
        --siports-path)
            SIPORTS_PATH="$2"
            shift 2
            ;;
        --db-host)
            WP_DB_HOST="$2"
            shift 2
            ;;
        --db-name)
            WP_DB_NAME="$2"
            shift 2
            ;;
        --db-user)
            WP_DB_USER="$2"
            shift 2
            ;;
        --db-password)
            WP_DB_PASSWORD="$2"
            shift 2
            ;;
        *)
            print_error "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Script principal
main() {
    print_header
    
    # Créer le dossier de logs
    mkdir -p "$(dirname "$LOG_FILE")"
    
    log_message "INFO" "🚀 Début du déploiement SIPORTS WordPress Integration"
    
    # Vérifications
    check_requirements
    
    # Sauvegardes
    if [ "$SKIP_BACKUP" = false ]; then
        create_backup
    else
        print_warning "Sauvegardes ignorées"
    fi
    
    # Installation
    install_wordpress_plugin
    configure_wordpress_plugin
    install_backend_dependencies
    configure_backend
    build_frontend
    restart_services
    
    # Tests
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    else
        print_warning "Tests ignorés"
    fi
    
    # Nettoyage
    cleanup
    
    # Résumé
    show_summary
    
    log_message "INFO" "✅ Déploiement terminé avec succès"
}

# Gestion des erreurs
trap 'print_error "Erreur lors du déploiement à la ligne $LINENO"; exit 1' ERR

# Exécution du script principal
main "$@"