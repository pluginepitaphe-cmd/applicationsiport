# 🚀 DOCKERFILE SIPORTS - ANTI --frozen-lockfile GARANTI
FROM node:20-alpine

WORKDIR /app

# Installer bash pour les scripts
RUN apk add --no-cache bash

# Variables d'environnement
ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache

# Copier la config yarn AVANT package.json
COPY .yarnrc.yml ./
COPY .yarnrc ./

# Script de nettoyage et installation sécurisée
RUN echo '#!/bin/bash\nrm -f package-lock.json\nyarn install --network-timeout 300000 --ignore-engines --production=false' > /install.sh && chmod +x /install.sh

# Copier package.json
COPY package.json ./

# Installation ultra-sécurisée avec fallback (INCLUT devDependencies)
RUN /install.sh || (rm -f yarn.lock && yarn install --network-timeout 300000 --production=false)

# Copier le code source
COPY . .

# Build optimisé  
RUN yarn build

# Stage de production
FROM nginx:alpine

COPY --from=0 /app/dist /usr/share/nginx/html

# Configuration nginx pour SPA
RUN echo 'server { listen 3000; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]