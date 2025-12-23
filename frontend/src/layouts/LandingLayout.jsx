// src/layouts/LandingLayout.jsx
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

import { useLocation, useNavigate } from 'react-router-dom';

export default function LandingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const openLogin = () => {
    navigate('/login', { state: { backgroundLocation: location } });
  };

  const openSignup = () => {
    navigate('/signup', { state: { backgroundLocation: location } });
  };

  return (
    <>
      <Header onLoginClick={openLogin} onSignupClick={openSignup} />
      <main>
        <HeroSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
