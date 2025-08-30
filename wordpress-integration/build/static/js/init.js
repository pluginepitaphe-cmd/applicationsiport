// SIPORTS WordPress Integration Initializer
(function() {
    'use strict';
    
    // Configuration globale
    window.SiportsApp = {
        containers: new Map(),
        config: window.siportsConfig || {},
        initialized: false
    };
    
    // Fonction principale d'initialisation
    function initializeSiportsApp() {
        if (window.SiportsApp.initialized) return;
        
        console.log('🚀 Initialisation SIPORTS WordPress Integration');
        
        // Trouver tous les conteneurs React
        const containers = document.querySelectorAll('.siports-react-container:not([data-initialized])');
        
        containers.forEach(container => {
            const component = container.dataset.component || 'main';
            const containerId = container.id || 'siports-' + Math.random().toString(36).substr(2, 9);
            
            console.log(`📱 Initialisation composant: ${component} dans ${containerId}`);
            
            // Marquer comme initialisé
            container.setAttribute('data-initialized', 'true');
            
            // Effacer le message de chargement
            container.innerHTML = '';
            
            // Créer le composant React approprié
            createReactComponent(container, component);
        });
        
        window.SiportsApp.initialized = true;
    }
    
    // Créer un composant React basé sur le type
    function createReactComponent(container, componentType) {
        // Vérifier la configuration
        if (!window.siportsConfig) {
            console.error('❌ Configuration SIPORTS manquante');
            container.innerHTML = '<div style="color: red; padding: 20px;">Erreur: Configuration SIPORTS non trouvée</div>';
            return;
        }
        
        const config = window.siportsConfig;
        
        // Créer l'application selon le type de composant
        switch (componentType) {
            case 'admin':
                createAdminDashboard(container, config);
                break;
            case 'packages':
                createPackagesManager(container, config);
                break;
            case 'matching':
                createMatchingSystem(container, config);
                break;
            case 'profile':
                createUserProfile(container, config);
                break;
            case 'analytics':
                createAnalyticsDashboard(container, config);
                break;
            default:
                createMainApp(container, config);
        }
    }
    
    // Créer le tableau de bord admin
    function createAdminDashboard(container, config) {
        container.innerHTML = `
            <div class="siports-admin-dashboard">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="margin: 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">⚓</span>
                        Tableau de Bord Admin SIPORTS
                    </h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Gestion et administration de la plateforme maritime</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    <div class="siports-card">
                        <h3>👥 Utilisateurs</h3>
                        <div class="siports-stat">
                            <span class="siports-number" id="total-users">-</span>
                            <span class="siports-label">Total utilisateurs</span>
                        </div>
                        <button class="siports-btn siports-btn-primary" onclick="loadUserManagement()">Gérer les utilisateurs</button>
                    </div>
                    
                    <div class="siports-card">
                        <h3>📦 Packages</h3>
                        <div class="siports-stat">
                            <span class="siports-number" id="total-packages">-</span>
                            <span class="siports-label">Packages actifs</span>
                        </div>
                        <button class="siports-btn siports-btn-primary" onclick="loadPackageManagement()">Gérer les packages</button>
                    </div>
                    
                    <div class="siports-card">
                        <h3>🔗 Synchronisation</h3>
                        <div class="siports-stat">
                            <span class="siports-number" id="sync-status">-</span>
                            <span class="siports-label">Dernière sync</span>
                        </div>
                        <button class="siports-btn siports-btn-secondary" onclick="triggerSync()">Synchroniser</button>
                    </div>
                </div>
                
                <div id="admin-content">
                    <div class="siports-card">
                        <h3>📊 Aperçu rapide</h3>
                        <p>Sélectionnez une section ci-dessus pour commencer.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Charger les données du dashboard
        loadAdminDashboardData(config);
    }
    
    // Créer le gestionnaire de packages
    function createPackagesManager(container, config) {
        container.innerHTML = `
            <div class="siports-packages-manager">
                <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="margin: 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">📦</span>
                        Gestionnaire de Packages SIPORTS
                    </h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Gérez tous les packages et forfaits disponibles</p>
                </div>
                
                <div class="siports-tabs">
                    <button class="siports-tab active" onclick="switchTab('visitor')">Forfaits Visiteur</button>
                    <button class="siports-tab" onclick="switchTab('partner')">Packages Partenaires</button>
                    <button class="siports-tab" onclick="switchTab('exhibitor')">Packages Exposants</button>
                </div>
                
                <div id="packages-content">
                    <div class="siports-loading-content">Chargement des packages...</div>
                </div>
            </div>
        `;
        
        // Charger les packages
        loadPackagesData(config);
    }
    
    // Créer le système de matching
    function createMatchingSystem(container, config) {
        container.innerHTML = `
            <div class="siports-matching-system">
                <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="margin: 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">🔗</span>
                        Système de Matching Avancé
                    </h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.8;">Connectez les bons partenaires au bon moment</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div class="siports-card">
                        <h3>🎯 Filtres de recherche</h3>
                        <div class="siports-form-group">
                            <label>Type de matching:</label>
                            <select id="match-type" class="siports-select">
                                <option value="all">Tous</option>
                                <option value="business">Business</option>
                                <option value="technical">Technique</option>
                                <option value="partnership">Partenariat</option>
                            </select>
                        </div>
                        
                        <div class="siports-form-group">
                            <label>Secteur:</label>
                            <select id="sector" class="siports-select">
                                <option value="all">Tous secteurs</option>
                                <option value="shipping">Transport maritime</option>
                                <option value="port">Services portuaires</option>
                                <option value="logistics">Logistique</option>
                                <option value="energy">Énergie marine</option>
                            </select>
                        </div>
                        
                        <div class="siports-form-group">
                            <label>Niveau de compatibilité:</label>
                            <input type="range" id="compatibility" min="0" max="100" value="70" class="siports-range">
                            <span id="compatibility-value">70%</span>
                        </div>
                        
                        <button class="siports-btn siports-btn-primary" onclick="performMatching()">
                            🔍 Lancer le matching
                        </button>
                    </div>
                    
                    <div class="siports-card">
                        <h3>📊 Résultats du matching</h3>
                        <div id="matching-results">
                            <p>Configurez vos filtres et lancez une recherche pour voir les résultats.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        setupMatchingSystem(config);
    }
    
    // Créer l'application principale
    function createMainApp(container, config) {
        container.innerHTML = `
            <div class="siports-main-app">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                    <h1 style="margin: 0; font-size: 2.5em; display: flex; align-items: center; justify-content: center;">
                        <span style="margin-right: 15px;">⚓</span>
                        SIPORTS
                    </h1>
                    <p style="margin: 15px 0 0 0; font-size: 1.2em; opacity: 0.9;">
                        Plateforme Maritime Professionnelle
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div class="siports-feature-card" onclick="window.location.href='${config.siteUrl}/admin/dashboard'">
                        <div class="siports-feature-icon">👥</div>
                        <h3>Administration</h3>
                        <p>Gérez les utilisateurs, packages et synchronisations</p>
                    </div>
                    
                    <div class="siports-feature-card" onclick="showPackages()">
                        <div class="siports-feature-icon">📦</div>
                        <h3>Packages & Forfaits</h3>
                        <p>Découvrez nos offres visiteurs et partenaires</p>
                    </div>
                    
                    <div class="siports-feature-card" onclick="showMatching()">
                        <div class="siports-feature-icon">🔗</div>
                        <h3>Matching Avancé</h3>
                        <p>Trouvez les bons partenaires d'affaires</p>
                    </div>
                    
                    <div class="siports-feature-card" onclick="showAnalytics()">
                        <div class="siports-feature-icon">📊</div>
                        <h3>Analytics</h3>
                        <p>Suivez vos performances et statistiques</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Fonctions utilitaires
    function loadAdminDashboardData(config) {
        fetch(config.apiUrl + '/admin/dashboard/stats', {
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('total-users').textContent = data.total_users || 0;
                document.getElementById('total-packages').textContent = data.active_packages || 0;
                document.getElementById('sync-status').textContent = 'Actif';
            }
        })
        .catch(error => {
            console.error('Erreur chargement dashboard:', error);
            document.getElementById('sync-status').textContent = 'Erreur';
        });
    }
    
    function loadPackagesData(config) {
        const content = document.getElementById('packages-content');
        content.innerHTML = `
            <div class="siports-packages-grid">
                <div class="siports-package-card siports-package-free">
                    <h3>🆓 GRATUIT</h3>
                    <div class="siports-price">0€</div>
                    <ul class="siports-features">
                        <li>✅ Accès basic au salon</li>
                        <li>✅ Consultation des exposants</li>
                        <li>❌ RDV B2B limités</li>
                        <li>❌ Accès premium zones</li>
                    </ul>
                </div>
                
                <div class="siports-package-card siports-package-basic">
                    <h3>⭐ BASIC</h3>
                    <div class="siports-price">150€</div>
                    <ul class="siports-features">
                        <li>✅ Tout du gratuit</li>
                        <li>✅ 5 RDV B2B</li>
                        <li>✅ Accès networking</li>
                        <li>✅ Support prioritaire</li>
                    </ul>
                </div>
                
                <div class="siports-package-card siports-package-premium">
                    <h3>💎 PREMIUM</h3>
                    <div class="siports-price">350€</div>
                    <ul class="siports-features">
                        <li>✅ Tout du Basic</li>
                        <li>✅ RDV B2B illimités</li>
                        <li>✅ Accès zones VIP</li>
                        <li>✅ Matching IA avancé</li>
                        <li>✅ Rapports personnalisés</li>
                    </ul>
                </div>
                
                <div class="siports-package-card siports-package-vip">
                    <h3>👑 VIP PASS</h3>
                    <div class="siports-price">750€</div>
                    <ul class="siports-features">
                        <li>✅ Tout du Premium</li>
                        <li>✅ Concierge personnel</li>
                        <li>✅ Accès exclusif événements</li>
                        <li>✅ Transport inclus</li>
                        <li>✅ Restauration premium</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    function setupMatchingSystem(config) {
        // Configuration du slider de compatibilité
        const compatibilityRange = document.getElementById('compatibility');
        const compatibilityValue = document.getElementById('compatibility-value');
        
        compatibilityRange.addEventListener('input', function() {
            compatibilityValue.textContent = this.value + '%';
        });
    }
    
    function getAuthToken() {
        return localStorage.getItem('siports_token') || 
               getCookie('siports_token') || 
               'demo-token';
    }
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // Fonctions globales exposées
    window.loadUserManagement = function() {
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="siports-card">
                <h3>👥 Gestion des Utilisateurs</h3>
                <div class="siports-users-list">
                    <div class="siports-user-item">
                        <div class="siports-user-info">
                            <strong>Admin SIPORTS</strong>
                            <span>admin@siportevent.com</span>
                        </div>
                        <div class="siports-user-actions">
                            <span class="siports-badge siports-badge-admin">Admin</span>
                        </div>
                    </div>
                    <div class="siports-user-item">
                        <div class="siports-user-info">
                            <strong>Exposant Demo</strong>
                            <span>exposant@example.com</span>
                        </div>
                        <div class="siports-user-actions">
                            <span class="siports-badge siports-badge-exhibitor">Exposant</span>
                            <button class="siports-btn siports-btn-small">Valider</button>
                        </div>
                    </div>
                    <div class="siports-user-item">
                        <div class="siports-user-info">
                            <strong>Visiteur Demo</strong>
                            <span>visiteur@example.com</span>
                        </div>
                        <div class="siports-user-actions">
                            <span class="siports-badge siports-badge-visitor">Visiteur</span>
                            <button class="siports-btn siports-btn-small">Valider</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    
    window.loadPackageManagement = function() {
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="siports-card">
                <h3>📦 Gestion des Packages</h3>
                <div class="siports-packages-admin">
                    <table class="siports-table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th>Type</th>
                                <th>Prix</th>
                                <th>Utilisateurs</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Gratuit</strong></td>
                                <td><span class="siports-badge">Visiteur</span></td>
                                <td>0€</td>
                                <td>1,245</td>
                                <td>
                                    <button class="siports-btn siports-btn-small">Modifier</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Premium</strong></td>
                                <td><span class="siports-badge siports-badge-premium">Visiteur</span></td>
                                <td>350€</td>
                                <td>89</td>
                                <td>
                                    <button class="siports-btn siports-btn-small">Modifier</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Platinum Partner</strong></td>
                                <td><span class="siports-badge siports-badge-partner">Partenaire</span></td>
                                <td>25,000€</td>
                                <td>5</td>
                                <td>
                                    <button class="siports-btn siports-btn-small">Modifier</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };
    
    window.triggerSync = function() {
        if (!window.siportsConfig) return;
        
        const syncButton = event.target;
        syncButton.textContent = 'Synchronisation...';
        syncButton.disabled = true;
        
        fetch(window.siportsConfig.apiUrl + '/sync/full-sync', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Synchronisation terminée avec succès!');
            location.reload();
        })
        .catch(error => {
            console.error('Erreur sync:', error);
            alert('Erreur lors de la synchronisation');
        })
        .finally(() => {
            syncButton.textContent = 'Synchroniser';
            syncButton.disabled = false;
        });
    };
    
    window.performMatching = function() {
        const results = document.getElementById('matching-results');
        results.innerHTML = `
            <div class="siports-loading-content">Recherche en cours...</div>
        `;
        
        setTimeout(() => {
            results.innerHTML = `
                <div class="siports-match-result">
                    <div class="siports-match-header">
                        <strong>Maritime Logistics Corp</strong>
                        <span class="siports-match-score">95% Compatible</span>
                    </div>
                    <p>Entreprise de logistique maritime recherchant des partenaires technologiques</p>
                    <button class="siports-btn siports-btn-small">Contacter</button>
                </div>
                
                <div class="siports-match-result">
                    <div class="siports-match-header">
                        <strong>Port Solutions Ltd</strong>
                        <span class="siports-match-score">87% Compatible</span>
                    </div>
                    <p>Solutions portuaires innovantes pour l'automatisation des terminaux</p>
                    <button class="siports-btn siports-btn-small">Contacter</button>
                </div>
                
                <div class="siports-match-result">
                    <div class="siports-match-header">
                        <strong>Green Shipping Alliance</strong>
                        <span class="siports-match-score">82% Compatible</span>
                    </div>
                    <p>Alliance pour le transport maritime durable et écologique</p>
                    <button class="siports-btn siports-btn-small">Contacter</button>
                </div>
            `;
        }, 2000);
    };
    
    // CSS Styles
    const styles = `
        <style>
        .siports-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            margin-bottom: 20px;
        }
        
        .siports-card h3 {
            margin: 0 0 16px 0;
            color: #1f2937;
            display: flex;
            align-items: center;
        }
        
        .siports-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .siports-number {
            font-size: 3em;
            font-weight: bold;
            color: #3b82f6;
            line-height: 1;
        }
        
        .siports-label {
            color: #6b7280;
            font-size: 0.9em;
            margin-top: 4px;
        }
        
        .siports-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        
        .siports-btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .siports-btn-primary:hover {
            background: #2563eb;
            transform: translateY(-1px);
        }
        
        .siports-btn-secondary {
            background: #6b7280;
            color: white;
        }
        
        .siports-btn-small {
            padding: 6px 12px;
            font-size: 0.875rem;
        }
        
        .siports-feature-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid #e5e7eb;
        }
        
        .siports-feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            border-color: #3b82f6;
        }
        
        .siports-feature-icon {
            font-size: 3em;
            margin-bottom: 16px;
        }
        
        .siports-packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .siports-package-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            border: 2px solid #e5e7eb;
            position: relative;
            overflow: hidden;
        }
        
        .siports-package-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #3b82f6;
        }
        
        .siports-package-premium::before {
            background: linear-gradient(45deg, #ffd700, #ff8c00);
        }
        
        .siports-package-vip::before {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        }
        
        .siports-price {
            font-size: 2.5em;
            font-weight: bold;
            color: #3b82f6;
            margin: 16px 0;
        }
        
        .siports-features {
            list-style: none;
            padding: 0;
            text-align: left;
        }
        
        .siports-features li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .siports-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .siports-tab {
            padding: 12px 24px;
            border: none;
            background: none;
            cursor: pointer;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .siports-tab.active,
        .siports-tab:hover {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
        }
        
        .siports-form-group {
            margin-bottom: 16px;
        }
        
        .siports-form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #374151;
        }
        
        .siports-select,
        .siports-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .siports-range {
            width: 100%;
            margin-bottom: 8px;
        }
        
        .siports-match-result {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
        }
        
        .siports-match-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .siports-match-score {
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
        }
        
        .siports-users-list {
            space-y: 12px;
        }
        
        .siports-user-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        
        .siports-user-info {
            display: flex;
            flex-direction: column;
        }
        
        .siports-user-info span {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .siports-user-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .siports-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .siports-badge-admin {
            background: #fef3c7;
            color: #92400e;
        }
        
        .siports-badge-exhibitor {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .siports-badge-visitor {
            background: #d1fae5;
            color: #065f46;
        }
        
        .siports-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .siports-table th,
        .siports-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .siports-table th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        
        .siports-loading-content {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }
        
        @media (max-width: 768px) {
            .siports-card {
                padding: 16px;
            }
            
            .siports-feature-card {
                padding: 20px;
            }
            
            .siports-packages-grid {
                grid-template-columns: 1fr;
            }
            
            .siports-user-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            
            .siports-user-actions {
                width: 100%;
                justify-content: space-between;
            }
        }
        </style>
    `;
    
    // Ajouter les styles à la page
    document.head.insertAdjacentHTML('beforeend', styles);
    
    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSiportsApp);
    } else {
        initializeSiportsApp();
    }
    
    // Réinitialiser après les requêtes AJAX (pour les thèmes qui utilisent AJAX)
    if (window.jQuery) {
        jQuery(document).ajaxComplete(function() {
            setTimeout(initializeSiportsApp, 100);
        });
    }
    
    // Observer pour les nouveaux conteneurs ajoutés dynamiquement
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('siports-react-container')) {
                        initializeSiportsApp();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();