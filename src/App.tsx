
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



const AppContent: React.FC = () => {
  const navigate = useNavigate();
  // Only enable session timeout if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("email") || sessionStorage.getItem("email"));
  const { showSessionTimeout, handleStaySignedIn } = useSessionTimeout({
    timeout: 3 * 60 * 1000,
    autoLogout: 3 * 60 * 1000,
    onLogout: () => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    },
  });

  return (
    <div>
      <Header />
      {isLoggedIn && showSessionTimeout && (
        <div className="modal-overlay modal-overlay--centered">
          <div className="modal-card modal-card--centered">
            <h2 className="modal-title">Session Timeout</h2>
            <div className="modal-instructions">
              Your session is about to close due to inactivity. Would you like to stay signed in?<br />
              <span className="auto-logout-warning">You will be logged out automatically in 3 minutes.</span>
            </div>
            <div className="session-modal-btn-row">
              <button className="modal-btn modal-btn--primary" onClick={handleStaySignedIn}>Stay Signed In</button>
              <button className="modal-btn modal-btn--link" onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
              }}>Logout</button>
            </div>
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