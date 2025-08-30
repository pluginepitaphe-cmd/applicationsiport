import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Globe, Mail, Phone, MapPin, Star, Users, Award, Calendar, 
  Home, Info, Package, FolderOpen, MessageCircle, Download, FileText, 
  Image, Video, ExternalLink, Building, ShoppingCart, Truck, Shield, 
  Zap, Eye, Search, Filter, Play, ChevronRight, ChevronLeft, Linkedin,
  Twitter, Facebook, Instagram, Youtube, Clock, Target, TrendingUp,
  CheckCircle, Camera, Lightbulb, Share, BookOpen, Heart, Send,
  Archive, History, Settings
} from 'lucide-react';

const EnhancedExhibitorMiniSite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '', email: '', company: '', message: '', type: 'information'
  });

  // Enhanced exhibitor data with comprehensive information
  const exhibitors = {
    'maritime-tech-solutions': {
      id: 'maritime-tech-solutions',
      name: 'Maritime Tech Solutions',
      tagline: 'Révolutionner l\'avenir maritime grâce à l\'innovation technologique',
      category: 'Technologie Maritime',
      icon: '⚓',
      description: 'Solutions technologiques innovantes pour l\'industrie maritime et portuaire.',
      fullDescription: 'Maritime Tech Solutions est un leader mondial dans le développement de technologies avancées pour l\'industrie maritime. Depuis 2010, nous concevons et déployons des solutions numériques qui révolutionnent les opérations portuaires, la navigation maritime et la gestion logistique.',
      
      // Company details
      location: 'Rotterdam, Pays-Bas',
      phone: '+31 10 123 4567',
      email: 'contact@maritimetech.nl',
      website: 'www.maritimetech.nl',
      
      // Stand information
      standNumber: 'A-125',
      pavilion: 'Pavillon Technologie',
      
      // Key metrics
      specialties: ['IoT Maritime', 'Intelligence Artificielle', 'Blockchain', 'Automatisation'],
      rating: 4.8,
      employees: '250+',
      founded: '2010',
      revenue: '€45M+',
      clientsServed: '150+ ports équipés',
      
      // Visual assets
      logo: '/images/maritime-solutions-logo.png',
      coverImage: '/images/siports-hero.jpg',
      
      // Company timeline for histoire section
      timeline: [
        {
          year: '2010',
          title: 'Création de Maritime Tech Solutions',
          description: 'Fondation à Rotterdam avec une équipe de 5 experts maritimes',
          milestone: true
        },
        {
          year: '2012',
          title: 'Premier contrat majeur',
          description: 'Déploiement réussi au Port d\'Amsterdam',
          milestone: false
        },
        {
          year: '2015',
          title: 'Expansion internationale',
          description: 'Ouverture de bureaux à Singapour et Dubaï',
          milestone: true
        },
        {
          year: '2018',
          title: 'Innovation IA',
          description: 'Lancement de PortOptimizer AI, première solution IA du marché',
          milestone: true
        },
        {
          year: '2020',
          title: 'Certification ISO 27001',
          description: 'Obtention de la certification sécurité des données',
          milestone: false
        },
        {
          year: '2023',
          title: 'Prix Innovation Maritime',
          description: 'Reconnaissance internationale pour nos solutions durables',
          milestone: true
        }
      ],

      // Team profiles
      team: [
        {
          name: 'Dr. Henrik Larsen',
          position: 'CEO & Co-fondateur',
          bio: '25 ans d\'expérience en ingénierie maritime. Ancien directeur technique du Port de Rotterdam.',
          expertise: ['Leadership stratégique', 'Innovation maritime', 'Transformation digitale'],
          image: '/images/team-henrik.jpg',
          linkedin: 'henrik-larsen-maritime'
        },
        {
          name: 'Maria Santos',
          position: 'CTO',
          bio: 'Experte en IA et systèmes distribués. Diplômée MIT, spécialiste des ports intelligents.',
          expertise: ['Intelligence Artificielle', 'Architecture système', 'IoT industriel'],
          image: '/images/team-maria.jpg',
          linkedin: 'maria-santos-tech'
        },
        {
          name: 'Jean-Claude Dubois',
          position: 'Directeur Commercial',
          bio: '20 ans dans le secteur portuaire. Ancien VP Commercial chez Maersk.',
          expertise: ['Développement commercial', 'Relations clients', 'Stratégie marché'],
          image: '/images/team-jean.jpg',
          linkedin: 'jc-dubois-maritime'
        }
      ],

      // Values and commitments
      values: [
        {
          title: 'Innovation Responsable',
          description: 'Développer des technologies qui respectent l\'environnement marin',
          icon: Lightbulb,
          actions: ['R&D durable', 'Partenariats éco-responsables', 'Solutions green-tech']
        },
        {
          title: 'Excellence Opérationnelle',
          description: 'Garantir la qualité et la fiabilité de nos solutions',
          icon: Target,
          actions: ['Certification ISO 9001', 'Tests rigoureux', 'Amélioration continue']
        },
        {
          title: 'Collaboration',
          description: 'Travailler en partenariat avec nos clients et partenaires',
          icon: Users,
          actions: ['Co-développement', 'Formation client', 'Support 24/7']
        }
      ],

      // Certifications
      certifications: [
        {
          name: 'ISO 27001',
          description: 'Sécurité de l\'information',
          year: '2023',
          logo: '/images/cert-iso27001.png'
        },
        {
          name: 'ISO 9001',
          description: 'Management de la qualité',
          year: '2022',
          logo: '/images/cert-iso9001.png'
        },
        {
          name: 'SOC 2 Type II',
          description: 'Sécurité des données cloud',
          year: '2024',
          logo: '/images/cert-soc2.png'
        }
      ],

      // Products with enhanced details
      products: [
        {
          id: 'smartport-platform',
          name: 'SmartPort Platform',
          category: 'Logiciel',
          description: 'Plateforme de gestion portuaire intelligente avec IA intégrée',
          detailedDescription: 'La plateforme SmartPort révolutionne la gestion portuaire en intégrant l\'intelligence artificielle, l\'IoT et l\'analytics avancé pour optimiser toutes les opérations.',
          price: 'Sur devis',
          image: '/images/smart-port-system.jpg',
          features: ['Gestion en temps réel', 'Prédictions IA', 'Interface intuitive', 'API complète'],
          specifications: {
            'Compatibilité': 'Cloud/On-premise',
            'Intégration': 'API REST + GraphQL',
            'Performance': 'Jusqu\'à 10M transactions/jour',
            'Support': '24/7 multilingue'
          },
          gallery: [
            '/images/smartport-dashboard.jpg',
            '/images/smartport-analytics.jpg',
            '/images/smartport-mobile.jpg'
          ],
          documents: [
            { name: 'Fiche technique', url: '/docs/smartport-tech.pdf', size: '2.5MB' },
            { name: 'Guide utilisateur', url: '/docs/smartport-guide.pdf', size: '8.2MB' }
          ]
        },
        {
          id: 'naviguard-system',
          name: 'NaviGuard System',
          category: 'Sécurité',
          description: 'Système de surveillance maritime avancé avec détection automatique',
          detailedDescription: 'NaviGuard combine radar, caméras thermiques et IA pour une surveillance maritime 24/7 avec alertes automatiques.',
          price: '€45,000',
          image: '/images/maritime-safety.jpg',
          features: ['Détection radar', 'Vision nocturne', 'Alertes automatiques', 'Intégration satellite'],
          specifications: {
            'Portée radar': 'Jusqu\'à 50km',
            'Précision GPS': '< 1 mètre',
            'Température': '-40°C à +85°C',
            'Certification': 'IMO SOLAS compliant'
          },
          gallery: [
            '/images/naviguard-radar.jpg',
            '/images/naviguard-control.jpg',
            '/images/naviguard-night.jpg'
          ]
        },
        {
          id: 'cargotrack-iot',
          name: 'CargoTrack IoT',
          category: 'Logistique',
          description: 'Solution de traçabilité des conteneurs avec capteurs IoT',
          detailedDescription: 'CargoTrack assure le suivi en temps réel des conteneurs avec capteurs environnementaux et géolocalisation précise.',
          price: '€12,500',
          image: '/images/iot-sensors.jpg',
          features: ['Géolocalisation GPS', 'Capteurs environnementaux', 'Alertes temps réel', 'Dashboard web'],
          specifications: {
            'Batterie': '10 ans autonomie',
            'Connectivité': '4G/5G + LoRaWAN',
            'Capteurs': 'T°, humidité, chocs, ouverture',
            'Étanchéité': 'IP67'
          }
        },
        {
          id: 'portoptimizer-ai',
          name: 'PortOptimizer AI',
          category: 'Intelligence Artificielle',
          description: 'Optimisation des opérations portuaires par intelligence artificielle',
          detailedDescription: 'PortOptimizer AI utilise l\'apprentissage automatique pour prédire et optimiser les flux portuaires en temps réel.',
          price: 'Sur devis',
          image: '/images/port-authority.jpg',
          features: ['Optimisation des flux', 'Prédiction de trafic', 'Réduction des coûts', 'Reporting avancé'],
          specifications: {
            'Algorithmes': 'ML + Deep Learning',
            'Prédictions': '7 jours en avance',
            'Optimisation': 'Jusqu\'à 35% d\'efficacité',
            'Temps réel': '< 100ms latence'
          }
        }
      ],

      // Services
      services: [
        {
          title: 'Consulting Maritime',
          description: 'Conseil stratégique pour la transformation digitale des ports',
          icon: '🎯',
          duration: '3-6 mois',
          price: 'À partir de €25,000',
          deliverables: ['Audit digital', 'Roadmap technologique', 'Plan d\'implémentation']
        },
        {
          title: 'Intégration Système',
          description: 'Intégration complète de nos solutions dans votre infrastructure',
          icon: '🔧',
          duration: '2-4 mois',
          price: 'À partir de €15,000',
          deliverables: ['Installation', 'Configuration', 'Tests', 'Formation']
        },
        {
          title: 'Formation & Support',
          description: 'Formation des équipes et support technique 24/7',
          icon: '🎓',
          duration: 'Continu',
          price: 'À partir de €5,000/an',
          deliverables: ['Formation initiale', 'Support 24/7', 'Mises à jour', 'Documentation']
        }
      ],

      // Recent projects
      projects: [
        {
          name: 'Port Autonome de Rotterdam',
          description: 'Déploiement de la plateforme SmartPort sur l\'ensemble du port',
          status: 'En cours',
          completion: '2025',
          budget: '€12M',
          image: '/images/smart-port-system.jpg',
          client: 'Port of Rotterdam Authority'
        },
        {
          name: 'Terminal Conteneurs Anvers',
          description: 'Système de traçabilité IoT pour 500,000 conteneurs/an',
          status: 'Terminé',
          completion: '2024',
          budget: '€3.5M',
          image: '/images/iot-sensors.jpg',
          client: 'Port of Antwerp'
        }
      ],

      // News and updates
      news: [
        {
          title: 'Nouveau contrat avec le Port de Hambourg',
          date: '2024-07-18',
          category: 'Contrats',
          summary: 'Maritime Tech Solutions déploiera sa solution SmartPort sur le 3ème plus grand port d\'Europe.',
          image: '/images/news-hamburg.jpg',
          content: 'Nous sommes fiers d\'annoncer notre partenariat avec le Port de Hambourg pour le déploiement de notre plateforme SmartPort...'
        },
        {
          title: 'Prix Innovation Maritime 2024',
          date: '2024-07-12',
          category: 'Prix',
          summary: 'Notre solution PortOptimizer AI remporte le prix de l\'innovation technologique.',
          image: '/images/news-award.jpg',
          content: 'PortOptimizer AI a été reconnu comme la solution la plus innovante de l\'année par l\'Association Maritime Internationale...'
        }
      ],

      // Gallery with categories
      gallery: {
        products: [
          { url: '/images/product-1.jpg', title: 'SmartPort Dashboard', description: 'Interface principale de gestion' },
          { url: '/images/product-2.jpg', title: 'NaviGuard Control Center', description: 'Centre de contrôle sécurisé' },
          { url: '/images/product-3.jpg', title: 'CargoTrack Sensors', description: 'Capteurs IoT en action' }
        ],
        installations: [
          { url: '/images/install-1.jpg', title: 'Port de Rotterdam', description: 'Installation SmartPort' },
          { url: '/images/install-2.jpg', title: 'Terminal Anvers', description: 'Déploiement IoT' }
        ],
        team: [
          { url: '/images/team-1.jpg', title: 'Équipe R&D', description: 'Nos ingénieurs au travail' },
          { url: '/images/team-2.jpg', title: 'Support Client', description: 'Formation sur site' }
        ]
      },

      // Contact information
      contacts: {
        general: {
          name: 'Accueil général',
          email: 'contact@maritimetech.nl',
          phone: '+31 10 123 4567'
        },
        sales: {
          name: 'Jean-Claude Dubois',
          role: 'Directeur Commercial',
          email: 'sales@maritimetech.nl',
          phone: '+31 10 123 4568'
        },
        support: {
          name: 'Support Technique',
          email: 'support@maritimetech.nl',
          phone: '+31 10 123 4569'
        }
      },

      // Social media
      social: {
        linkedin: 'maritime-tech-solutions',
        twitter: '@MaritimeTechNL',
        facebook: 'MaritimeTechSolutions',
        youtube: 'MaritimeTechSolutions'
      }
    }
  };

  const exhibitor = exhibitors[id];

  if (!exhibitor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exposant non trouvé</h1>
          <Button onClick={() => navigate('/exposants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux exposants
          </Button>
        </div>
      </div>
    );
  }

  // Navigation menu items with enhanced structure
  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'apropos', label: 'À propos', icon: Info },
    { id: 'produits', label: 'Produits & Services', icon: Package },
    { id: 'projets', label: 'Projets', icon: FolderOpen },
    { id: 'actualites', label: 'Actualités', icon: FileText },
    { id: 'galerie', label: 'Galerie', icon: Image },
    { id: 'contact', label: 'Contact', icon: MessageCircle }
  ];

  // Filter products based on search and category
  const filteredProducts = exhibitor.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Here you would normally send the data to an API
    alert('Message envoyé avec succès !');
    setContactForm({ name: '', email: '', company: '', message: '', type: 'information' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and company name */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/exposants')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{exhibitor.icon}</div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">{exhibitor.name}</h1>
                  <p className="text-sm text-gray-600">{exhibitor.tagline}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Nous contacter
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-4">
            <div className="flex space-x-1 overflow-x-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 min-w-fit ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Accueil Section */}
        {activeTab === 'accueil' && (
          <div className="space-y-12">
            {/* Hero Section Enhanced */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={exhibitor.coverImage} 
                alt={exhibitor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-800/70 to-blue-600/60">
                <div className="h-full flex items-center justify-center text-center text-white p-8">
                  <div className="max-w-4xl">
                    <div className="flex items-center justify-center space-x-6 mb-8">
                      <div className="text-8xl animate-pulse">{exhibitor.icon}</div>
                      <div>
                        <h1 className="text-6xl font-bold mb-4">{exhibitor.name}</h1>
                        <p className="text-2xl text-blue-100 mb-6">{exhibitor.tagline}</p>
                        <div className="flex items-center justify-center space-x-6 text-lg">
                          <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                            {exhibitor.pavilion}
                          </Badge>
                          <span className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Stand {exhibitor.standNumber}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-400" />
                            {exhibitor.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                        <Package className="w-5 h-5 mr-2" />
                        Découvrir nos produits
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        <Download className="w-5 h-5 mr-2" />
                        Télécharger notre catalogue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, value: exhibitor.employees, label: 'Employés', color: 'blue' },
                { icon: Calendar, value: exhibitor.founded, label: 'Année de création', color: 'green' },
                { icon: Building, value: exhibitor.revenue, label: 'Chiffre d\'affaires', color: 'purple' },
                { icon: Award, value: exhibitor.clientsServed, label: 'Références', color: 'orange' }
              ].map((metric, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <metric.icon className={`w-8 h-8 text-${metric.color}-600 mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Products Preview */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Nos Solutions Phares</CardTitle>
                <CardDescription>Découvrez nos produits les plus innovants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitor.products.slice(0, 3).map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-all cursor-pointer">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">{product.price}</span>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir plus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Latest News */}
            <Card>
              <CardHeader>
                <CardTitle>Actualités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exhibitor.news.slice(0, 2).map((article, index) => (
                    <div key={index} className="flex space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">{article.category}</Badge>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                        <div className="text-xs text-gray-500">{article.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* À propos Section */}
        {activeTab === 'apropos' && (
          <div className="space-y-12">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-6 w-6" />
                  Notre Histoire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {exhibitor.fullDescription}
                  </p>
                </div>

                {/* Interactive Timeline */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Étapes Clés de Notre Développement</h3>
                  <div className="relative">
                    {exhibitor.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-6 pb-8">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            event.milestone ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {event.milestone ? <Award className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {event.year}
                            </span>
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                          </div>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Profiles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Notre Équipe Dirigeante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {exhibitor.team.map((member, index) => (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                        <p className="text-blue-600 mb-3">{member.position}</p>
                        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {member.expertise.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Linkedin className="w-4 h-4 mr-2" />
                          Voir le profil
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Values and Commitments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Nos Valeurs & Engagements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {exhibitor.values.map((value, index) => (
                    <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                      <p className="text-gray-600 mb-4">{value.description}</p>
                      <ul className="space-y-2">
                        {value.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Certifications & Labels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {exhibitor.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Award className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                        <p className="text-xs text-gray-500">Obtenu en {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Section with Advanced Filtering */}
        {activeTab === 'produits' && (
          <div className="space-y-8">
            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Toutes catégories</option>
                    <option value="Logiciel">Logiciels</option>
                    <option value="Sécurité">Sécurité</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Intelligence Artificielle">IA</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="font-bold text-lg text-blue-600">{product.price}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  Nos Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {exhibitor.services.map((service, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{service.icon}</div>
                        <h3 className="font-bold text-lg mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Durée:</span>
                            <span className="font-semibold">{service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prix:</span>
                            <span className="font-semibold text-blue-600">{service.price}</span>
                          </div>
                        </div>
                        {service.deliverables && (
                          <div className="mt-4 space-y-1">
                            <p className="text-xs font-semibold text-gray-700">Livrables:</p>
                            {service.deliverables.map((deliverable, idx) => (
                              <p key={idx} className="text-xs text-gray-600">• {deliverable}</p>
                            ))}
                          </div>
                        )}
                        <Button className="w-full mt-4" size="sm">
                          Demander un devis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Section */}
        {activeTab === 'projets' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {exhibitor.projects.map((project, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={project.status === 'Terminé' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      <span className="font-bold text-blue-600">{project.budget}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span className="font-semibold">{project.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Échéance:</span>
                        <span className="font-semibold">{project.completion}</span>
                      </div>
                    </div>
                    {project.status === 'En cours' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Avancement</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* News Section */}
        {activeTab === 'actualites' && (
          <div className="space-y-8">
            {exhibitor.news.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full lg:w-64 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-gray-500">{article.date}</span>
                      </div>
                      <h2 className="font-bold text-2xl mb-3">{article.title}</h2>
                      <p className="text-gray-600 mb-4">{article.summary}</p>
                      <p className="text-gray-700 mb-4">{article.content}</p>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Lire l'article complet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Gallery Section */}
        {activeTab === 'galerie' && (
          <div className="space-y-8">
            {Object.entries(exhibitor.gallery).map(([category, images]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={image.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{image.title}</h3>
                          <p className="text-sm text-gray-600">{image.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    Formulaire de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type de demande</label>
                      <select 
                        value={contactForm.type}
                        onChange={(e) => setContactForm({...contactForm, type: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="information">Demande d'information</option>
                        <option value="devis">Demande de devis</option>
                        <option value="support">Support technique</option>
                        <option value="partenariat">Partenariat</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom complet *</label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entreprise</label>
                      <Input
                        value={contactForm.company}
                        onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {Object.entries(exhibitor.contacts).map(([type, contact]) => (
                  <Card key={type}>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4">
                        {type === 'general' ? 'Contact Général' : 
                         type === 'sales' ? 'Commercial' : 'Support Technique'}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-semibold">{contact.name}</div>
                            {contact.role && <div className="text-sm text-gray-600">{contact.role}</div>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Social Media */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Suivez-nous</h3>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Youtube className="w-4 h-4 mr-2" />
                        YouTube
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Notre Localisation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{exhibitor.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span>Stand {exhibitor.standNumber} - {exhibitor.pavilion}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <a href={`https://${exhibitor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {exhibitor.website}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-blue-100">{selectedProduct.category}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)} className="text-white hover:bg-white/20">
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  {selectedProduct.gallery && (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.gallery.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75" />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.detailedDescription || selectedProduct.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">Caractéristiques</h3>
                    <div className="space-y-2">
                      {selectedProduct.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedProduct.specifications && (
                    <div>
                      <h3 className="font-bold text-lg mb-2">Spécifications Techniques</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Demander un devis
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedExhibitorMiniSite;