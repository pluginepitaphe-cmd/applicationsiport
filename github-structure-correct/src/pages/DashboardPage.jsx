import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileCompletion from '../components/Analytics/ProfileCompletion';
import UserRecommendations from '../components/Analytics/UserRecommendations';
import EngagementAnalytics from '../components/Analytics/EngagementAnalytics';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const getDashboardTitle = () => {
    switch (user?.user_type) {
      case 'admin':
        return 'Tableau de bord Administrateur';
      case 'exhibitor':
        return 'Tableau de bord Exposant';
      case 'partner':
        return 'Tableau de bord Partenaire';
      case 'visitor':
        return 'Tableau de bord Visiteur';
      default:
        return 'Tableau de bord';
    }
  };

  const getWelcomeMessage = () => {
    const firstName = user?.first_name || 'Utilisateur';
    const timeOfDay = new Date().getHours() < 12 ? 'Bonjour' : 
                     new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';
    
    return `${timeOfDay}, ${firstName} !`;
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'recommendations', label: 'Recommandations', icon: '🤝' },
    { id: 'profile', label: 'Profil', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-lg text-gray-600 mt-2">{getWelcomeMessage()}</p>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfileCompletion />
              <EngagementAnalytics />
              
              {/* Statistiques rapides */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques rapides</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Connexions</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">RDV planifiés</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">25</div>
                    <div className="text-sm text-gray-600">Produits vus</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-gray-600">Favoris</div>
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Nouveau contact ajouté</p>
                    <span className="text-xs text-gray-500">Il y a 2h</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">RDV confirmé avec Maritime Solutions</p>
                    <span className="text-xs text-gray-500">Il y a 4h</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Produit ajouté aux favoris</p>
                    <span className="text-xs text-gray-500">Hier</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EngagementAnalytics />
              
              {/* Graphique d'activité (simulé) */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité des 7 derniers jours</h3>
                <div className="space-y-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                    const activity = Math.floor(Math.random() * 100);
                    return (
                      <div key={day} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-8">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${activity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">{activity}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="grid grid-cols-1 gap-6">
              <UserRecommendations />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfileCompletion />
              
              {/* Informations du profil */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du profil</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                    <p className="text-sm text-gray-900">{user?.first_name} {user?.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type de compte</label>
                    <p className="text-sm text-gray-900 capitalize">{user?.user_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Entreprise</label>
                    <p className="text-sm text-gray-900">{user?.company || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Poste</label>
                    <p className="text-sm text-gray-900">{user?.position || 'Non renseigné'}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Modifier le profil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions flottantes pour les exposants */}
        {user?.user_type === 'exhibitor' && (
          <div className="fixed bottom-6 right-6 space-y-3">
            <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <div className="text-xs text-gray-600 text-center">Ajouter produit</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

