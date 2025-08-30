#!/bin/bash
# Script d'installation personnalisé pour éviter --frozen-lockfile

echo "🚀 Installation SIPORTS sans frozen-lockfile..."

# Supprimer les conflits
rm -f package-lock.json

# Installation avec timeout étendu (devDependencies inclus automatiquement)
yarn install --network-timeout 300000 --ignore-engines

echo "✅ Installation terminée avec succès!"