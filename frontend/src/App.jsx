// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Calendar from "./components/CalendarView";

import "@js-temporal/polyfill";

import { CompanySelectView, CompanyView } from "./index.js";

import Job from "./components/JobView";
import Help from "./components/HelpView";
import Settings from "./components/SettingsView";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import { useState } from "react";

import CompaniesList from "./components/CompaniesList";
import CompanyDetail from "./components/CompanyDetail";

import ReservationPage from "./components/ReservationPage";
import ClientDataPage from "./components/ClientDataPage";
import ConfirmReservationPage from "./components/ConfirmReservationPage";
import ReservationSuccessPage from "./components/ReservationSuccessPage";
import ReservationWizard from "./components/ReservationWizard";

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
        <Route path="/" element={<LandingLayout />} />

        {/* Users views */}
        <Route path="companiesList" element={<CompaniesList />} />
        <Route path="/company/:id" element={<CompanyDetail />} />
        <Route
          path="/reservar/:companyId/:serviceId"
          element={<ReservationWizard />}
        />
        <Route
          path="/reservar/:companyId/:serviceId/exito"
          element={<ReservationSuccessPage />}
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
          <Route path="my-company/:id" element={<CompanyView />} />
          <Route path="job" element={<Job />} />
          <Route path="help" element={<Help />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Modales superpuestos si hay backgroundLocation */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              <LoginModal
                open
                onClose={() => window.history.back()}
                onSuccess={handleLoginSuccess}
              />
            }
          />
          <Route
            path="/signup"
            element={<SignupModal open onClose={() => window.history.back()} />}
          />
        </Routes>
      )}

      {/* Si entran directo a /login o /signup */}
      {!state?.backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              <LoginModal
                open
                onClose={() => window.history.back()}
                onSuccess={handleLoginSuccess}
              />
            }
          />
          <Route
            path="/signup"
            element={<SignupModal open onClose={() => window.history.back()} />}
          />
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
