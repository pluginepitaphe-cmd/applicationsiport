import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Users, Brain, Zap, TrendingUp, Heart, MessageSquare,
  Calendar, Star, Award, Building, Globe, ArrowRight, Filter,
  Search, ChevronDown, ChevronUp, Eye, UserPlus, Sparkles,
  Network, Briefcase, Handshake, Crown, Gift, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Algorithme de matching avancé
const AdvancedMatchingSystem = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [filters, setFilters] = useState({
    matchType: 'all', // partners, exhibitors, visitors
    sector: 'all',
    compatibility: 70,
    location: 'all',
    packageLevel: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Données simulées pour le matching
  const mockProfiles = [
    {
      id: 1,
      name: 'Maritime Solutions International',
      type: 'partner',
      level: 'platinum',
      sector: 'Équipements portuaires',
      location: 'Maroc',
      description: 'Leader mondial en automatisation portuaire',
      avatar: null,
      interests: ['IoT', 'Automatisation', 'Intelligence artificielle'],
      lookingFor: ['Distributeurs', 'Intégrateurs', 'Clients finaux'],
      budget: '500k-1M',
      compatibility: 95,
      mutualInterests: ['Automatisation', 'IoT', 'Ports intelligents'],
      businessPotential: 'Très élevé',
      meetingAvailability: 'Immédiate',
      languages: ['Français', 'Anglais', 'Arabe'],
      certifications: ['ISO 9001', 'ISO 14001'],
      recentNews: 'Nouveau contrat avec le Port de Tanger Med',
      socialProof: {
        employees: '200-500',
        revenue: '50M+',
        clients: '50+ ports mondiaux'
      }
    },
    {
      id: 2,
      name: 'Port Authority Morocco',
      type: 'visitor',
      level: 'vip',
      sector: 'Gestion portuaire',
      location: 'Maroc',
      description: 'Autorité portuaire nationale du Maroc',
      interests: ['Modernisation', 'Durabilité', 'Digitalisation'],
      lookingFor: ['Solutions innovantes', 'Partenaires technologiques'],
      budget: '1M+',
      compatibility: 92,
      mutualInterests: ['Digitalisation', 'Modernisation', 'Écologie'],
      businessPotential: 'Très élevé',
      meetingAvailability: 'Dans 48h',
      languages: ['Français', 'Arabe', 'Anglais'],
      position: 'Directeur Général',
      decisionMaker: true,
      projectTimeline: '6-12 mois'
    },
    {
      id: 3,
      name: 'EuroMarine Technology',
      type: 'exhibitor',
      level: 'premium',
      sector: 'Technologies marines',
      location: 'France',
      description: 'Innovations en technologies marines et offshore',
      interests: ['Énergies renouvelables', 'Offshore', 'R&D'],
      lookingFor: ['Partenaires R&D', 'Investisseurs', 'Marchés émergents'],
      budget: '200k-500k',
      compatibility: 88,
      mutualInterests: ['Innovation', 'Énergies renouvelables'],
      businessPotential: 'Élevé',
      meetingAvailability: 'Immédiate',
      languages: ['Français', 'Anglais'],
      standLocation: 'Hall A-15',
      newProduct: 'Système éolien offshore nouvelle génération'
    },
    {
      id: 4,
      name: 'Digital Harbor Solutions',
      type: 'partner',
      level: 'gold',
      sector: 'Solutions digitales',
      location: 'Singapour',
      description: 'Plateforme digitale pour l\'optimisation portuaire',
      interests: ['IA', 'Big Data', 'Optimisation', 'Prédictif'],
      lookingFor: ['Ports pilotes', 'Partenaires techniques', 'Scaling'],
      budget: '300k-800k',
      compatibility: 85,
      mutualInterests: ['IA', 'Optimisation', 'Data'],
      businessPotential: 'Très élevé',
      meetingAvailability: 'Immédiate',
      languages: ['Anglais', 'Mandarin'],
      techStack: ['Python', 'TensorFlow', 'AWS'],
      successStories: 'Port de Singapour: +40% efficacité'
    },
    {
      id: 5,
      name: 'GreenPort Initiative',
      type: 'visitor',
      level: 'premium',
      sector: 'Développement durable',
      location: 'Pays-Bas',
      description: 'Initiative pour la transition écologique des ports',
      interests: ['Écologie', 'Transition énergétique', 'Certification'],
      lookingFor: ['Solutions vertes', 'Partenaires durables'],
      budget: '100k-300k',
      compatibility: 82,
      mutualInterests: ['Durabilité', 'Écologie'],
      businessPotential: 'Moyen',
      meetingAvailability: 'Dans 24h',
      languages: ['Anglais', 'Néerlandais'],
      focus: 'Transition énergétique portuaire',
      network: '150+ ports européens'
    }
  ];

  // Algorithme de calcul de compatibilité
  const calculateCompatibility = (profile1, profile2) => {
    let score = 0;
    let factors = 0;

    // Intérêts mutuels (30%)
    const commonInterests = profile1.interests.filter(interest => 
      profile2.interests.includes(interest)
    );
    score += (commonInterests.length / Math.max(profile1.interests.length, profile2.interests.length)) * 30;
    factors += 30;

    // Secteur complémentaire (25%)
    if (profile1.sector === profile2.sector || 
        (profile1.lookingFor && profile1.lookingFor.some(need => 
          profile2.description.toLowerCase().includes(need.toLowerCase())))) {
      score += 25;
    }
    factors += 25;

    // Niveau de forfait/engagement (20%)
    const levelScores = { platinum: 4, gold: 3, premium: 2, silver: 1, basic: 1, free: 0 };
    const level1 = levelScores[profile1.level] || 0;
    const level2 = levelScores[profile2.level] || 0;
    score += ((level1 + level2) / 8) * 20;
    factors += 20;

    // Budget compatible (15%)
    if (profile1.budget && profile2.budget) {
      score += 15; // Simplifié - dans la vraie vie, analyser les fourchettes
    }
    factors += 15;

    // Disponibilité (10%)
    if (profile1.meetingAvailability === 'Immédiate' || profile2.meetingAvailability === 'Immédiate') {
      score += 10;
    }
    factors += 10;

    return Math.round((score / factors) * 100);
  };

  // Générer les recommandations de matching
  const generateMatches = () => {
    setLoading(true);
    
    setTimeout(() => {
      const userProfile = {
        interests: user?.interests?.split(',') || ['Automatisation', 'IoT'],
        sector: user?.sector || 'Gestion portuaire',
        level: user?.visitor_package || user?.partnership_package || 'premium',
        type: user?.user_type || 'visitor'
      };

      let filteredProfiles = mockProfiles.filter(profile => {
        if (filters.matchType !== 'all' && profile.type !== filters.matchType) return false;
        if (filters.sector !== 'all' && profile.sector !== filters.sector) return false;
        if (filters.location !== 'all' && profile.location !== filters.location) return false;
        if (filters.packageLevel !== 'all' && profile.level !== filters.packageLevel) return false;
        
        const compatibility = calculateCompatibility(userProfile, profile);
        return compatibility >= filters.compatibility;
      });

      // Ajouter le score de compatibilité et trier
      filteredProfiles = filteredProfiles.map(profile => ({
        ...profile,
        compatibility: calculateCompatibility(userProfile, profile)
      })).sort((a, b) => b.compatibility - a.compatibility);

      setMatches(filteredProfiles);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMatches();
  }, [filters]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'partner': return <Crown className="h-4 w-4" />;
      case 'exhibitor': return <Building className="h-4 w-4" />;
      case 'visitor': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'partner': return 'text-yellow-600 bg-yellow-100';
      case 'exhibitor': return 'text-blue-600 bg-blue-100';
      case 'visitor': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'platinum': return 'text-slate-700 bg-slate-100 border-slate-300';
      case 'gold': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'premium': return 'text-purple-700 bg-purple-100 border-purple-300';
      case 'silver': return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'vip': return 'text-amber-700 bg-amber-100 border-amber-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-700 bg-green-100';
    if (score >= 80) return 'text-blue-700 bg-blue-100';
    if (score >= 70) return 'text-yellow-700 bg-yellow-100';
    return 'text-orange-700 bg-orange-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            Système de Matching Avancé
          </h1>
          <p className="text-lg text-slate-600">
            IA intelligente pour connecter partenaires, exposants et visiteurs selon leurs affinités
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-lg p-1">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'recommendations' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Recommandations
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Filters */}
        {activeTab === 'recommendations' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres de matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={filters.matchType}
                    onChange={(e) => setFilters({...filters, matchType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Tous</option>
                    <option value="partner">Partenaires</option>
                    <option value="exhibitor">Exposants</option>
                    <option value="visitor">Visiteurs</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Secteur</label>
                  <select
                    value={filters.sector}
                    onChange={(e) => setFilters({...filters, sector: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Tous secteurs</option>
                    <option value="Équipements portuaires">Équipements portuaires</option>
                    <option value="Gestion portuaire">Gestion portuaire</option>
                    <option value="Technologies marines">Technologies marines</option>
                    <option value="Solutions digitales">Solutions digitales</option>
                    <option value="Développement durable">Développement durable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Localisation</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Toutes</option>
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                    <option value="Singapour">Singapour</option>
                    <option value="Pays-Bas">Pays-Bas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Niveau</label>
                  <select
                    value={filters.packageLevel}
                    onChange={(e) => setFilters({...filters, packageLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Tous niveaux</option>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="premium">Premium</option>
                    <option value="silver">Silver</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compatibilité min: {filters.compatibility}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={filters.compatibility}
                    onChange={(e) => setFilters({...filters, compatibility: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Analyse des profils en cours...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer" 
                        onClick={() => setSelectedMatch(match)}>
                    <CardContent className="p-6">
                      {/* Header avec avatar et compatibilité */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {match.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{match.name}</h3>
                            <p className="text-sm text-slate-500">{match.location}</p>
                          </div>
                        </div>
                        <Badge className={`${getCompatibilityColor(match.compatibility)} font-semibold`}>
                          {match.compatibility}% match
                        </Badge>
                      </div>

                      {/* Badges type et niveau */}
                      <div className="flex gap-2 mb-3">
                        <Badge className={getTypeColor(match.type)}>
                          {getTypeIcon(match.type)}
                          <span className="ml-1 capitalize">{match.type}</span>
                        </Badge>
                        <Badge variant="outline" className={getLevelColor(match.level)}>
                          {match.level.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 mb-4">{match.description}</p>

                      {/* Secteur et intérêts mutuels */}
                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="font-medium">Secteur:</span> {match.sector}
                        </div>
                        {match.mutualInterests && (
                          <div className="text-sm">
                            <span className="font-medium">Intérêts communs:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.mutualInterests.map((interest, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Informations business */}
                      <div className="space-y-2 mb-4 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Potentiel business:</span>
                          <span className={`font-medium ${
                            match.businessPotential === 'Très élevé' ? 'text-green-600' :
                            match.businessPotential === 'Élevé' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {match.businessPotential}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disponibilité:</span>
                          <span className="font-medium">{match.meetingAvailability}</span>
                        </div>
                        {match.budget && (
                          <div className="flex justify-between">
                            <span>Budget:</span>
                            <span className="font-medium">{match.budget}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          RDV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {matches.length === 0 && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune correspondance trouvée
                  </h3>
                  <p className="text-slate-600">
                    Ajustez vos filtres pour découvrir plus d'opportunités de matching
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance du matching</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Compatibilité moyenne</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Matches de qualité</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Taux de réponse</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Recommandation</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Votre profil attire particulièrement les partenaires technologiques. 
                      Mettez en avant vos projets d'innovation.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Tendance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Les discussions sur l'IA et l'automatisation sont en hausse de +45% 
                      parmi vos matches potentiels.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Opportunité</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      3 nouveaux partenaires Platinum recherchent activement des solutions 
                      dans votre secteur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de détail du match */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profil détaillé - {selectedMatch.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMatch(null)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {selectedMatch.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedMatch.name}</h2>
                        <p className="text-slate-600">{selectedMatch.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getTypeColor(selectedMatch.type)}>
                            {getTypeIcon(selectedMatch.type)}
                            <span className="ml-1 capitalize">{selectedMatch.type}</span>
                          </Badge>
                          <Badge className={`${getCompatibilityColor(selectedMatch.compatibility)} font-semibold`}>
                            {selectedMatch.compatibility}% compatible
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div><strong>Secteur:</strong> {selectedMatch.sector}</div>
                      <div><strong>Localisation:</strong> {selectedMatch.location}</div>
                      <div><strong>Langues:</strong> {selectedMatch.languages?.join(', ')}</div>
                      {selectedMatch.budget && <div><strong>Budget:</strong> {selectedMatch.budget}</div>}
                      {selectedMatch.position && <div><strong>Poste:</strong> {selectedMatch.position}</div>}
                    </div>

                    {selectedMatch.socialProof && (
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Données entreprise</h4>
                        <div className="space-y-1 text-sm">
                          <div>👥 {selectedMatch.socialProof.employees}</div>
                          <div>💰 CA: {selectedMatch.socialProof.revenue}</div>
                          <div>🌍 Clients: {selectedMatch.socialProof.clients}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Détails et actions */}
                  <div className="space-y-4">
                    {selectedMatch.interests && (
                      <div>
                        <h4 className="font-semibold mb-2">Centres d'intérêt</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMatch.interests.map((interest, idx) => (
                            <Badge key={idx} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMatch.lookingFor && (
                      <div>
                        <h4 className="font-semibold mb-2">Recherche</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMatch.lookingFor.map((item, idx) => (
                            <Badge key={idx} variant="outline">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMatch.certifications && (
                      <div>
                        <h4 className="font-semibold mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMatch.certifications.map((cert, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-4">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Envoyer un message
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Planifier un rendez-vous
                      </Button>
                      <Button variant="outline" className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter aux contacts
                      </Button>
                    </div>
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

export default AdvancedMatchingSystem;