import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Users, Network, Sparkles, Award, TrendingUp,
  MessageSquare, Calendar, ArrowRight, Eye, CheckCircle, Star,
  Globe, Languages, Building, MapPin, Clock, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchingDemo = () => {
  const [activeFeature, setActiveFeature] = useState('ai-matching');

  const features = [
    {
      id: 'ai-matching',
      title: 'Matching IA Avancé',
      icon: Brain,
      color: 'purple',
      description: 'Algorithme d\'IA basé sur NLP, filtrage collaboratif et apprentissage supervisé',
      highlights: [
        'Compatibilité sectorielle intelligente (30%)',
        'Analyse d\'objectifs commerciaux (25%)',
        'Compatibilité budgétaire (20%)', 
        'Analyse NLP des descriptions (15%)',
        'Facteurs géographiques (10%)'
      ]
    },
    {
      id: 'smart-search',
      title: 'Recherche Sémantique',
      icon: Target,
      color: 'blue',
      description: 'Recherche intelligente par sens et contexte, pas seulement par mots-clés',
      highlights: [
        'Traitement du langage naturel (NLP)',
        'Synonymes et termes associés',
        'Score de pertinence sémantique',
        'Correspondances conceptuelles'
      ]
    },
    {
      id: 'proactive-suggestions',
      title: 'Suggestions Proactives',
      icon: Sparkles,
      color: 'green',
      description: 'L\'IA propose activement des connexions et opportunités basées sur l\'analyse comportementale',
      highlights: [
        'Apprentissage par renforcement',
        'Analyse des interactions utilisateur',
        'Recommandations personnalisées',
        'Optimisation continue'
      ]
    },
    {
      id: 'intelligent-networking',
      title: 'Réseautage Intelligent',
      icon: Network,
      color: 'indigo',
      description: 'Système complet de réseautage avec profils détaillés et gestion intelligente des connexions',
      highlights: [
        'Profils utilisateurs enrichis',
        'Calendrier intégré avec créneaux optimaux',
        'Messagerie avec suggestions de conversation',
        'Gestion des favoris et listes'
      ]
    }
  ];

  const mockResults = {
    'ai-matching': {
      title: 'Résultats de Matching IA',
      items: [
        {
          name: 'Maritime Solutions International',
          compatibility: 95,
          reason: 'Secteur identique + 4 objectifs alignés + budget compatible',
          type: 'Partenaire Platinum',
          location: 'Rotterdam, Pays-Bas'
        },
        {
          name: 'Dr. Sarah Al-Rashid',
          compatibility: 92,
          reason: 'Décideur avec budget élevé + intérêts IA communs',
          type: 'Visiteur VIP',
          location: 'Dubaï, EAU'
        },
        {
          name: 'GreenTech Marine Solutions', 
          compatibility: 88,
          reason: 'Innovation + énergies renouvelables + R&D maritime',
          type: 'Exposant Premium',
          location: 'Brest, France'
        }
      ]
    },
    'smart-search': {
      title: 'Recherche: "IA portuaire automatisation"',
      items: [
        {
          name: 'Digital Harbor Intelligence',
          semanticScore: 94,
          reason: 'Intelligence artificielle + optimisation prédictive + Big Data maritime',
          matchedTerms: ['IA', 'automatisation', 'optimisation', 'maritime']
        },
        {
          name: 'TechMarine Solutions',
          semanticScore: 87,
          reason: 'IoT Maritime + Navigation intelligente + Maintenance prédictive',
          matchedTerms: ['automatisation', 'intelligence', 'maritime', 'IoT']
        }
      ]
    },
    'proactive-suggestions': {
      title: 'Suggestions IA Personnalisées',
      items: [
        {
          type: 'Connexion Prioritaire',
          description: 'Expert en IA maritime disponible maintenant - 96% compatibilité',
          action: 'Se connecter immédiatement',
          urgency: 'high'
        },
        {
          type: 'Opportunité Business',
          description: 'Nouveau projet de 2M€ correspond à votre profil',
          action: 'Consulter le projet',
          urgency: 'medium'
        },
        {
          type: 'Contenu Pertinent',
          description: 'Whitepaper "Future of AI Ports" publié par votre réseau',
          action: 'Lire maintenant',
          urgency: 'low'
        }
      ]
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: 'from-purple-500 to-blue-500',
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-teal-500',
      indigo: 'from-indigo-500 to-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              SIPORTS Matching IA
            </h1>
          </div>
          <p className="text-2xl text-slate-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            Découvrez les fonctionnalités avancées d'intelligence artificielle pour le réseautage maritime, 
            basées sur les spécifications du document technique fourni
          </p>
          <div className="flex justify-center gap-3 mb-8">
            <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">NLP Sémantique</Badge>
            <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">Apprentissage Adaptatif</Badge>
            <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">Recommandations Proactives</Badge>
            <Badge className="bg-indigo-100 text-indigo-800 text-sm px-4 py-2">Profils Enrichis</Badge>
          </div>
        </div>

        {/* Fonctionnalités principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-500 ${
                  isActive 
                    ? 'ring-4 ring-purple-300 shadow-2xl scale-105' 
                    : 'hover:shadow-xl hover:scale-102'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader className={`bg-gradient-to-r ${getColorClasses(feature.color)} text-white rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-sm opacity-90">{feature.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isActive && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600">
                          <Link to="/matching-ai">
                            <Eye className="h-4 w-4 mr-2" />
                            Tester en Live
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/reseautage-ai">
                            <Network className="h-4 w-4 mr-2" />
                            Réseautage IA
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Résultats de démonstration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Démonstration Interactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockResults[activeFeature] && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {mockResults[activeFeature].title}
                </h3>
                
                <div className="grid gap-4">
                  {mockResults[activeFeature].items.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {activeFeature === 'ai-matching' && (
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
                            {item.compatibility}% Compatible
                          </Badge>
                        </div>
                      )}
                      
                      {activeFeature === 'smart-search' && (
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                            {item.semanticScore}% Pertinence
                          </Badge>
                        </div>
                      )}
                      
                      {activeFeature === 'proactive-suggestions' && (
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{item.type}</h4>
                          <Badge className={`${
                            item.urgency === 'high' ? 'bg-red-500' :
                            item.urgency === 'medium' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          } text-white font-bold`}>
                            {item.urgency === 'high' ? 'Urgent' : 
                             item.urgency === 'medium' ? 'Modéré' : 'Info'}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-slate-600 mb-3">{item.reason || item.description}</p>
                      
                      {item.type && activeFeature === 'ai-matching' && (
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {item.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {item.location}
                          </span>
                        </div>
                      )}
                      
                      {item.matchedTerms && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.matchedTerms.map(term => (
                            <Badge key={term} variant="outline" className="text-xs">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {item.action && (
                        <Button size="sm" className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600">
                          {item.action}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spécifications techniques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Algorithmes d'IA Implémentés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Filtrage Collaboratif</h4>
                  <p className="text-sm text-purple-700">Analyse des préférences d'utilisateurs similaires</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Traitement NLP</h4>
                  <p className="text-sm text-blue-700">Analyse sémantique des descriptions et intérêts</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Apprentissage Supervisé</h4>
                  <p className="text-sm text-green-700">Prédiction basée sur l'historique de matching</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-semibold text-indigo-800">Apprentissage par Renforcement</h4>
                  <p className="text-sm text-indigo-700">Optimisation continue via feedback utilisateur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Profils Utilisateurs Enrichis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-slate-800">Informations Professionnelles</h4>
                  <p className="text-sm text-slate-600">Titre, entreprise, secteur, expertise, langues</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-slate-800">Objectifs de Participation</h4>
                  <p className="text-sm text-slate-600">Business goals, recherche de partenaires, type de collaboration</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-slate-800">Disponibilité Intelligente</h4>
                  <p className="text-sm text-slate-600">Créneaux préférés, timezone, préférences de meeting</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="font-semibold text-slate-800">Contenu Multimédia</h4>
                  <p className="text-sm text-slate-600">Vidéos, brochures, présentations, cas clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Découvrez le Matching IA en Action</h2>
            <p className="text-xl mb-6 opacity-90">
              Testez dès maintenant les fonctionnalités avancées de matching et réseautage intelligent
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-slate-100">
                <Link to="/matching-ai">
                  <Brain className="h-5 w-5 mr-2" />
                  Matching IA Avancé
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/reseautage-ai">
                  <Network className="h-5 w-5 mr-2" />
                  Hub Réseautage IA
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer avec conformité */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Conformité RGPD</h4>
                <p className="text-sm text-slate-600">Protection des données personnelles garantie</p>
              </div>
              <div>
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Contrôle de Visibilité</h4>
                <p className="text-sm text-slate-600">Paramètres de confidentialité personnalisables</p>
              </div>
              <div>
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">Expérience Optimisée</h4>
                <p className="text-sm text-slate-600">Interface intuitive et recommandations pertinentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchingDemo;