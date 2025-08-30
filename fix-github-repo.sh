#!/bin/bash
# 🚀 Script de nettoyage pour repo GitHub - SIPORTS

echo "🧹 NETTOYAGE REPO GITHUB POUR VERCEL..."

# Supprimer tous les package-lock.json conflictuels
echo "❌ Suppression des package-lock.json..."
find . -name "package-lock.json" -delete

# Régénérer le yarn.lock principal
echo "🔄 Régénération du yarn.lock principal..."
if [ -f "package.json" ]; then
    rm -f yarn.lock
    yarn install
    echo "✅ yarn.lock principal créé"
fi

# Créer .gitignore pour éviter les futurs conflits
echo "📝 Mise à jour .gitignore..."
cat >> .gitignore << 'EOF'

# Éviter les conflits package managers
package-lock.json
**/package-lock.json

# Node modules
node_modules/
**/node_modules/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
EOF

echo ""
echo "🚀 INSTRUCTIONS POUR GITHUB:"
echo "1. git add ."
echo "2. git commit -m 'Fix: Remove package-lock conflicts for Vercel'"
echo "3. git push origin main"
echo ""
echo "✅ Après ça, Vercel fonctionnera parfaitement !"