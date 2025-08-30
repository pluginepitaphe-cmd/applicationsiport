import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, Package, Users, FileText, Image as ImageIcon, Eye, Save, 
  Plus, Trash2, Edit, Upload, Star, Award, Globe, Mail, Phone, MapPin,
  Calendar, TrendingUp, Target, Lightbulb, CheckCircle, ArrowLeft, Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EnhancedMiniSiteEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State pour les données du mini-site enhanced
  const [siteData, setSiteData] = useState({});

  const [activeTab, setActiveTab] = useState('general');

  // Charger les données depuis l'API
  useEffect(() => {
    loadMiniSiteData();
  }, [user]);

  const loadMiniSiteData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/minisite/enhanced/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      
      const result = await response.json();
      setSiteData(result.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      // En cas d'erreur, utiliser les données par défaut
      setSiteData(getDefaultSiteData());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSiteData = () => ({
    // Informations de base
    name: user?.company || 'Mon Entreprise',
    tagline: 'Révolutionner l\'avenir maritime grâce à l\'innovation technologique',
    category: 'Technologie Maritime',
    icon: '⚓',
    description: 'Solutions technologiques innovantes pour l\'industrie maritime et portuaire.',
    fullDescription: 'Description complète de votre entreprise et de ses activités...',
    
    // Informations de contact
    location: 'Votre ville, Pays',
    phone: user?.phone || '+33 1 23 45 67 89',
    email: user?.email || 'contact@exemple.com',
    website: 'www.votre-site.com',
    
    // Informations du stand
    standNumber: 'A-001',
    pavilion: 'Pavillon Principal',
    
    // Métriques clés
    employees: '50+',
    founded: '2020',
    revenue: '€5M+',
    clientsServed: '100+ clients satisfaits',
    
    // Visuels
    logo: '/images/logo-placeholder.png',
    coverImage: '/images/cover-placeholder.jpg',
    
    // Timeline de l'entreprise
    timeline: [
      {
        year: '2020',
        title: 'Création de l\'entreprise',
        description: 'Fondation avec une équipe de 5 experts',
        milestone: true
      }
    ],
    
    // Équipe dirigeante
    team: [
      {
        name: 'John Doe',
        position: 'CEO & Fondateur',
        bio: 'Expert en technologie maritime avec 15 ans d\'expérience',
        expertise: ['Leadership', 'Innovation', 'Stratégie'],
        image: '/images/team-placeholder.jpg',
        linkedin: 'john-doe'
      }
    ],
    
    // Valeurs et engagements
    values: [
      {
        title: 'Innovation',
        description: 'Développer des technologies qui transforment l\'industrie',
        icon: 'Lightbulb',
        actions: ['R&D continue', 'Veille technologique', 'Partenariats']
      }
    ],
    
    // Certifications
    certifications: [
      {
        name: 'ISO 9001',
        description: 'Management de la qualité',
        year: '2023',
        logo: '/images/cert-placeholder.png'
      }
    ],
    
    // Produits (sera synchronisé avec ProductManagement)
    products: [],
    
    // Services
    services: [
      {
        title: 'Consulting Maritime',
        description: 'Conseil stratégique pour la transformation digitale',
        icon: '🎯',
        duration: '3-6 mois',
        price: 'Sur devis',
        deliverables: ['Audit', 'Stratégie', 'Implémentation']
      }
    ],
    
    // Projets récents
    projects: [
      {
        name: 'Projet pilote',
        description: 'Description du projet',
        status: 'Terminé',
        completion: '2024',
        budget: '€100K',
        image: '/images/project-placeholder.jpg',
        client: 'Client confidentiel'
      }
    ],
    
    // Actualités
    news: [
      {
        title: 'Nouvelle innovation',
        date: new Date().toISOString().split('T')[0],
        category: 'Innovation',
        summary: 'Nous sommes fiers d\'annoncer...',
        image: '/images/news-placeholder.jpg',
        content: 'Contenu complet de l\'actualité...'
      }
    ],
    
    // Galerie
    gallery: {
      products: [],
      installations: [],
      team: [],
      events: []
    },
    
    // Contacts spécialisés
    contacts: {
      general: {
        name: 'Accueil général',
        email: user?.email || 'contact@exemple.com',
        phone: user?.phone || '+33 1 23 45 67 89'
      },
      sales: {
        name: 'Commercial',
        role: 'Directeur Commercial',
        email: 'sales@exemple.com',
        phone: '+33 1 23 45 67 90'
      },
      support: {
        name: 'Support Technique',
        email: 'support@exemple.com',
        phone: '+33 1 23 45 67 91'
      }
    },
    
    // Réseaux sociaux
    social: {
      linkedin: '',
      twitter: '',
      facebook: '',
      youtube: ''
    }
  });

  // Fonction pour mettre à jour les données
  const updateSiteData = (section, field, value) => {
    setSiteData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
    setHasChanges(true);
  };

  // Ajouter un élément à un tableau
  const addArrayItem = (arrayPath, newItem) => {
    setSiteData(prev => {
      const pathParts = arrayPath.split('.');
      let current = { ...prev };
      let target = current;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        target[pathParts[i]] = { ...target[pathParts[i]] };
        target = target[pathParts[i]];
      }
      
      const finalKey = pathParts[pathParts.length - 1];
      target[finalKey] = [...(target[finalKey] || []), newItem];
      
      return current;
    });
    setHasChanges(true);
  };

  // Supprimer un élément d'un tableau
  const removeArrayItem = (arrayPath, index) => {
    setSiteData(prev => {
      const pathParts = arrayPath.split('.');
      let current = { ...prev };
      let target = current;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        target[pathParts[i]] = { ...target[pathParts[i]] };
        target = target[pathParts[i]];
      }
      
      const finalKey = pathParts[pathParts.length - 1];
      target[finalKey] = target[finalKey].filter((_, i) => i !== index);
      
      return current;
    });
    setHasChanges(true);
  };

  // Sauvegarder les modifications
  const saveSite = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/minisite/enhanced/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(siteData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }
      
      setHasChanges(false);
      alert('Mini-site sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du mini-site');
    } finally {
      setSaving(false);
    }
  };

  // Prévisualiser le mini-site
  const previewSite = () => {
    // TODO: Utiliser l'ID réel de l'exposant
    const exposantId = user?.id || 'maritime-tech-solutions';
    window.open(`/exposants/${exposantId}/enhanced`, '_blank');
  };

  const tabsConfig = [
    { id: 'general', label: 'Informations générales', icon: Building2 },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'timeline', label: 'Histoire', icon: Calendar },
    { id: 'values', label: 'Valeurs', icon: Target },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'services', label: 'Services', icon: TrendingUp },
    { id: 'projects', label: 'Projets', icon: FileText },
    { id: 'news', label: 'Actualités', icon: FileText },
    { id: 'gallery', label: 'Galerie', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  // Affichage de chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement de votre mini-site...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Éditeur de Mini-Site Enhanced
              </h1>
              <p className="text-muted-foreground">
                Gérez tous les aspects de votre présentation professionnelle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Modifications non sauvegardées
              </Badge>
            )}
            <Button variant="outline" onClick={previewSite}>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={saveSite} disabled={!hasChanges || saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Interface d'édition */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu latéral */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone d'édition principale */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Informations générales */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Les informations de base de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de l'entreprise</Label>
                    <Input
                      id="name"
                      value={siteData.name}
                      onChange={(e) => updateSiteData(null, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Slogan/Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteData.tagline}
                      onChange={(e) => updateSiteData(null, 'tagline', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={siteData.category}
                      onChange={(e) => updateSiteData(null, 'category', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icône (Emoji)</Label>
                    <Input
                      id="icon"
                      value={siteData.icon}
                      onChange={(e) => updateSiteData(null, 'icon', e.target.value)}
                      placeholder="⚓"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description courte</Label>
                  <Textarea
                    id="description"
                    value={siteData.description}
                    onChange={(e) => updateSiteData(null, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Description complète</Label>
                  <Textarea
                    id="fullDescription"
                    value={siteData.fullDescription}
                    onChange={(e) => updateSiteData(null, 'fullDescription', e.target.value)}
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={siteData.location}
                      onChange={(e) => updateSiteData(null, 'location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={siteData.website}
                      onChange={(e) => updateSiteData(null, 'website', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standNumber">Numéro de stand</Label>
                    <Input
                      id="standNumber"
                      value={siteData.standNumber}
                      onChange={(e) => updateSiteData(null, 'standNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pavilion">Pavillon</Label>
                    <Input
                      id="pavilion"
                      value={siteData.pavilion}
                      onChange={(e) => updateSiteData(null, 'pavilion', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Métriques clés</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="employees">Nombre d'employés</Label>
                      <Input
                        id="employees"
                        value={siteData.employees}
                        onChange={(e) => updateSiteData(null, 'employees', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Année de création</Label>
                      <Input
                        id="founded"
                        value={siteData.founded}
                        onChange={(e) => updateSiteData(null, 'founded', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revenue">Chiffre d'affaires</Label>
                      <Input
                        id="revenue"
                        value={siteData.revenue}
                        onChange={(e) => updateSiteData(null, 'revenue', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientsServed">Clients servis</Label>
                      <Input
                        id="clientsServed"
                        value={siteData.clientsServed}
                        onChange={(e) => updateSiteData(null, 'clientsServed', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Équipe */}
          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Équipe dirigeante</CardTitle>
                    <CardDescription>
                      Présentez les membres clés de votre équipe
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => addArrayItem('team', {
                      name: 'Nouveau membre',
                      position: 'Fonction',
                      bio: 'Biographie...',
                      expertise: ['Compétence 1'],
                      image: '/images/team-placeholder.jpg',
                      linkedin: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {siteData.team.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Membre {index + 1}</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeArrayItem('team', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const newTeam = [...siteData.team];
                            newTeam[index].name = e.target.value;
                            updateSiteData(null, 'team', newTeam);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fonction</Label>
                        <Input
                          value={member.position}
                          onChange={(e) => {
                            const newTeam = [...siteData.team];
                            newTeam[index].position = e.target.value;
                            updateSiteData(null, 'team', newTeam);
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Biographie</Label>
                      <Textarea
                        value={member.bio}
                        onChange={(e) => {
                          const newTeam = [...siteData.team];
                          newTeam[index].bio = e.target.value;
                          updateSiteData(null, 'team', newTeam);
                        }}
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Expertise (séparée par des virgules)</Label>
                      <Input
                        value={member.expertise.join(', ')}
                        onChange={(e) => {
                          const newTeam = [...siteData.team];
                          newTeam[index].expertise = e.target.value.split(',').map(s => s.trim());
                          updateSiteData(null, 'team', newTeam);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>LinkedIn (nom d'utilisateur)</Label>
                      <Input
                        value={member.linkedin}
                        onChange={(e) => {
                          const newTeam = [...siteData.team];
                          newTeam[index].linkedin = e.target.value;
                          updateSiteData(null, 'team', newTeam);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Histoire de l'entreprise</CardTitle>
                    <CardDescription>
                      Chronologie des événements marquants
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => addArrayItem('timeline', {
                      year: new Date().getFullYear().toString(),
                      title: 'Nouvel événement',
                      description: 'Description...',
                      milestone: false
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {siteData.timeline.map((event, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Événement {index + 1}</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeArrayItem('timeline', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input
                          value={event.year}
                          onChange={(e) => {
                            const newTimeline = [...siteData.timeline];
                            newTimeline[index].year = e.target.value;
                            updateSiteData(null, 'timeline', newTimeline);
                          }}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Titre</Label>
                        <Input
                          value={event.title}
                          onChange={(e) => {
                            const newTimeline = [...siteData.timeline];
                            newTimeline[index].title = e.target.value;
                            updateSiteData(null, 'timeline', newTimeline);
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={event.description}
                        onChange={(e) => {
                          const newTimeline = [...siteData.timeline];
                          newTimeline[index].description = e.target.value;
                          updateSiteData(null, 'timeline', newTimeline);
                        }}
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`milestone-${index}`}
                        checked={event.milestone}
                        onChange={(e) => {
                          const newTimeline = [...siteData.timeline];
                          newTimeline[index].milestone = e.target.checked;
                          updateSiteData(null, 'timeline', newTimeline);
                        }}
                      />
                      <Label htmlFor={`milestone-${index}`}>Événement majeur (milestone)</Label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Gérez vos différents contacts spécialisés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(siteData.contacts).map(([contactType, contact]) => (
                  <div key={contactType} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold capitalize">
                      {contactType === 'general' ? 'Contact général' : 
                       contactType === 'sales' ? 'Commercial' : 'Support technique'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => {
                            const newContacts = { ...siteData.contacts };
                            newContacts[contactType].name = e.target.value;
                            updateSiteData(null, 'contacts', newContacts);
                          }}
                        />
                      </div>
                      {contact.role && (
                        <div className="space-y-2">
                          <Label>Fonction</Label>
                          <Input
                            value={contact.role}
                            onChange={(e) => {
                              const newContacts = { ...siteData.contacts };
                              newContacts[contactType].role = e.target.value;
                              updateSiteData(null, 'contacts', newContacts);
                            }}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = { ...siteData.contacts };
                            newContacts[contactType].email = e.target.value;
                            updateSiteData(null, 'contacts', newContacts);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => {
                            const newContacts = { ...siteData.contacts };
                            newContacts[contactType].phone = e.target.value;
                            updateSiteData(null, 'contacts', newContacts);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Réseaux sociaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={siteData.social.linkedin}
                        onChange={(e) => updateSiteData('social', 'linkedin', e.target.value)}
                        placeholder="nom-entreprise"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter</Label>
                      <Input
                        value={siteData.social.twitter}
                        onChange={(e) => updateSiteData('social', 'twitter', e.target.value)}
                        placeholder="@VotreEntreprise"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        value={siteData.social.facebook}
                        onChange={(e) => updateSiteData('social', 'facebook', e.target.value)}
                        placeholder="VotreEntreprise"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube</Label>
                      <Input
                        value={siteData.social.youtube}
                        onChange={(e) => updateSiteData('social', 'youtube', e.target.value)}
                        placeholder="VotreEntreprise"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Autres onglets peuvent être ajoutés de manière similaire */}
          {activeTab === 'products' && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                La gestion des produits se fait via la <strong>Gestion des Produits</strong> dans votre tableau de bord. 
                Les produits seront automatiquement synchronisés avec votre mini-site.
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
                    <Package className="h-4 w-4 mr-2" />
                    Gérer mes produits
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

        </div>
      </div>
    </div>
  );
};

export default EnhancedMiniSiteEditor;