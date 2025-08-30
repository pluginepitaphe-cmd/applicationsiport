import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone, 
  Ship,
  CheckCircle
} from 'lucide-react';
import { useAuth, USER_TYPES } from '@/contexts/AuthContext';

// Schéma de validation
const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est requis'),
  lastName: yup
    .string()
    .required('Le nom est requis'),
  email: yup
    .string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
    .required('Le mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmez votre mot de passe'),
  userType: yup
    .string()
    .required('Sélectionnez votre type de compte'),
  company: yup
    .string()
    .required('Le nom de l\'entreprise est requis'),
  phone: yup
    .string()
    .required('Le numéro de téléphone est requis'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const userType = watch('userType');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await registerUser(data);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Inscription réussie !
              </h2>
              <p className="text-muted-foreground mb-6">
                Votre demande d'inscription a été envoyée. 
                {userType === USER_TYPES.EXHIBITOR || userType === USER_TYPES.PARTNER ? (
                  <span>
                    <br />Un email de validation vous sera envoyé une fois votre compte approuvé par notre équipe.
                  </span>
                ) : (
                  <span>
                    <br />Un email de validation vous a été envoyé.
                  </span>
                )}
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/connexion')} className="w-full">
                  Se connecter
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Ship className="h-12 w-12 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SIPORTS</h1>
          <p className="text-muted-foreground">Créez votre compte</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Rejoignez la communauté SIPORTS et accédez à toutes les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Type de compte */}
              <div className="space-y-2">
                <Label>Type de compte *</Label>
                <Select onValueChange={(value) => setValue('userType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre type de compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_TYPES.VISITOR}>
                      Visiteur - Accès aux exposants et réseautage
                    </SelectItem>
                    <SelectItem value={USER_TYPES.EXHIBITOR}>
                      Exposant - Présenter mes produits et services
                    </SelectItem>
                    <SelectItem value={USER_TYPES.PARTNER}>
                      Partenaire - Collaboration et partenariats
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-sm text-destructive">{errors.userType.message}</p>
                )}
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      className="pl-10"
                      {...register('firstName')}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      className="pl-10"
                      {...register('lastName')}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Informations professionnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise/Organisation *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Nom de votre entreprise"
                      className="pl-10"
                      {...register('company')}
                    />
                  </div>
                  {errors.company && (
                    <p className="text-sm text-destructive">{errors.company.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+212 XXX XXX XXX"
                      className="pl-10"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Description pour exposants/partenaires */}
              {(userType === USER_TYPES.EXHIBITOR || userType === USER_TYPES.PARTNER) && (
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description de votre activité {userType === USER_TYPES.EXHIBITOR ? '(Exposant)' : '(Partenaire)'}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez brièvement votre entreprise et vos activités..."
                    rows={3}
                    {...register('description')}
                  />
                </div>
              )}

              {/* Mots de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  onCheckedChange={(checked) => setValue('acceptTerms', checked)}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  J'accepte les{' '}
                  <Link to="/conditions" className="text-secondary hover:underline">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/confidentialite" className="text-secondary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link
                  to="/connexion"
                  className="font-medium text-secondary hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

