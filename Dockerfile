# 🚀 DOCKERFILE OPTIMISÉ - Version corrigée avec multi-stage build amélioré

# Étape de build
FROM node:20-alpine AS build
WORKDIR /app

# Optimisation des couches Docker - copier d'abord les fichiers de dépendances
COPY package.json yarn.lock ./

# Nettoyer et installer les dépendances
RUN rm -f package-lock.json && \
    yarn install --frozen-lockfile --network-timeout 300000 --production=false

# Vérification de l'installation des dépendances critiques
RUN ls node_modules/@vitejs/plugin-react/package.json && echo "✅ @vitejs/plugin-react installé"

# Copier le code source
COPY . .

# Build de production
ENV NODE_ENV=production
RUN yarn build

# Vérification du build
RUN ls -la dist/index.html && echo "✅ Build réussi"

# Étape de runtime avec Nginx optimisé
FROM nginx:alpine

# Installer gettext pour envsubst
RUN apk add --no-cache gettext

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx optimisée
COPY nginx.conf.template.fixed /etc/nginx/templates/default.conf.template

# Créer un script d'entrée pour une meilleure gestion
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-3000}' >> /docker-entrypoint.sh && \
    echo 'envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -t' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Exposer le port
EXPOSE 3000

# Utiliser le script d'entrée
CMD ["/docker-entrypoint.sh"]

