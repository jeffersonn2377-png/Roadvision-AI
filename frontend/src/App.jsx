import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DemoBanner from './components/DemoBanner';
import JudgeDemoModal from './components/JudgeDemoModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import MapPage from './pages/MapPage';
import PriorityQueuePage from './pages/PriorityQueuePage';
import ConsentOfficerPage from './pages/ConsentOfficerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PredictionPage from './pages/PredictionPage';
import MaintenancePage from './pages/MaintenancePage';
import ReportsPage from './pages/ReportsPage';
import DamageDetailsPage from './pages/DamageDetailsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const location = useLocation();
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);

  const handleOpenJudgeDemo = () => setIsJudgeDemoOpen(true);
  const handleCloseJudgeDemo = () => setIsJudgeDemoOpen(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Demo Banner */}
      <DemoBanner />

      {/* Navbar Header */}
      <Navbar onStartJudgeDemo={handleOpenJudgeDemo} />

      {/* Main Layout Body */}
      <div className="flex flex-1">
        {/* Sidebar Portal Nav (Hidden on Login/Landing) */}
        {!isAuthPage && <Sidebar />}

        {/* Page Content Container */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage onStartJudgeDemo={handleOpenJudgeDemo} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/priority" element={<PriorityQueuePage />} />
            <Route path="/consent-officers" element={<ConsentOfficerPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/damages/:id" element={<DamageDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Global Judge Demo Animated Modal */}
      <JudgeDemoModal isOpen={isJudgeDemoOpen} onClose={handleCloseJudgeDemo} />

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
