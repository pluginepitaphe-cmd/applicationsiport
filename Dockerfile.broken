# 🚀 NOUVEAU DOCKERFILE SIPORTS - BUILD GARANTI
FROM node:20-alpine

WORKDIR /app

# Variables pour build complet (development pour installer devDeps)
ENV NODE_ENV=development
ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache

# Supprimer conflits package-lock.json  
RUN rm -rf /tmp/.yarn-cache

# Copier package.json ET yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Installation COMPLÈTE avec devDependencies
RUN rm -f package-lock.json && \
    yarn install --network-timeout 300000

# Vérifier que les packages sont installés
RUN ls -la node_modules/@vitejs/ || echo "ERREUR: @vitejs manquant"
RUN yarn list --depth=0 | grep vitejs || echo "ERREUR: vitejs pas trouvé"

# Copier le code source
COPY . .

# Build avec NODE_ENV=production pour optimisation
ENV NODE_ENV=production
RUN yarn build

# Vérifier que le build a créé dist/
RUN ls -la dist/ || echo "ERREUR: dist/ manquant"

# Stage de production
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=0 /app/dist /usr/share/nginx/html

# Configuration nginx pour SPA React
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]