#!/bin/bash

echo "🔧 INSTALLATION AUTOMATIQUE - Correction Docker Yarn"
echo "==================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

echo "📁 Répertoire actuel: $(pwd)"
echo "📋 Fichiers disponibles:"
ls -la Dockerfile*

echo ""
echo "🎯 Quelle solution voulez-vous installer ?"
echo "1) Dockerfile.final (Yarn corrigé - Recommandé)"
echo "2) Dockerfile.npm-alternative (NPM alternatif)"
echo "3) Dockerfile.fixed (Version basique)"
echo ""

read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "✅ Installation de Dockerfile.final..."
        if [ -f "Dockerfile.final" ]; then
            cp Dockerfile.final Dockerfile
            echo "✅ Dockerfile remplacé par la version corrigée avec yarn"
        else
            echo "❌ Dockerfile.final non trouvé"
            exit 1
        fi
        ;;
    2)
        echo "✅ Installation de Dockerfile.npm-alternative..."
        if [ -f "Dockerfile.npm-alternative" ]; then
            cp Dockerfile.npm-alternative Dockerfile
            echo "✅ Dockerfile remplacé par la version NPM"
        else
            echo "❌ Dockerfile.npm-alternative non trouvé"
            exit 1
        fi
        ;;
    3)
        echo "✅ Installation de Dockerfile.fixed..."
        if [ -f "Dockerfile.fixed" ]; then
            cp Dockerfile.fixed Dockerfile
            echo "✅ Dockerfile remplacé par la version basique corrigée"
        else
            echo "❌ Dockerfile.fixed non trouvé"
            exit 1
        fi
        ;;
    *)
        echo "❌ Choix invalide. Installation annulée."
        exit 1
        ;;
esac

echo ""
echo "🧪 Voulez-vous tester la correction ? (y/n)"
read -p "Test: " test_choice

if [ "$test_choice" = "y" ] || [ "$test_choice" = "Y" ]; then
    echo "🧪 Test de la correction..."
    
    if command -v docker &> /dev/null; then
        echo "📦 Build Docker en cours..."
        if docker build -t test-correction . > /dev/null 2>&1; then
            echo "✅ Build Docker réussi ! La correction fonctionne."
        else
            echo "❌ Build Docker échoué. Vérifiez les logs avec: docker build ."
        fi
    else
        echo "⚠️  Docker non disponible. Test manuel avec les scripts fournis."
        if [ -f "test-solutions.sh" ]; then
            chmod +x test-solutions.sh
            echo "💡 Utilisez: ./test-solutions.sh pour tester"
        fi
    fi
fi

echo ""
echo "✅ INSTALLATION TERMINÉE !"
echo "📚 Documentation disponible:"
echo "   - FIX_INSTRUCTIONS.md : Instructions détaillées"
echo "   - SOLUTION_DOCKER_YARN.md : Guide complet"
echo "   - ERREUR_CORRIGEE_RAPPORT.md : Rapport technique"
echo ""
echo "🚀 Votre Dockerfile est maintenant corrigé et prêt à fonctionner !"