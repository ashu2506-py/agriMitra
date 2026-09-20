import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerMarketplace } from './pages/BuyerMarketplace';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { AIAssistantPage } from './pages/AIAssistantPage';

import {
  FPODashboard,
  DriverDashboard,
  AdminDashboard,
} from './pages/Dashboards';

import { useAuthStore } from './stores/authStore';

export const App: React.FC = () => {
  const fetchCurrentUser = useAuthStore(
    (state) => state.fetchCurrentUser
  );

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen flex flex-col text-slate-800 dashboard-${
          user?.role?.toLowerCase() || 'guest'
        }`}
      >
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route
              path="/farmer-dashboard"
              element={<FarmerDashboard />}
            />

            <Route
              path="/marketplace"
              element={<BuyerMarketplace />}
            />

            <Route
              path="/market-intelligence"
              element={<MarketIntelligencePage />}
            />

            <Route
              path="/assistant"
              element={<AIAssistantPage />}
            />

            <Route
              path="/fpo-dashboard"
              element={<FPODashboard />}
            />

            <Route
              path="/driver-dashboard"
              element={<DriverDashboard />}
            />

            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;