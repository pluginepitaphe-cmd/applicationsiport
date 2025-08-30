import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, Users, Brain, Zap, TrendingUp, Heart, MessageSquare,
  Calendar, Star, Award, Building, Globe, ArrowRight, Filter,
  Search, ChevronDown, ChevronUp, Eye, UserPlus, Sparkles,
  Network, Briefcase, Handshake, Crown, Gift, Clock, Send,
  BookmarkPlus, Share2, BarChart3, Settings, Camera, Video,
  FileText, Download, MapPin, Linkedin, Mail, Phone, Shield,
  CheckCircle, AlertCircle, TrendingDown, Users2, Compass,
  Lightbulb, Rocket, Cpu, Languages, Calendar1
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Système de Matching et Réseautage IA Avancé - Selon spécifications document
const IntelligentMatchingSystem = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    matchType: 'all', // partners, exhibitors, visitors
    sector: 'all',
    compatibility: 70,
    location: 'all',
    packageLevel: 'all',
    companySize: 'all',
    budget: 'all',
    objectives: 'all',
    language: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('ai-recommendations');
  const [aiInsights, setAiInsights] = useState([]);
  const [personalizedFeed, setPersonalizedFeed] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [connections, setConnections] = useState([]);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Données étendues pour profils détaillés selon spécifications
  const mockProfiles = [
    {
      id: 1,
      type: 'partner',
      name: 'Maritime Solutions International',
      company: 'Maritime Solutions International',
      position: 'CEO',
      level: 'platinum',
      avatar: null,
      coverImage: '/images/maritime-cover1.jpg',
      sector: 'Équipements portuaires',
      location: 'Rotterdam, Pays-Bas',
      companySize: '500-1000',
      description: 'Leader mondial en automatisation portuaire et solutions IoT pour ports intelligents',
      detailedDescription: 'Depuis 1995, Maritime Solutions International développe des technologies révolutionnaires pour la transformation digitale des ports. Nos solutions IA optimisent les opérations portuaires de 40% en moyenne.',
      interests: ['IoT Maritime', 'Automatisation', 'Intelligence artificielle', 'Ports intelligents', 'Blockchain'],
      objectives: ['Distributeurs régionaux', 'Partenaires technologiques', 'Marchés émergents', 'Investisseurs'],
      lookingFor: ['Distributeurs', 'Intégrateurs', 'Clients finaux', 'Partenaires R&D'],
      budget: '500k-2M',
      languages: ['Français', 'Anglais', 'Néerlandais', 'Allemand'],
      compatibility: 95,
      mutualInterests: ['Automatisation', 'IoT', 'Ports intelligents', 'IA'],
      businessPotential: 'Très élevé',
      meetingAvailability: 'Immédiate',
      certifications: ['ISO 9001', 'ISO 14001', 'Maritime MED', 'CE Marking'],
      recentNews: 'Nouveau contrat avec le Port de Rotterdam - 50M€',
      socialProof: {
        employees: '500+',
        revenue: '120M€',
        clients: '80+ ports mondiaux',
        projectsCompleted: '300+',
        marketPresence: '25 pays'
      },
      contactInfo: {
        website: 'maritime-solutions.com',
        email: 'partnerships@maritime-solutions.com',
        phone: '+31 10 234 5678',
        linkedin: 'maritime-solutions-intl',
        address: 'Wilhelminakade 179, Rotterdam'
      },
      mediaContent: [
        { type: 'video', title: 'Présentation Solutions IA', url: '/videos/maritime-ai.mp4' },
        { type: 'brochure', title: 'Catalogue 2024', url: '/docs/catalog-2024.pdf' },
        { type: 'case-study', title: 'Cas client Port de Rotterdam', url: '/docs/case-rotterdam.pdf' }
      ],
      availability: {
        timezone: 'CET',
        preferredMeetingTimes: ['9h-12h', '14h-17h'],
        conferenceSlots: [
          { date: '2024-03-15', time: '14:30', title: 'IA et Automatisation Portuaire', location: 'Hall A - Salle Innovation' }
        ]
      },
      matchingScore: {
        sectorial: 95,
        geographical: 80,
        budget: 90,
        objectives: 88,
        experience: 92
      }
    },
    {
      id: 2,
      type: 'visitor',
      name: 'Dr. Sarah Al-Rashid',
      company: 'Port Authority Dubai',
      position: 'Directrice Innovation & Transformation Digitale',
      level: 'vip',
      avatar: '/images/avatar-sarah.jpg',
      sector: 'Gestion portuaire',
      location: 'Dubaï, EAU',
      companySize: '1000+',
      description: 'Experte reconnue en transformation digitale des infrastructures portuaires',
      detailedDescription: 'Docteur en ingénierie maritime avec 15 ans d\'expérience dans la modernisation des ports. Leader de la transformation digitale du Port de Dubaï, projet de 2 milliards USD.',
      interests: ['Transformation digitale', 'IA portuaire', 'Durabilité', 'Smart Cities', 'Blockchain logistique'],
      objectives: ['Solutions innovantes', 'Partenaires technologiques', 'Benchmarking international', 'Fournisseurs stratégiques'],
      lookingFor: ['Technologies disruptives', 'Partenaires long terme', 'Solutions sur-mesure'],
      budget: '5M+',
      languages: ['Arabe', 'Anglais', 'Français'],
      compatibility: 92,
      mutualInterests: ['IA portuaire', 'Transformation digitale', 'Innovation'],
      businessPotential: 'Exceptionnel',
      meetingAvailability: 'Sur RDV uniquement',
      decisionMaker: true,
      projectTimeline: '3-6 mois',
      expertise: ['Gestion de projets complexes', 'Transformation digitale', 'Innovation maritime'],
      education: 'PhD Maritime Engineering - MIT',
      awards: ['Prix Innovation Portuaire 2023', 'Leader Femme Tech Moyen-Orient'],
      contactInfo: {
        email: 's.alrashid@dubaiport.ae',
        phone: '+971 4 123 4567',
        linkedin: 'sarah-alrashid-port'
      }
    },
    {
      id: 3,
      type: 'exhibitor',
      name: 'GreenTech Marine Solutions',
      company: 'GreenTech Marine Solutions',
      position: 'CTO',
      level: 'premium',
      sector: 'Technologies marines durables',
      location: 'Brest, France',
      companySize: '50-200',
      description: 'Startup innovante spécialisée dans les technologies marines durables',
      detailedDescription: 'Créée en 2020, GreenTech développe des solutions révolutionnaires pour la transition énergétique des ports. Notre technologie d\'éolien flottant a été primée au CES 2024.',
      interests: ['Énergies renouvelables', 'Éolien offshore', 'Hydrogène vert', 'R&D maritime'],
      objectives: ['Levée de fonds Série A', 'Partenaires industriels', 'Clients pilotes', 'Expansion internationale'],
      lookingFor: ['Investisseurs', 'Partenaires R&D', 'Clients early-adopters'],
      budget: '100k-500k',
      languages: ['Français', 'Anglais'],
      compatibility: 88,
      mutualInterests: ['Innovation', 'Énergies renouvelables', 'R&D'],
      businessPotential: 'Très prometteur',
      meetingAvailability: 'Flexible',
      standLocation: 'Hall Innovation - Stand A-15',
      newProduct: 'Système éolien flottant nouvelle génération - FlotWind X1',
      fundingStage: 'Série A - 5M€ recherchés',
      patents: 3,
      prototypes: ['FlotWind X1', 'HydroGen Port', 'CleanAnchor']
    },
    {
      id: 4,
      type: 'partner',
      name: 'Digital Harbor Intelligence',
      company: 'Digital Harbor Intelligence Pte Ltd',
      position: 'VP Business Development',
      level: 'gold',
      sector: 'Intelligence artificielle portuaire',
      location: 'Singapour',
      companySize: '200-500',
      description: 'Plateforme IA leader pour l\'optimisation prédictive des opérations portuaires',
      interests: ['IA prédictive', 'Big Data maritime', 'Optimisation logistique', 'Machine Learning'],
      objectives: ['Expansion européenne', 'Partenaires locaux', 'Intégrations technologiques'],
      lookingFor: ['Ports pilotes Europe', 'Partenaires techniques', 'Distributeurs régionaux'],
      budget: '200k-1M',
      languages: ['Anglais', 'Mandarin', 'Malais'],
      compatibility: 85,
      businessPotential: 'Très élevé',
      meetingAvailability: 'Immédiate',
      techStack: ['Python', 'TensorFlow', 'Azure ML', 'Kubernetes'],
      successStories: [
        'Port de Singapour: +35% efficacité opérationnelle',
        'Port de Hong Kong: -25% temps d\'attente',
        'Port de Busan: +40% prédiction trafic'
      ],
      clients: ['PSA International', 'COSCO Shipping', 'Hutchison Ports']
    }
  ];

  // Algorithme de compatibilité IA avancé selon spécifications
  const calculateAdvancedCompatibility = (profile1, profile2) => {
    let totalScore = 0;
    const factors = [];

    // 1. Compatibilité sectorielle et thématique (30%)
    const sectorialScore = calculateSectorialCompatibility(profile1, profile2);
    totalScore += sectorialScore * 0.30;
    factors.push({ name: 'Sectorial', score: sectorialScore, weight: 30 });

    // 2. Compatibilité des objectifs commerciaux (25%) 
    const objectiveScore = calculateObjectiveCompatibility(profile1, profile2);
    totalScore += objectiveScore * 0.25;
    factors.push({ name: 'Objectifs', score: objectiveScore, weight: 25 });

    // 3. Compatibilité budgétaire (20%)
    const budgetScore = calculateBudgetCompatibility(profile1, profile2);
    totalScore += budgetScore * 0.20;
    factors.push({ name: 'Budget', score: budgetScore, weight: 20 });

    // 4. Analyse NLP des descriptions (15%)
    const nlpScore = calculateNLPCompatibility(profile1, profile2);
    totalScore += nlpScore * 0.15;
    factors.push({ name: 'Sémantique', score: nlpScore, weight: 15 });

    // 5. Facteurs géographiques et logistiques (10%)
    const geoScore = calculateGeographicalScore(profile1, profile2);
    totalScore += geoScore * 0.10;
    factors.push({ name: 'Géographique', score: geoScore, weight: 10 });

    return {
      overall: Math.round(totalScore),
      breakdown: factors,
      recommendations: generateMatchRecommendations(factors)
    };
  };

  const calculateSectorialCompatibility = (p1, p2) => {
    const sectorsCompatibility = {
      'Équipements portuaires': ['Gestion portuaire', 'Technologies marines', 'Automatisation'],
      'Gestion portuaire': ['Équipements portuaires', 'Solutions digitales', 'IA portuaire'],
      'Technologies marines durables': ['Énergies renouvelables', 'Innovation', 'R&D maritime']
    };

    if (p1.sector === p2.sector) return 100;
    
    const compatibleSectors = sectorsCompatibility[p1.sector] || [];
    if (compatibleSectors.includes(p2.sector)) return 85;
    
    // Analyse des intérêts mutuels
    const commonInterests = (p1.interests || []).filter(interest => 
      (p2.interests || []).some(i => i.toLowerCase().includes(interest.toLowerCase()))
    );
    
    return Math.min(90, Math.max(40, commonInterests.length * 15));
  };

  const calculateObjectiveCompatibility = (p1, p2) => {
    const p1Objectives = p1.objectives || p1.lookingFor || [];
    const p2Offers = generateOfferingsFromProfile(p2);
    
    let matches = 0;
    p1Objectives.forEach(objective => {
      if (p2Offers.some(offer => 
        offer.toLowerCase().includes(objective.toLowerCase()) ||
        objective.toLowerCase().includes(offer.toLowerCase())
      )) {
        matches++;
      }
    });
    
    return Math.min(100, matches * 25);
  };

  const calculateBudgetCompatibility = (p1, p2) => {
    const budgetRanges = {
      '0-50k': 1, '50k-200k': 2, '200k-500k': 3, 
      '500k-1M': 4, '1M-5M': 5, '5M+': 6
    };
    
    const b1 = budgetRanges[p1.budget] || 3;
    const b2 = budgetRanges[p2.budget] || 3;
    const diff = Math.abs(b1 - b2);
    
    return Math.max(60, 100 - (diff * 10));
  };

  const calculateNLPCompatibility = (p1, p2) => {
    const text1 = `${p1.description} ${(p1.interests || []).join(' ')}`.toLowerCase();
    const text2 = `${p2.description} ${(p2.interests || []).join(' ')}`.toLowerCase();
    
    const keywords1 = extractKeywords(text1);
    const keywords2 = extractKeywords(text2);
    
    const commonKeywords = keywords1.filter(k => keywords2.includes(k));
    const uniqueKeywords = new Set([...keywords1, ...keywords2]).size;
    
    return Math.round((commonKeywords.length / uniqueKeywords) * 100);
  };

  const calculateGeographicalScore = (p1, p2) => {
    const regions = {
      'Europe': ['France', 'Pays-Bas', 'Allemagne', 'Espagne'],
      'Moyen-Orient': ['EAU', 'Qatar', 'Arabie Saoudite'],
      'Asie': ['Singapour', 'Malaisie', 'Chine', 'Japon']
    };
    
    const getRegion = (location) => {
      for (const [region, countries] of Object.entries(regions)) {
        if (countries.some(country => location.includes(country))) {
          return region;
        }
      }
      return 'Autre';
    };
    
    const region1 = getRegion(p1.location || '');
    const region2 = getRegion(p2.location || '');
    
    if (region1 === region2) return 90;
    if (region1 !== 'Autre' && region2 !== 'Autre') return 70;
    return 50;
  };

  // Générateur de recommandations IA
  const generateMatchRecommendations = (factors) => {
    const recommendations = [];
    
    factors.forEach(factor => {
      if (factor.score < 70) {
        switch(factor.name) {
          case 'Sectorial':
            recommendations.push('Mettez en avant les synergies possibles entre vos secteurs');
            break;
          case 'Objectifs':
            recommendations.push('Clarifiez vos objectifs mutuels lors du premier contact');
            break;
          case 'Budget':
            recommendations.push('Discutez des modalités de financement et des budgets disponibles');
            break;
        }
      }
    });
    
    return recommendations;
  };

  // Utilitaires NLP simplifiés
  const extractKeywords = (text) => {
    const stopWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'mais', 'dans', 'sur', 'avec', 'pour'];
    return text.split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 20);
  };

  const generateOfferingsFromProfile = (profile) => {
    const offerings = [];
    if (profile.type === 'partner' || profile.type === 'exhibitor') {
      offerings.push('Solutions technologiques', 'Expertise', 'Partenariats');
    }
    if (profile.type === 'visitor' && profile.position?.includes('Directeur')) {
      offerings.push('Opportunités business', 'Projets', 'Investissements');
    }
    return offerings;
  };

  // Génération de recommandations proactives IA
  const generateAIRecommendations = () => {
    const currentUserProfile = {
      interests: user?.interests?.split(',') || ['Automatisation', 'IoT'],
      sector: user?.sector || 'Gestion portuaire',
      level: user?.visitor_package || user?.partnership_package || 'premium',
      type: user?.user_type || 'visitor'
    };

    const recommendations = mockProfiles.map(profile => ({
      ...profile,
      ...calculateAdvancedCompatibility(currentUserProfile, profile),
      aiReason: generateAIReasoning(currentUserProfile, profile)
    })).filter(rec => rec.overall >= filters.compatibility)
    .sort((a, b) => b.overall - a.overall);

    setMatches(recommendations);
    generatePersonalizedInsights(recommendations);
  };

  const generateAIReasoning = (userProfile, match) => {
    const reasons = [];
    
    if (match.overall >= 90) {
      reasons.push(`🎯 Match exceptionnel basé sur ${match.breakdown[0].name.toLowerCase()}`);
    }
    
    if (match.mutualInterests?.length > 2) {
      reasons.push(`🤝 ${match.mutualInterests.length} intérêts communs détectés`);
    }
    
    if (match.businessPotential === 'Très élevé') {
      reasons.push(`💼 Potentiel business élevé identifié par l'IA`);
    }
    
    return reasons.slice(0, 2).join(' • ');
  };

  const generatePersonalizedInsights = (matches) => {
    const insights = [];
    
    const topMatches = matches.slice(0, 3);
    const sectors = [...new Set(topMatches.map(m => m.sector))];
    
    insights.push({
      type: 'trend',
      icon: TrendingUp,
      title: 'Tendance détectée',
      message: `${sectors.length} secteurs émergents correspondent à votre profil`,
      color: 'green'
    });
    
    const highPotential = matches.filter(m => m.businessPotential === 'Très élevé').length;
    if (highPotential > 0) {
      insights.push({
        type: 'opportunity',
        icon: Rocket,
        title: 'Opportunité majeure',
        message: `${highPotential} partenaires à fort potentiel disponibles immédiatement`,
        color: 'blue'
      });
    }
    
    setAiInsights(insights);
  };

  // Fil d'actualité personnalisé par IA
  const generatePersonalizedFeed = () => {
    const feedItems = [
      {
        id: 1,
        type: 'company_update',
        author: 'Maritime Solutions International',
        timestamp: '2 heures',
        content: 'Lancement de notre nouvelle solution IA pour la prédiction de trafic portuaire. +40% de précision vs. méthodes traditionnelles.',
        tags: ['IA', 'Innovation', 'Prédiction'],
        engagement: { likes: 34, comments: 7, shares: 12 },
        relevanceScore: 95
      },
      {
        id: 2,
        type: 'conference_announcement',
        author: 'SIPORTS Organisation',
        timestamp: '4 heures',
        content: 'Nouvelle session ajoutée: "IA et Automatisation Portuaire" - Dr. Sarah Al-Rashid, 15 mars 14h30',
        tags: ['Conférence', 'IA', 'Automatisation'],
        engagement: { likes: 18, comments: 3, shares: 8 },
        relevanceScore: 88
      }
    ];
    
    setPersonalizedFeed(feedItems.sort((a, b) => b.relevanceScore - a.relevanceScore));
  };

  // Hooks et effects
  useEffect(() => {
    generateAIRecommendations();
    generatePersonalizedFeed();
  }, [filters, user]);

  // Interface de configuration de profil avancé
  const ProfileSetupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration de profil avancé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Informations professionnelles</h3>
              <Input placeholder="Titre/Poste" />
              <Input placeholder="Entreprise" />
              <Textarea placeholder="Description de votre activité" rows={3} />
              <Input placeholder="Site web" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Objectifs de participation</h3>
              <div className="space-y-2">
                {['Recherche de partenaires', 'Développement commercial', 'Veille technologique', 'Recrutement'].map(obj => (
                  <label key={obj} className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>{obj}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Centres d'intérêt</h3>
              <div className="flex flex-wrap gap-2">
                {['IA', 'IoT', 'Blockchain', 'Durabilité', 'Automatisation', 'Big Data'].map(interest => (
                  <Badge key={interest} variant="outline" className="cursor-pointer hover:bg-blue-100">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Paramètres de matching</h3>
              <div>
                <label>Budget disponible</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>0 - 50k€</option>
                  <option>50k - 200k€</option>
                  <option>200k - 500k€</option>
                  <option>500k - 1M€</option>
                  <option>1M€+</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowProfileSetup(false)}>
              Annuler
            </Button>
            <Button onClick={() => setShowProfileSetup(false)}>
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header amélioré */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Système de Matching IA Avancé
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-4">
            Intelligence artificielle de nouvelle génération pour un réseautage maritime intelligent
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-800">NLP Sémantique</Badge>
            <Badge className="bg-blue-100 text-blue-800">Apprentissage Adaptatif</Badge>
            <Badge className="bg-purple-100 text-purple-800">Recommandations Proactives</Badge>
          </div>
        </div>

        {/* Navigation étendue */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex bg-white rounded-xl shadow-lg p-1 min-w-max">
            {[
              { id: 'ai-recommendations', icon: Brain, label: 'Recommandations IA' },
              { id: 'advanced-search', icon: Search, label: 'Recherche Avancée' },
              { id: 'network', icon: Network, label: 'Mon Réseau' },
              { id: 'feed', icon: TrendingUp, label: 'Fil Personnalisé' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'profile', icon: Settings, label: 'Profil' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
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

        {/* Filters avancés pour IA */}
        {(activeTab === 'ai-recommendations' || activeTab === 'advanced-search') && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de matching intelligents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Filtres existants + nouveaux */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={filters.matchType}
                    onChange={(e) => setFilters({...filters, matchType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tous secteurs</option>
                    <option value="Équipements portuaires">Équipements portuaires</option>
                    <option value="Gestion portuaire">Gestion portuaire</option>
                    <option value="Technologies marines">Technologies marines</option>
                    <option value="IA portuaire">IA portuaire</option>
                    <option value="Énergies renouvelables">Énergies renouvelables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Taille entreprise</label>
                  <select
                    value={filters.companySize}
                    onChange={(e) => setFilters({...filters, companySize: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Toutes tailles</option>
                    <option value="1-50">Startup (1-50)</option>
                    <option value="50-200">PME (50-200)</option>
                    <option value="200-500">Moyenne (200-500)</option>
                    <option value="500+">Grande (500+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <select
                    value={filters.budget}
                    onChange={(e) => setFilters({...filters, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tous budgets</option>
                    <option value="0-50k">0 - 50k€</option>
                    <option value="50k-200k">50k - 200k€</option>
                    <option value="200k-1M">200k - 1M€</option>
                    <option value="1M+">1M€+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Langue</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Toutes langues</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Arabe">Arabe</option>
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
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contenu des onglets */}
        {/* Tab Recommandations IA */}
        {activeTab === 'ai-recommendations' && (
          <div className="space-y-8">
            {/* Insights IA en temps réel */}
            {aiInsights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, idx) => {
                  const Icon = insight.icon;
                  return (
                    <Card key={idx} className={`border-l-4 border-l-${insight.color}-500 bg-gradient-to-r from-${insight.color}-50 to-white`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 text-${insight.color}-600`} />
                          <div>
                            <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                            <p className="text-sm text-slate-600">{insight.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Analyse IA en cours...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg" 
                        onClick={() => setSelectedMatch(match)}>
                    <CardContent className="p-0">
                      {/* Header avec image de couverture */}
                      <div className="h-32 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`font-bold text-xs ${
                            match.overall >= 90 ? 'bg-green-500' :
                            match.overall >= 80 ? 'bg-blue-500' :
                            'bg-yellow-500'
                          } text-white`}>
                            {match.overall}% compatible
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-purple-600 shadow-lg">
                            {match.name.charAt(0)}
                          </div>
                          <div className="text-white">
                            <h3 className="font-bold">{match.company || match.name}</h3>
                            <p className="text-sm opacity-90">{match.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Badges et niveau */}
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={`${
                            match.type === 'partner' ? 'bg-yellow-100 text-yellow-800' :
                            match.type === 'exhibitor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {match.type === 'partner' ? '👑 Partenaire' :
                             match.type === 'exhibitor' ? '🏢 Exposant' : '👤 Visiteur'}
                          </Badge>
                          <Badge variant="outline" className="font-semibold">
                            {match.level?.toUpperCase()}
                          </Badge>
                          {match.decisionMaker && <Badge className="bg-red-100 text-red-800">💼 Décideur</Badge>}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 line-clamp-2">{match.description}</p>

                        {/* Raison IA */}
                        {match.aiReason && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                              <p className="text-sm text-purple-700">{match.aiReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Détails de compatibilité */}
                        <div className="space-y-2">
                          {match.breakdown?.slice(0, 3).map((factor, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-600">{factor.name}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={factor.score} className="w-16 h-1" />
                                <span className="font-medium">{factor.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Intérêts mutuels */}
                        {match.mutualInterests && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-2">Intérêts communs:</p>
                            <div className="flex flex-wrap gap-1">
                              {match.mutualInterests.slice(0, 3).map((interest, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Métriques business */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="text-slate-500">Potentiel</p>
                            <p className={`font-semibold ${
                              match.businessPotential === 'Exceptionnel' ? 'text-purple-600' :
                              match.businessPotential === 'Très élevé' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                              {match.businessPotential?.split(' ')[0]}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Disponibilité</p>
                            <p className="font-semibold text-slate-700">
                              {match.meetingAvailability?.split(' ')[0]}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Budget</p>
                            <p className="font-semibold text-slate-700">{match.budget}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            RDV
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Fil personnalisé */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Fil d'actualité personnalisé par IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personalizedFeed.map(item => (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{item.author}</span>
                          <span className="text-sm text-slate-500">• {item.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            IA Score: {item.relevanceScore}%
                          </Badge>
                        </div>
                        <p className="text-slate-700 mb-3">{item.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>👍 {item.engagement.likes}</span>
                            <span>💬 {item.engagement.comments}</span>
                            <span>🔄 {item.engagement.shares}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance du matching IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Précision des recommandations</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <Progress value={94} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Taux de connexion réussie</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Satisfaction utilisateur</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Insights de votre réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Recommandation stratégique</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Votre profil attire 2.3x plus de partenaires technologiques que la moyenne. 
                    Optimisez vos créneaux de disponibilité.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Tendance de marché</span>
                  </div>
                  <p className="text-sm text-green-700">
                    +67% d'intérêt pour l'IA portuaire ce mois. 5 nouveaux acteurs majeurs 
                    rejoignent le secteur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de profil détaillé */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                      {selectedMatch.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMatch.company || selectedMatch.name}</h2>
                      <p className="text-purple-100">{selectedMatch.position} • {selectedMatch.location}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMatch(null)} className="text-white hover:bg-white/20">
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Colonne principale */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Score de compatibilité détaillé */}
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          Analyse de compatibilité IA
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {selectedMatch.breakdown?.map((factor, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{factor.score}%</div>
                              <div className="text-sm text-slate-600">{factor.name}</div>
                              <Progress value={factor.score} className="mt-2 h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Description détaillée */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3">À propos</h3>
                        <p className="text-slate-700 leading-relaxed">
                          {selectedMatch.detailedDescription || selectedMatch.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Intérêts et objectifs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Compass className="h-4 w-4" />
                            Centres d'intérêt
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedMatch.interests?.map((interest, idx) => (
                              <Badge key={idx} variant="secondary">{interest}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Objectifs
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedMatch.objectives?.map((obj, idx) => (
                              <Badge key={idx} variant="outline">{obj}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Contenu multimédia */}
                    {selectedMatch.mediaContent && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Contenu et ressources
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {selectedMatch.mediaContent.map((media, idx) => (
                              <div key={idx} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  {media.type === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                                  {media.type === 'brochure' && <FileText className="h-4 w-4 text-green-600" />}
                                  {media.type === 'case-study' && <Award className="h-4 w-4 text-purple-600" />}
                                  <span className="font-medium text-sm">{media.title}</span>
                                </div>
                                <Button size="sm" variant="outline" className="w-full">
                                  <Download className="h-3 w-3 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Colonne latérale */}
                  <div className="space-y-6">
                    {/* Actions rapides */}
                    <Card>
                      <CardContent className="p-6 space-y-3">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Envoyer un message
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Planifier un RDV
                        </Button>
                        <Button variant="outline" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajouter au réseau
                        </Button>
                        <Button variant="outline" className="w-full">
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Informations de contact */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3">Contact</h3>
                        <div className="space-y-2 text-sm">
                          {selectedMatch.contactInfo?.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <span>{selectedMatch.contactInfo.email}</span>
                            </div>
                          )}
                          {selectedMatch.contactInfo?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <span>{selectedMatch.contactInfo.phone}</span>
                            </div>
                          )}
                          {selectedMatch.contactInfo?.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-500" />
                              <span>{selectedMatch.contactInfo.website}</span>
                            </div>
                          )}
                          {selectedMatch.contactInfo?.linkedin && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4 text-slate-500" />
                              <span>{selectedMatch.contactInfo.linkedin}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Données entreprise */}
                    {selectedMatch.socialProof && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-bold mb-3">Entreprise</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Employés:</span>
                              <span className="font-medium">{selectedMatch.socialProof.employees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CA:</span>
                              <span className="font-medium">{selectedMatch.socialProof.revenue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Clients:</span>
                              <span className="font-medium">{selectedMatch.socialProof.clients}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Disponibilité */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Disponibilité
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{selectedMatch.meetingAvailability}</span>
                          </div>
                          {selectedMatch.availability?.preferredMeetingTimes && (
                            <div>
                              <span className="font-medium">Créneaux préférés:</span>
                              <div className="ml-4 text-slate-600">
                                {selectedMatch.availability.preferredMeetingTimes.join(', ')}
                              </div>
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

        {showProfileSetup && <ProfileSetupModal />}
      </div>
    </div>
  );
};

export default IntelligentMatchingSystem;