// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Calendar from './components/CalendarView';
// Importar desde tu nuevo index centralizado
import { CompanySelectView, CompanyView } from './index.js';

import Job from './components/JobView';
import Help from './components/HelpView';
import Settings from './components/SettingsView';

import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import { useState } from 'react';

function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Reemplazar con auth real

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        {/* Landing */}
        <Route
          path="/"
          element={
            <LandingLayout />
          }
        />

        {/* Dashboard protegido */}
        <Route
          path="/app/*"
          element={
            isLoggedIn ? <DashboardLayout /> : <Navigate to="/" replace />
          }
        >
          <Route path="calendar" element={<Calendar />} />
          <Route path="company" element={<CompanySelectView />} />
          <Route path="company/:id" element={<CompanyView />} />
          <Route path="job" element={<Job />} />
          <Route path="help" element={<Help />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Modales superpuestos si hay backgroundLocation */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<LoginModal open onClose={() => window.history.back()} onSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupModal open onClose={() => window.history.back()} />} />
        </Routes>
      )}

      {/* Si entran directo a /login o /signup */}
      {!state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<LoginModal open onClose={() => window.history.back()} onSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupModal open onClose={() => window.history.back()} />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
