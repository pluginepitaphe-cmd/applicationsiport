import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle,
  User,
  Clock
} from 'lucide-react';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [conversations, setConversations] = useState([]);
  
  const toParticipantId = searchParams.get('to');
  const participantName = searchParams.get('name');

  useEffect(() => {
    // Simuler des conversations existantes
    const mockConversations = [
      {
        id: 1,
        participant: 'Maritime Solutions',
        lastMessage: 'Merci pour votre intérêt, nous pouvons organiser une démonstration.',
        timestamp: '2024-08-04 10:30',
        unread: true
      },
      {
        id: 2,
        participant: 'Port Authority Maroc',
        lastMessage: 'Notre équipe technique sera disponible demain.',
        timestamp: '2024-08-04 09:15',
        unread: false
      }
    ];
    setConversations(mockConversations);

    // Pré-remplir le sujet si on contacte un participant spécifique
    if (participantName) {
      setSubject(`Contact depuis SIPORTS - ${participantName}`);
    }
  }, [participantName]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Simuler l'envoi du message
    const newMessage = {
      id: Date.now(),
      content: message,
      timestamp: new Date().toLocaleString('fr-FR'),
      sender: 'me'
    };

    // Ajouter à la conversation ou créer une nouvelle
    alert(`Message envoyé à ${participantName || 'le destinataire'} !`);
    setMessage('');
    setSubject('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/reseautage">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au réseautage
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{conversation.participant}</h4>
                      {conversation.unread && (
                        <Badge variant="destructive" className="text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {conversation.timestamp}
                    </div>
                  </div>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune conversation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Zone de composition */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                {participantName ? `Nouveau message à ${participantName}` : 'Nouveau message'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {participantName && (
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-600" />
                    <span className="font-medium text-cyan-800">Destinataire: {participantName}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Sujet</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message ici..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMessage('');
                    setSubject('');
                  }}
                >
                  Effacer
                </Button>
              </div>

              <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                <h4 className="font-medium mb-2">💡 Conseils pour un bon message</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Présentez-vous brièvement</li>
                  <li>• Expliquez clairement votre demande</li>
                  <li>• Mentionnez le salon SIPORTS comme contexte</li>
                  <li>• Proposez un créneau pour un appel ou rendez-vous</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages prédéfinis */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Modèles de messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setMessage(`Bonjour,

Suite à notre rencontre au salon SIPORTS, je souhaiterais en savoir plus sur vos solutions et discuter d'une éventuelle collaboration.

Seriez-vous disponible pour un appel ou un rendez-vous dans les prochains jours ?

Cordialement`)}
              >
                <h4 className="font-medium mb-2">Demande de collaboration</h4>
                <p className="text-sm text-muted-foreground">Message type pour proposer une collaboration</p>
              </div>
              
              <div 
                className="p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setMessage(`Bonjour,

J'ai été très intéressé par votre présentation au salon SIPORTS. Pourriez-vous m'envoyer plus d'informations sur vos produits/services, notamment :
- Documentation technique
- Tarifs
- Conditions de mise en œuvre

Merci d'avance.

Cordialement`)}
              >
                <h4 className="font-medium mb-2">Demande d'informations</h4>
                <p className="text-sm text-muted-foreground">Message pour obtenir plus de détails</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;