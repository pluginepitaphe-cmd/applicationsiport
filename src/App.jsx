import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './components/notifications/NotificationSystem';
import { PackageLimitProvider } from './contexts/PackageLimitContext';
import Layout from './components/layout/Layout';
import SiportsChatbot from './components/ai/SiportsChatbot';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatbotTestPage from './pages/ChatbotTestPage';
import AdminValidationPage from './pages/AdminValidationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import VisitorPackagesPage from './pages/VisitorPackagesPage';
import PartnershipPackagesPage from './pages/PartnershipPackagesPage';
import AdvancedMatchingSystem from './pages/AdvancedMatchingSystem';
import IntelligentMatchingSystem from './pages/IntelligentMatchingSystem';
import AINetworkingHub from './pages/AINetworkingHub';
import MatchingDemo from './pages/MatchingDemo';
import ExhibitorDashboard from './pages/ExhibitorDashboard';
import DashboardPage from './pages/DashboardPage';
import ProductManagement from './pages/ProductManagement';
import MiniSiteEditor from './pages/MiniSiteEditor';
import MiniSitePreview from './pages/MiniSitePreview';
import AppointmentCalendar from './pages/AppointmentCalendar';
import ExhibitorDirectory from './pages/ExhibitorDirectory';
import ExhibitorMiniSite from './pages/ExhibitorMiniSite';
import EnhancedExhibitorMiniSite from './pages/EnhancedExhibitorMiniSite';
import EnhancedMiniSiteEditor from './pages/EnhancedMiniSiteEditor';
import ExhibitorProfilePage from './pages/ExhibitorProfilePage';
import ExhibitorProfilePremium from './pages/ExhibitorProfilePremium';
import ExhibitorMiniSitePro from './pages/ExhibitorMiniSitePro';
import NetworkingPage from './pages/NetworkingPage';
import MessagesPage from './pages/MessagesPage';
import ContactPage from './pages/ContactPage';
import PartnersPage from './pages/PartnersPage';
import PartnerMiniSite from './pages/PartnerMiniSite';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PackageLimitProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Routes sans layout pour l'authentification */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/exposants/:id" element={<ExhibitorMiniSite />} />
              <Route path="/exposants/:id/enhanced" element={<EnhancedExhibitorMiniSite />} />
              <Route path="/exposant/:id" element={<ExhibitorProfilePage />} />
              <Route path="/exposant/:id/premium" element={<ExhibitorProfilePremium />} />
              <Route path="/exposant/:id/mini-site" element={<ExhibitorMiniSitePro />} />
              
              {/* Route mini-site public sans layout */}
              <Route path="/mini-site/preview/:companyId?" element={<MiniSitePreview />} />
              
              {/* Route tableau de bord admin sans layout */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/forfaits-visiteur" element={<VisitorPackagesPage />} />
              <Route path="/partenaires/forfaits" element={<PartnershipPackagesPage />} />
              <Route path="/matching" element={<AdvancedMatchingSystem />} />
              <Route path="/matching-ai" element={<IntelligentMatchingSystem />} />
              <Route path="/reseautage-ai" element={<AINetworkingHub />} />
              <Route path="/matching-demo" element={<MatchingDemo />} />
              
              {/* Routes avec layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/exposants" element={<ExhibitorDirectory />} />
                <Route path="/partenaires" element={<PartnersPage />} />
                <Route path="/partenaires/:id" element={<PartnerMiniSite />} />
                <Route path="/calendrier" element={<AppointmentCalendar />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/reseautage" element={<NetworkingPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/dashboard" element={<ExhibitorDashboard />} />
                <Route path="/dashboard-advanced" element={<DashboardPage />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/mini-site" element={<MiniSiteEditor />} />
                <Route path="/mini-site/enhanced" element={<EnhancedMiniSiteEditor />} />
                <Route path="/admin/validation" element={<AdminValidationPage />} />
                <Route path="/chatbot-test" element={<ChatbotTestPage />} />
              </Route>
            </Routes>
            
            {/* Chatbot IA SIPORTS v2.0 - Disponible sur toutes les pages */}
            <SiportsChatbot />
          </Router>
        </NotificationProvider>
      </PackageLimitProvider>
    </AuthProvider>
  );
}

export default App;

