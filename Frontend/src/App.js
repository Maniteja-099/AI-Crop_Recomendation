import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AppProvider } from './store/AppContext';
import { GlobalSettingsProvider } from './context/GlobalSettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Components
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// New Components
import ModernNavbar from './components/ModernNavbar';
import ModernSidebar from './components/ModernSidebar';
import ChatWidget from './components/ChatWidget';

// Pages
import ModernHome from './pages/ModernHome';
import SoilFertility from './pages/SoilFertility';
import WeatherIntelligence from './pages/WeatherIntelligence';
import CropRecommendation from './pages/CropRecommendation';
import YieldPrediction from './pages/YieldPrediction';
import FertilizerAdvisory from './pages/FertilizerAdvisory';
import UnifiedDashboard from './pages/UnifiedDashboard';
import ChatbotPage from './pages/ChatbotPage';
import FarmerFriendlySettings from './pages/FarmerFriendlySettings';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Routes>
      {/* Default: redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <ModernNavbar toggleSidebar={toggleSidebar} />
            
            <div className="flex flex-1 pt-16">
              {/* Sidebar */}
              <ModernSidebar open={sidebarOpen} onClose={closeSidebar} />
              
              {/* Main Content */}
              <main className="flex-1 w-full overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Routes>
                    <Route path="/" element={<ModernHome />} />
                    <Route path="/home" element={<ModernHome />} />
                    <Route path="/dashboard" element={<UnifiedDashboard />} />
                    <Route path="/soil-fertility" element={<SoilFertility />} />
                    <Route path="/weather" element={<WeatherIntelligence />} />
                    <Route path="/crop-recommendation" element={<CropRecommendation />} />
                    <Route path="/yield-prediction" element={<YieldPrediction />} />
                    <Route path="/fertilizer" element={<FertilizerAdvisory />} />
                    <Route path="/chat" element={<ChatbotPage />} />
                    <Route path="/settings" element={<FarmerFriendlySettings />} />
                  </Routes>
                </div>
              </main>
            </div>
            
            {/* Floating Chat Widget */}
            <ChatWidget />
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <GlobalSettingsProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </GlobalSettingsProvider>
  );
}

export default App;
