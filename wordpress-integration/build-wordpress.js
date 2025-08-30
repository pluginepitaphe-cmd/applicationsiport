#!/usr/bin/env node
/**
 * Script de build spécialisé pour WordPress
 * Crée les fichiers JS et CSS optimisés pour l'intégration WordPress
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Building SIPORTS WordPress Integration...');

// Créer la structure de dossiers
const buildDir = path.join(__dirname, 'build', 'static');
const jsDir = path.join(buildDir, 'js');
const cssDir = path.join(buildDir, 'css');

// Créer les dossiers s'ils n'existent pas
[buildDir, jsDir, cssDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copier le fichier d'initialisation JavaScript
const initJsSource = path.join(__dirname, 'build', 'static', 'js', 'init.js');
const initJsTarget = path.join(jsDir, 'main.js');

if (fs.existsSync(initJsSource)) {
  fs.copyFileSync(initJsSource, initJsTarget);
  console.log('✅ JavaScript file copied: main.js');
} else {
  console.log('⚠️  JavaScript init file not found, using default');
  
  // Créer un fichier main.js de base
  const defaultMainJs = `
// SIPORTS WordPress Integration - Main JS
console.log('SIPORTS WordPress Integration loaded');

// Configuration par défaut
window.siportsWordPressIntegration = {
  version: '1.0.0',
  loaded: new Date().toISOString()
};

// Charger le script d'initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('SIPORTS DOM Ready');
  });
} else {
  console.log('SIPORTS Already Ready');
}
`;
  
  fs.writeFileSync(initJsTarget, defaultMainJs);
  console.log('✅ Default JavaScript file created: main.js');
}

// Copier le fichier CSS
const cssSource = path.join(__dirname, 'build', 'static', 'css', 'main.css');
const cssTarget = path.join(cssDir, 'main.css');

if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssTarget);
  console.log('✅ CSS file copied: main.css');
} else {
  console.log('⚠️  CSS file not found, using default');
  
  // Créer un fichier CSS de base
  const defaultCss = `
/* SIPORTS WordPress Integration - Main CSS */
.siports-wordpress-integration {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.siports-react-container {
  min-height: 400px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.siports-loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}
`;
  
  fs.writeFileSync(cssTarget, defaultCss);
  console.log('✅ Default CSS file created: main.css');
}

// Créer le fichier manifest pour WordPress
const manifest = {
  name: 'SIPORTS WordPress Integration',
  version: '1.0.0',
  description: 'Integration React SIPORTS avec WordPress',
  files: {
    'js/main.js': 'Main JavaScript file for SIPORTS integration',
    'css/main.css': 'Main CSS file for SIPORTS styling'
  },
  wordpress: {
    plugin: 'siports-integration',
    requires: '5.8',
    tested: '6.4'
  },
  build: {
    timestamp: new Date().toISOString(),
    node_version: process.version
  }
};

fs.writeFileSync(
  path.join(buildDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ Manifest created: manifest.json');

// Vérifier la taille des fichiers
const jsStats = fs.statSync(initJsTarget);
const cssStats = fs.statSync(cssTarget);

console.log('\n📊 Build Summary:');
console.log(`├── JavaScript: ${(jsStats.size / 1024).toFixed(2)} KB`);
console.log(`├── CSS: ${(cssStats.size / 1024).toFixed(2)} KB`);
console.log(`└── Total: ${((jsStats.size + cssStats.size) / 1024).toFixed(2)} KB`);

console.log('\n🎉 WordPress build completed successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Copy build/ folder to WordPress plugin directory');
console.log('2. Activate the SIPORTS Integration plugin');
console.log('3. Configure the plugin in WordPress admin');
console.log('4. Use shortcodes in your pages and posts');

console.log('\n🔗 Shortcodes disponibles:');
console.log('• [siports_app component="admin"] - Dashboard admin');
console.log('• [siports_app component="packages"] - Gestionnaire packages');
console.log('• [siports_app component="matching"] - Système matching');
console.log('• [siports_app component="main"] - Application complète');