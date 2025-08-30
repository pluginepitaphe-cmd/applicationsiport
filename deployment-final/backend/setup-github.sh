#!/bin/bash
echo "🐙 Configuration GitHub pour Railway"
echo "===================================="

# Initialiser git si pas fait
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialisé"
else
    echo "✅ Git déjà initialisé"
fi

# Ajouter tous les fichiers
git add .
git commit -m "SIPORTS Backend v2.0 - Ready for Railway deployment"

echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo "1. Créer un repo GitHub : siports-backend-v2"
echo "2. Exécuter :"
echo "   git remote add origin https://github.com/YOUR-USERNAME/siports-backend-v2.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo "3. Sur Railway : Deploy from GitHub repo"
