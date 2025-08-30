# Projet Espoir (SIPORTS) - Corrections et Optimisations

Ce dossier contient le projet Espoir (SIPORTS) avec les corrections et optimisations suivantes :

## 1. Correction de l'erreur "Exposant non trouvé"

**Problème :** Les mini-sites des exposants affichaient "Exposant non trouvé" en raison d'une incohérence entre les IDs numériques utilisés dans le répertoire des exposants (`ExhibitorDirectory.jsx`) et les slugs alphanumériques attendus par les mini-sites (`ExhibitorMiniSite.jsx`).

**Correction :** Les IDs des exposants dans `ExhibitorDirectory.jsx` ont été mis à jour pour correspondre aux slugs alphanumériques. Cela assure que le lien généré correspond à la clé de l'exposant dans les données du mini-site.

## 2. Optimisations Docker et Nginx

Plusieurs optimisations ont été apportées pour améliorer le processus de build Docker et la configuration Nginx :

- **`Dockerfile.optimized` (renommé en `Dockerfile`)** : Version améliorée du Dockerfile avec un multi-stage build optimisé pour réduire la taille de l'image finale et améliorer les performances de build.
- **`nginx.conf.template.fixed` (renommé en `nginx.conf.template`)** : Configuration Nginx améliorée pour mieux gérer les applications Single Page Application (SPA) comme React, avec des règles de mise en cache des assets et des en-têtes de sécurité renforcés.
- **`package.json.fixed` (renommé en `package.json`)** : Ajout de scripts utilitaires pour faciliter le développement et le déploiement, ainsi que des contraintes de version pour Node.js et Yarn.

## 3. Fichiers Clés Modifiés

- `src/pages/ExhibitorDirectory.jsx`
- `Dockerfile` (anciennement `Dockerfile.optimized`)
- `nginx.conf.template` (anciennement `nginx.conf.template.fixed`)
- `package.json` (anciennement `package.json.fixed`)

## Comment utiliser cette version corrigée

1. **Dézipper l'archive** : Extrayez le contenu de cette archive.
2. **Installer les dépendances** : Naviguez vers le répertoire `Espoir-main` et exécutez `yarn install`.
3. **Construire l'application** : Exécutez `yarn build`.
4. **Lancer l'application (localement)** : Pour tester localement avec un serveur HTTP qui gère le routage SPA, vous pouvez utiliser `serve` (installez-le globalement avec `npm install -g serve`) puis exécutez `serve -s dist -l 3000` depuis le répertoire `Espoir-main`.
5. **Construire et lancer avec Docker** : Si Docker est disponible, vous pouvez construire l'image avec `docker build -t espoir-frontend .` et la lancer.

N'hésitez pas à me contacter si vous avez d'autres questions ou rencontrez des problèmes.

