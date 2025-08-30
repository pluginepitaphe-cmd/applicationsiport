#!/bin/bash
# 🔍 Diagnostic complet du backend SIPORTS - Détection d'erreurs Railway

echo "🔍 DIAGNOSTIC BACKEND SIPORTS v2.0"
echo "=================================="
echo ""

cd deployment-final/backend

# 1. Vérification des fichiers essentiels
echo "📁 1. FICHIERS ESSENTIELS :"
echo "=========================="
files=("server.py" "requirements.txt" "Procfile" "chatbot_service.py")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "✅ $file ($size lignes)"
    else
        echo "❌ $file MANQUANT"
    fi
done
echo ""

# 2. Vérification requirements.txt
echo "📦 2. DÉPENDANCES :"
echo "=================="
echo "Requirements.txt contient :"
cat requirements.txt | while read line; do
    echo "   • $line"
done
echo ""

# 3. Test des imports critiques
echo "🧪 3. TEST IMPORTS PYTHON :"
echo "=========================="

# Test FastAPI
if python3 -c "import fastapi; print('FastAPI version:', fastapi.__version__)" 2>/dev/null; then
    echo "✅ FastAPI disponible"
else
    echo "❌ FastAPI manquant ou défaillant"
fi

# Test Uvicorn
if python3 -c "import uvicorn; print('Uvicorn disponible')" 2>/dev/null; then
    echo "✅ Uvicorn disponible"
else
    echo "❌ Uvicorn manquant"
fi

# Test JWT
if python3 -c "import jwt; print('JWT disponible')" 2>/dev/null; then
    echo "✅ JWT disponible"
else
    echo "❌ JWT manquant"
fi

# Test Werkzeug
if python3 -c "from werkzeug.security import generate_password_hash; print('Werkzeug disponible')" 2>/dev/null; then
    echo "✅ Werkzeug disponible"
else
    echo "❌ Werkzeug manquant - ERREUR CRITIQUE"
fi

# Test python-jose
if python3 -c "from jose import jwt; print('Python-jose disponible')" 2>/dev/null; then
    echo "✅ Python-jose disponible"
else
    echo "❌ Python-jose manquant - ERREUR CRITIQUE"
fi

echo ""

# 4. Test du serveur
echo "🚀 4. TEST SERVEUR :"
echo "==================="
if python3 -c "
import sys
sys.path.append('.')
try:
    from server import app
    print('✅ Serveur FastAPI créé avec succès')
    print('✅ Routes définies:', len(app.routes))
except Exception as e:
    print('❌ Erreur serveur:', str(e))
" 2>/dev/null; then
    echo "✅ Code serveur valide"
else
    echo "❌ Erreur dans le code serveur"
fi
echo ""

# 5. Vérification Procfile
echo "⚙️  5. CONFIGURATION DÉPLOIEMENT :"
echo "================================="
echo "Procfile :"
cat Procfile
echo ""

# Vérifier le port dans server.py
port_line=$(grep -n "PORT" server.py | tail -1)
echo "Configuration port : $port_line"
echo ""

# 6. Structure base de données
echo "🗄️  6. BASE DE DONNÉES :"
echo "======================"
if [ -f "instance/siports_production.db" ]; then
    size=$(ls -lh instance/siports_production.db | awk '{print $5}')
    echo "✅ Base de données : instance/siports_production.db ($size)"
else
    echo "⚠️  Base de données sera créée au premier démarrage"
fi
echo ""

# 7. Test chatbot service
echo "🤖 7. CHATBOT SERVICE :"
echo "======================"
if python3 -c "
try:
    from chatbot_service import siports_ai_service, ChatRequest, ChatResponse
    print('✅ Chatbot service importé')
    print('✅ Classes définies')
except Exception as e:
    print('❌ Erreur chatbot:', str(e))
" 2>/dev/null; then
    echo "✅ Chatbot service OK"
else
    echo "❌ Problème chatbot service"
fi
echo ""

# 8. Résumé des erreurs
echo "📋 8. RÉSUMÉ DIAGNOSTIC :"
echo "========================"

# Compter les erreurs potentielles
error_count=0

# Vérifier chaque élément critique
if ! python3 -c "from werkzeug.security import generate_password_hash" 2>/dev/null; then
    echo "❌ ERREUR CRITIQUE: Werkzeug manquant"
    error_count=$((error_count + 1))
fi

if ! python3 -c "from jose import jwt" 2>/dev/null; then
    echo "❌ ERREUR CRITIQUE: Python-jose manquant"  
    error_count=$((error_count + 1))
fi

if ! python3 -c "import fastapi, uvicorn" 2>/dev/null; then
    echo "❌ ERREUR CRITIQUE: FastAPI/Uvicorn manquant"
    error_count=$((error_count + 1))
fi

if [ $error_count -eq 0 ]; then
    echo "✅ AUCUNE ERREUR CRITIQUE DÉTECTÉE"
    echo "🎊 Code prêt pour Railway deployment"
else
    echo "❌ $error_count ERREUR(S) CRITIQUE(S) DÉTECTÉE(S)"
    echo "🔧 Corrections nécessaires avant déploiement"
fi

echo ""
echo "💡 SOLUTION SI ERREURS :"
echo "• Utiliser requirements.txt corrigé"
echo "• Vérifier imports python-jose vs pyjwt"
echo "• Ajouter werkzeug aux dépendances"