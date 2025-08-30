#!/bin/bash

echo "🚀 Script de déploiement SiportApplication"
echo "========================================="

# Extraire les modifications
echo "📦 Extraction des modifications..."
tar -xzf siportapplication_modifications.tar.gz

# Vérifier les fichiers extraits
echo "✅ Fichiers extraits :"
tar -tzf siportapplication_modifications.tar.gz

echo ""
echo "🔧 Commandes Git à exécuter :"
echo "==============================="
echo "git add ."
echo "git commit -m 'Migrate to PostgreSQL and add Railway/Vercel configs'"
echo "git push origin main"

echo ""
echo "🌐 Configuration Railway :"
echo "=========================="
echo "1. Aller sur https://railway.app"
echo "2. Connecter le repository siportapplication"
echo "3. Ajouter service PostgreSQL"
echo "4. Variables d'environnement :"
echo "   - DATABASE_URL (auto-généré)"
echo "   - CORS_ORIGINS=*"
echo "5. Générer domaine public : Settings → Networking → Generate Domain"

echo ""
echo "📱 Configuration Vercel (optionnel) :"
echo "====================================="
echo "1. cd frontend"
echo "2. vercel --prod"
echo "3. Variables d'environnement :"
echo "   - REACT_APP_BACKEND_URL=https://your-railway-app.up.railway.app"

echo ""
echo "✅ Déploiement terminé !"