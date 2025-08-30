import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, MessageSquare, Calendar, Search, Filter, Star, Building, MapPin,
  Phone, Mail, Globe, UserPlus, Send, Eye, Heart, BarChart3, Settings,
  BookmarkPlus, Share2, Video, FileText, Download, Clock, CheckCircle,
  AlertCircle, Languages, Award, TrendingUp, Network, Sparkles, Brain,
  Target, Bell, User, Coffee, Briefcase, Camera, Mic, Users2, Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Hub de Réseautage IA Avancé - Selon spécifications document
const AINetworkingHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('smart-directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    sector: 'all',
    location: 'all',
    objectives: 'all',
    availability: 'all',
    language: 'all'
  });

  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [connections, setConnections] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [conversationStarters, setConversationStarters] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Données étendues selon spécifications document
  const mockParticipants = [
    {
      id: 1,
      type: 'exposant',
      name: 'Dr. Marcus Chen',
      title: 'CTO',
      company: 'Port Authority Singapore',
      avatar: '/images/avatar-marcus.jpg',
      coverPhoto: '/images/cover-singapore.jpg',
      description: 'Expert en transformation digitale des infrastructures portuaires avec 20 ans d\'expérience. Pioneer de l\'IA portuaire en Asie-Pacifique.',
      detailedBio: 'Docteur en Computer Science de NTU Singapour, Marcus a dirigé la transformation digitale du Port de Singapour, projet de 3 milliards USD. Il est reconnu comme l\'un des 50 leaders technologiques les plus influents d\'Asie.',
      sector: 'IA & Transformation Digitale',
      location: 'Singapour',
      languages: ['Anglais', 'Mandarin', 'Malais'],
      
      // Profil détaillé selon spécifications
      objectives: {
        participation: ['Recherche de partenaires technologiques', 'Expansion européenne', 'Partage d\'expertise'],
        business: ['Solutions IA portuaire', 'Partenariats stratégiques', 'Innovation collaborative']
      },
      
      interests: ['Intelligence Artificielle', 'Digital Twin', 'IoT Maritime', 'Blockchain', 'Sustainability'],
      expertise: ['Machine Learning', 'Computer Vision', 'Systèmes distribués', 'Architecture cloud'],
      
      // Contact et social
      contactInfo: {
        email: 'm.chen@portsingapore.gov.sg',
        phone: '+65 9123 4567',
        website: 'portsingapore.gov.sg',
        linkedin: 'marcus-chen-singapore',
        twitter: '@marcuschen_ai'
      },
      
      // Disponibilité intelligente
      availability: {
        status: 'Disponible immédiatement',
        preferredSlots: ['09:00-12:00', '14:00-17:00'],
        timezone: 'GMT+8',
        meetingPreferences: ['Présentiel au stand D-42', 'Visioconférence', 'Déjeuner business'],
        nextAvailable: '2024-03-15T09:00:00Z'
      },
      
      // Contenu multimédia
      mediaContent: [
        { type: 'video', title: 'IA Portuaire: Vision 2030', duration: '12:34', views: 2847 },
        { type: 'presentation', title: 'Digital Twin du Port de Singapour', pages: 45 },
        { type: 'whitepaper', title: 'Future of Smart Ports', downloads: 1200 }
      ],
      
      // Métriques et social proof
      profileStats: {
        views: 3421,
        connections: 567,
        endorsements: 89,
        publicationsCites: 45
      },
      
      // Réalisations
      achievements: [
        '🏆 Asia Port Innovation Award 2023',
        '📚 Auteur de 12 publications scientifiques',
        '🎯 +40% efficacité opérationnelle Port de Singapour',
        '💡 3 brevets déposés en IA maritime'
      ],
      
      // Données pour matching IA
      matchingData: {
        collaborationHistory: ['Tech partnerships', 'Research projects'],
        successMetrics: { projectSuccess: 95, clientSatisfaction: 98 },
        networkValue: 'Très élevé',
        responseRate: 87
      },
      
      // État de connexion
      connectionStatus: 'not_connected',
      lastActive: '2 heures',
      conferencePresence: {
        sessions: ['Keynote IA Maritime', 'Panel Digital Transformation'],
        standLocation: 'Hall D - Stand 42'
      }
    },
    
    {
      id: 2,
      type: 'partenaire',
      name: 'Sarah Al-Mahmoud',
      title: 'VP Innovation & Partnerships',
      company: 'Emirates Maritime Technologies',
      avatar: '/images/avatar-sarah-m.jpg',
      description: 'Leader de l\'innovation maritime au Moyen-Orient, spécialisée dans les partenariats technologiques stratégiques.',
      sector: 'Innovation Maritime',
      location: 'Dubaï, EAU',
      languages: ['Arabe', 'Anglais', 'Français'],
      
      objectives: {
        participation: ['Sourcing de technologies', 'Partenariats européens', 'Investissements stratégiques'],
        business: ['Scale-up innovations', 'Market expansion', 'Talent acquisition']
      },
      
      interests: ['Fintech Maritime', 'Sustainability Tech', 'Autonomous Vessels', 'Supply Chain 4.0'],
      
      availability: {
        status: 'Disponible sur RDV',
        preferredSlots: ['10:00-13:00', '15:00-18:00'],
        timezone: 'GMT+4',
        meetingPreferences: ['Réunions formelles', 'Networking cocktails']
      },
      
      profileStats: {
        views: 1876,
        connections: 342,
        endorsements: 67,
        dealsCompleted: 23
      },
      
      connectionStatus: 'pending_request',
      budget: '1M-5M USD',
      decisionMaker: true
    },
    
    {
      id: 3,
      type: 'visiteur',
      name: 'Jean-Pierre Dubois',
      title: 'Directeur Général',
      company: 'Port Autonome du Havre',
      avatar: '/images/avatar-jp.jpg',
      description: 'Dirigeant expérimenté dans la modernisation des infrastructures portuaires françaises.',
      sector: 'Gestion Portuaire',
      location: 'Le Havre, France',
      languages: ['Français', 'Anglais'],
      
      objectives: {
        participation: ['Benchmarking international', 'Solutions d\'optimisation', 'Partenaires technologiques'],
        business: ['Modernisation infrastructure', 'Réduction empreinte carbone', 'Digitalisation']
      },
      
      interests: ['Green Technology', 'Port Automation', 'Energy Efficiency', 'Smart Logistics'],
      
      availability: {
        status: 'Flexible',
        timezone: 'GMT+1',
        meetingPreferences: ['Visites techniques', 'Démonstrations']
      },
      
      profileStats: {
        views: 987,
        connections: 156,
        endorsements: 34
      },
      
      connectionStatus: 'connected',
      projectBudget: '500k-2M EUR',
      decisionAuthority: 'Final approver'
    }
  ];

  // Algorithme de recherche sémantique IA
  const performSemanticSearch = (query, profiles) => {
    if (!semanticSearch || !query) return profiles;
    
    const queryTerms = query.toLowerCase().split(' ');
    const semanticMatches = profiles.map(profile => {
      let relevanceScore = 0;
      
      // Analyse sémantique des intérêts
      const profileText = [
        profile.description,
        profile.interests?.join(' '),
        profile.expertise?.join(' '),
        profile.sector
      ].join(' ').toLowerCase();
      
      // Calcul de pertinence sémantique
      queryTerms.forEach(term => {
        if (profileText.includes(term)) relevanceScore += 10;
        
        // Synonymes et termes associés (NLP simplifié)
        const synonyms = {
          'ia': ['intelligence artificielle', 'machine learning', 'ai'],
          'port': ['maritime', 'shipping', 'logistics'],
          'digital': ['numérique', 'technology', 'tech']
        };
        
        Object.entries(synonyms).forEach(([key, syns]) => {
          if (term.includes(key) && syns.some(syn => profileText.includes(syn))) {
            relevanceScore += 5;
          }
        });
      });
      
      return { ...profile, relevanceScore };
    });
    
    return semanticMatches
      .filter(p => p.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Générateur de suggestions de conversation IA
  const generateConversationStarters = (profile) => {
    const starters = [];
    
    if (profile.interests?.includes('Intelligence Artificielle')) {
      starters.push({
        category: 'Technique',
        message: `Bonjour ${profile.name}, j'ai vu votre expertise en IA maritime. Quelles sont vos approches pour l'implémentation du machine learning dans la gestion portuaire ?`,
        context: 'Basé sur votre intérêt commun pour l\'IA'
      });
    }
    
    if (profile.achievements?.length > 0) {
      starters.push({
        category: 'Professionnel',
        message: `Félicitations pour ${profile.achievements[0]}. Pourriez-vous partager votre expérience sur ce projet ?`,
        context: 'Reconnaissance de ses réussites'
      });
    }
    
    if (profile.objectives?.business) {
      starters.push({
        category: 'Business',
        message: `Nous partageons des objectifs similaires en ${profile.objectives.business[0]}. Seriez-vous intéressé pour explorer des synergies ?`,
        context: 'Objectifs business alignés'
      });
    }
    
    return starters;
  };

  // Système de recommandations proactives
  const generateAISuggestions = () => {
    const suggestions = [
      {
        type: 'connection',
        icon: UserPlus,
        title: 'Nouvelle connexion suggérée',
        description: 'Dr. Marcus Chen partage 4 intérêts techniques avec vous',
        action: 'Se connecter',
        priority: 'high',
        reasoning: 'Basé sur l\'analyse de compatibilité technique et géographique'
      },
      {
        type: 'meeting',
        icon: Calendar,
        title: 'Créneau optimal détecté',
        description: 'Sarah Al-Mahmoud est disponible dans 2h - compatibilité 94%',
        action: 'Planifier RDV',
        priority: 'medium',
        reasoning: 'Analyse de disponibilité et potentiel business'
      },
      {
        type: 'content',
        icon: FileText,
        title: 'Contenu pertinent',
        description: 'Nouveau whitepaper sur l\'IA portuaire publié par votre réseau',
        action: 'Consulter',
        priority: 'low',
        reasoning: 'Basé sur vos centres d\'intérêt'
      }
    ];
    
    setAiSuggestions(suggestions);
  };

  // Filtrage avancé
  const filterParticipants = () => {
    let filtered = [...mockParticipants];
    
    // Recherche textuelle ou sémantique
    if (searchTerm) {
      filtered = semanticSearch ? 
        performSemanticSearch(searchTerm, filtered) :
        filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sector.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Filtres avancés
    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(p => p.type === selectedFilters.type);
    }
    
    if (selectedFilters.sector !== 'all') {
      filtered = filtered.filter(p => p.sector.includes(selectedFilters.sector));
    }
    
    if (selectedFilters.availability !== 'all') {
      filtered = filtered.filter(p => {
        if (selectedFilters.availability === 'immediate') {
          return p.availability?.status?.includes('Disponible');
        }
        return true;
      });
    }
    
    if (selectedFilters.language !== 'all') {
      filtered = filtered.filter(p => 
        p.languages?.includes(selectedFilters.language)
      );
    }
    
    setFilteredParticipants(filtered);
  };

  // Gestion des connexions intelligente
  const handleConnection = (participantId, action) => {
    const participant = mockParticipants.find(p => p.id === participantId);
    
    if (action === 'connect') {
      // Logique de demande de connexion avec message personnalisé
      const suggestedMessage = `Bonjour ${participant.name}, j'aimerais me connecter avec vous pour échanger sur ${participant.interests?.[0] || 'nos intérêts communs'}.`;
      
      // Ici on pourrait ouvrir un modal pour personnaliser le message
      setConnections(prev => [...prev, participantId]);
      
      // Notification IA
      console.log(`Demande de connexion envoyée à ${participant.name}`);
    }
  };

  // Planification intelligente de RDV
  const handleSmartMeeting = (participantId) => {
    const participant = mockParticipants.find(p => p.id === participantId);
    
    // Analyse des créneaux optimaux
    const optimalSlots = participant.availability?.preferredSlots || [];
    const suggestedTopics = participant.interests?.slice(0, 2) || [];
    
    console.log(`Créneaux suggérés pour ${participant.name}:`, optimalSlots);
    console.log('Sujets de discussion suggérés:', suggestedTopics);
  };

  useEffect(() => {
    setParticipants(mockParticipants);
    filterParticipants();
    generateAISuggestions();
  }, [searchTerm, selectedFilters, semanticSearch]);

  // Interface utilisateur
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header intelligent */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hub de Réseautage IA
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-4">
            Réseautage maritime intelligent avec recommandations proactives et matching sémantique
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">Recherche Sémantique</Badge>
            <Badge className="bg-green-100 text-green-800">Suggestions Proactives</Badge>
            <Badge className="bg-purple-100 text-purple-800">RDV Intelligent</Badge>
          </div>
        </div>

        {/* Navigation avancée */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex bg-white rounded-xl shadow-lg p-1 min-w-max">
            {[
              { id: 'smart-directory', icon: Users, label: 'Annuaire IA' },
              { id: 'my-network', icon: Network, label: 'Mon Réseau' },
              { id: 'ai-suggestions', icon: Brain, label: 'Suggestions IA' },
              { id: 'smart-messaging', icon: MessageSquare, label: 'Messagerie IA' },
              { id: 'meeting-scheduler', icon: Calendar, label: 'RDV Intelligent' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics Réseau' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Annuaire intelligent */}
        {activeTab === 'smart-directory' && (
          <div className="space-y-6">
            {/* Recherche avancée et filtres */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recherche Intelligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par expertise, intérêts, secteur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="semantic"
                      checked={semanticSearch}
                      onChange={(e) => setSemanticSearch(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="semantic" className="text-sm font-medium flex items-center gap-1">
                      <Brain className="h-4 w-4" />
                      Recherche sémantique IA
                    </label>
                  </div>
                </div>
                
                {/* Filtres avancés */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { key: 'type', label: 'Type', options: ['all', 'exposant', 'partenaire', 'visiteur'] },
                    { key: 'sector', label: 'Secteur', options: ['all', 'IA', 'Innovation', 'Gestion'] },
                    { key: 'location', label: 'Région', options: ['all', 'Europe', 'Asie', 'Moyen-Orient'] },
                    { key: 'availability', label: 'Disponibilité', options: ['all', 'immediate', 'flexible'] },
                    { key: 'language', label: 'Langue', options: ['all', 'Français', 'Anglais', 'Arabe'] }
                  ].map(filter => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium mb-1">{filter.label}</label>
                      <select
                        value={selectedFilters[filter.key]}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        {filter.options.map(option => (
                          <option key={option} value={option}>
                            {option === 'all' ? `Tous les ${filter.label.toLowerCase()}s` : option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions IA proactives */}
            {aiSuggestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiSuggestions.map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <Card key={idx} className={`border-l-4 ${
                      suggestion.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                      suggestion.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-1 ${
                            suggestion.priority === 'high' ? 'text-red-600' :
                            suggestion.priority === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                            <p className="text-xs text-slate-500 mb-3">{suggestion.reasoning}</p>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                              {suggestion.action}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Profiles enrichis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredParticipants.map(participant => (
                <Card key={participant.id} className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/90 backdrop-blur-sm" 
                      onClick={() => setSelectedProfile(participant)}>
                  <CardContent className="p-0">
                    {/* Header avec photo de couverture */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      
                      {/* Statut en ligne */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          participant.lastActive?.includes('heure') ? 'bg-green-500' : 'bg-yellow-500'
                        } animate-pulse`}></div>
                        <Badge className="bg-white/90 text-slate-800 text-xs">
                          {participant.lastActive}
                        </Badge>
                      </div>
                      
                      {/* Score de matching si recherche sémantique */}
                      {participant.relevanceScore && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-500 text-white font-bold">
                            🎯 {participant.relevanceScore}% pertinent
                          </Badge>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-lg border-4 border-white">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{participant.name}</h3>
                          <p className="text-sm opacity-90">{participant.title}</p>
                          <p className="text-xs opacity-80">{participant.company}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Badges et statut connexion */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={`${
                            participant.type === 'exposant' ? 'bg-blue-100 text-blue-800' :
                            participant.type === 'partenaire' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {participant.type === 'exposant' ? '🏢 Exposant' :
                             participant.type === 'partenaire' ? '👑 Partenaire' : '👤 Visiteur'}
                          </Badge>
                          {participant.decisionMaker && (
                            <Badge className="bg-red-100 text-red-800">💼 Décideur</Badge>
                          )}
                        </div>
                        
                        <Badge variant="outline" className={`${
                          participant.connectionStatus === 'connected' ? 'text-green-600' :
                          participant.connectionStatus === 'pending_request' ? 'text-yellow-600' :
                          'text-slate-600'
                        }`}>
                          {participant.connectionStatus === 'connected' ? '✓ Connecté' :
                           participant.connectionStatus === 'pending_request' ? '⏳ En attente' :
                           '○ Non connecté'}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-700 line-clamp-2">{participant.description}</p>

                      {/* Secteur et localisation */}
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {participant.sector}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {participant.location}
                        </span>
                      </div>

                      {/* Langues */}
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-slate-500" />
                        <div className="flex gap-1">
                          {participant.languages?.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Objectifs de participation */}
                      {participant.objectives?.participation && (
                        <div>
                          <p className="text-xs font-medium text-slate-700 mb-1">Objectifs:</p>
                          <div className="flex flex-wrap gap-1">
                            {participant.objectives.participation.slice(0, 2).map((obj, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{obj}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disponibilité intelligente */}
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700">Disponibilité</span>
                          <span className={`text-xs font-semibold ${
                            participant.availability?.status?.includes('Disponible') ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {participant.availability?.status}
                          </span>
                        </div>
                        {participant.availability?.preferredSlots && (
                          <div className="flex gap-1 text-xs text-slate-600">
                            {participant.availability.preferredSlots.map(slot => (
                              <Badge key={slot} variant="outline" className="text-xs">{slot}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Métriques sociales */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span className="font-semibold">{participant.profileStats?.views}</span>
                          </div>
                          <span>vues</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="font-semibold">{participant.profileStats?.connections}</span>
                          </div>
                          <span>connexions</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Award className="h-3 w-3" />
                            <span className="font-semibold">{participant.profileStats?.endorsements}</span>
                          </div>
                          <span>recommandations</span>
                        </div>
                      </div>

                      {/* Actions intelligentes */}
                      <div className="flex gap-2 pt-2">
                        {participant.connectionStatus === 'not_connected' ? (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnection(participant.id, 'connect');
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Se connecter
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSmartMeeting(participant.id);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          RDV IA
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFavorites(prev => 
                              prev.includes(participant.id) ? 
                              prev.filter(id => id !== participant.id) : 
                              [...prev, participant.id]
                            );
                          }}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(participant.id) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions AI */}
        {activeTab === 'ai-suggestions' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Suggestions IA Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Recommandations Intelligentes
                </h3>
                <p className="text-slate-600 mb-6">
                  L'IA analyse en continu votre profil et vos interactions pour vous suggérer les meilleures opportunités de réseautage
                </p>
                <div className="max-w-2xl mx-auto">
                  <div className="grid gap-4">
                    {aiSuggestions.map((suggestion, idx) => {
                      const Icon = suggestion.icon;
                      return (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <Icon className="h-8 w-8 text-blue-600" />
                          <div className="text-left flex-1">
                            <h4 className="font-semibold">{suggestion.title}</h4>
                            <p className="text-sm text-slate-600">{suggestion.description}</p>
                          </div>
                          <Button size="sm">{suggestion.action}</Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de profil détaillé */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                      {selectedProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                      <p className="text-blue-100">{selectedProfile.title} • {selectedProfile.company}</p>
                      <p className="text-blue-200 text-sm">{selectedProfile.location}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProfile(null)} className="text-white hover:bg-white/20">
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Colonne principale */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Bio détaillée */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          À propos
                        </h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                          {selectedProfile.detailedBio || selectedProfile.description}
                        </p>
                        
                        {/* Réalisations */}
                        {selectedProfile.achievements && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Réalisations
                            </h4>
                            <div className="space-y-2">
                              {selectedProfile.achievements.map((achievement, idx) => (
                                <div key={idx} className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-2">
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Objectifs et intérêts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Objectifs
                          </h3>
                          {selectedProfile.objectives?.participation && (
                            <div className="space-y-2">
                              {selectedProfile.objectives.participation.map((obj, idx) => (
                                <Badge key={idx} variant="outline" className="mr-1 mb-1">{obj}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Intérêts
                          </h3>
                          <div className="space-y-2">
                            {selectedProfile.interests?.map((interest, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-1 mb-1">{interest}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Contenu multimédia */}
                    {selectedProfile.mediaContent && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Ressources partagées
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedProfile.mediaContent.map((media, idx) => (
                              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center gap-2 mb-2">
                                  {media.type === 'video' && <Video className="h-5 w-5 text-red-600" />}
                                  {media.type === 'presentation' && <FileText className="h-5 w-5 text-blue-600" />}
                                  {media.type === 'whitepaper' && <FileText className="h-5 w-5 text-green-600" />}
                                  <span className="font-medium text-sm">{media.title}</span>
                                </div>
                                <div className="text-xs text-slate-500 space-y-1">
                                  {media.duration && <div>Durée: {media.duration}</div>}
                                  {media.views && <div>{media.views} vues</div>}
                                  {media.pages && <div>{media.pages} pages</div>}
                                  {media.downloads && <div>{media.downloads} téléchargements</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions de conversation IA */}
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          Suggestions de conversation IA
                        </h3>
                        <div className="space-y-3">
                          {generateConversationStarters(selectedProfile).map((starter, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-purple-200">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-xs">{starter.category}</Badge>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                                  <Send className="h-3 w-3 mr-1" />
                                  Utiliser
                                </Button>
                              </div>
                              <p className="text-sm text-slate-700 mb-1">{starter.message}</p>
                              <p className="text-xs text-slate-500 italic">{starter.context}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Colonne latérale */}
                  <div className="space-y-6">
                    {/* Actions rapides */}
                    <Card>
                      <CardContent className="p-6 space-y-3">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message intelligent
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          RDV optimal IA
                        </Button>
                        <Button variant="outline" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajouter au réseau
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager profil
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Contact enrichi */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Contact
                        </h3>
                        <div className="space-y-3 text-sm">
                          {selectedProfile.contactInfo?.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <span>{selectedProfile.contactInfo.email}</span>
                            </div>
                          )}
                          {selectedProfile.contactInfo?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <span>{selectedProfile.contactInfo.phone}</span>
                            </div>
                          )}
                          {selectedProfile.contactInfo?.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-500" />
                              <span>{selectedProfile.contactInfo.website}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Disponibilité intelligente */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Disponibilité IA
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{selectedProfile.availability?.status}</span>
                          </div>
                          
                          {selectedProfile.availability?.preferredSlots && (
                            <div>
                              <p className="font-medium mb-2">Créneaux préférés:</p>
                              <div className="space-y-1">
                                {selectedProfile.availability.preferredSlots.map(slot => (
                                  <Badge key={slot} variant="outline" className="mr-1">{slot}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {selectedProfile.availability?.meetingPreferences && (
                            <div>
                              <p className="font-medium mb-2">Préférences RDV:</p>
                              <div className="space-y-1">
                                {selectedProfile.availability.meetingPreferences.map(pref => (
                                  <div key={pref} className="text-xs text-slate-600">• {pref}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Métriques avancées */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Métriques
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Vues profil:</span>
                            <span className="font-semibold">{selectedProfile.profileStats?.views}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Connexions:</span>
                            <span className="font-semibold">{selectedProfile.profileStats?.connections}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recommandations:</span>
                            <span className="font-semibold">{selectedProfile.profileStats?.endorsements}</span>
                          </div>
                          {selectedProfile.matchingData?.responseRate && (
                            <div className="flex justify-between">
                              <span>Taux de réponse:</span>
                              <span className="font-semibold text-green-600">{selectedProfile.matchingData.responseRate}%</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AINetworkingHub;