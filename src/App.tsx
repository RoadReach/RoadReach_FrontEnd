import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login";
import CreateAccount from "./components/CreateAccount";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/home";
import Dashboard from './components/Dashboard';
import RentalCars from './components/rentalCars';
import Profile from "./components/profile";
import SelectVehicle from './components/SelectVehicle';
import Footer from './components/Footer';
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import './components/SelectVehicle.css';



const AppContent: React.FC = () => {
  const navigate = useNavigate();
  // Only enable session timeout if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("email") || sessionStorage.getItem("email"));
  const { showSessionTimeout, handleStaySignedIn, countdown } = useSessionTimeout({
    timeout: 1* 60 * 1000,
    autoLogout: 1 * 60 * 1000,
    onLogout: () => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    },
  });

   const [secondsLeft, setSecondsLeft] = React.useState(60);

  React.useEffect(() => {
    if (!showSessionTimeout) return;
    setSecondsLeft(60);
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showSessionTimeout]);

  return (
    <div>
      <Header />
      {isLoggedIn && showSessionTimeout && (
       <div className="session-modal" role="dialog" aria-modal="true" aria-label="Countdown to session expiration">
           <div className="session-modal__dialog">
            <div className="session-modal__header">
                Session About to Expire
            </div>
            <div style={{ fontSize: '1.1rem', color: '#003a5c', lineHeight: '1.7',alignContent:'center', textAlign:'center', marginBottom: '20px' }}>
              Due to inactivity, your session will end in {secondsLeft} seconds
            </div>
            <button className="modal-btn" onClick={handleStaySignedIn}>
              CONTINUE SESSION
            </button>
          </div>
        </div>
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rental-cars" element={<RentalCars />} />
          <Route path="/select-vehicle" element={<SelectVehicle />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;