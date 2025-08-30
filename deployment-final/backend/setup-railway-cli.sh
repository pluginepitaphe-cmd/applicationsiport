#!/bin/bash
echo "🚂 Configuration Railway CLI"
echo "============================"

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "📦 Installation Railway CLI..."
    curl -fsSL https://railway.app/install.sh | sh
    echo "✅ Railway CLI installé"
else
    echo "✅ Railway CLI déjà installé"
fi

echo ""
echo "🔐 Connexion Railway..."
railway login

echo ""
echo "🔗 Liaison du projet..."
echo "💡 Créez d'abord un Empty Project sur railway.app"
echo "💡 Puis exécutez : railway link"
echo "💡 Et enfin : railway deploy"
