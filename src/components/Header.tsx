import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle } from 'lucide-react';
import GeoDropdown from './GeoDropdown';
import HelpCenter from './HelpCenter';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("firstname");
  const [showDropdown, setShowDropdown] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("firstname");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="header__top">
        <div className="header__left">
          <img src={RoadReachLogo} width={100} height={50} alt="RoadReach Logo" />
        </div>
        <div className="header__right">
          <Link to="/" className="header__link">
            RoadReach.com
          </Link>
          <span className="header__sep">|</span>
          <a href="#" className="header__link">Membership</a>
          <span className="header__sep">|</span>
          <a href="#" className="header__link" onClick={() => setHelpOpen(true)}><HelpCircle size={13} /> Help Center</a>
          <span className="header__sep">|</span>
          <span className="header__phone">📞 1-520-483-8758</span>
          <span className="header__sep">|</span>
          <GeoDropdown showOnlyCountry={true} onCountryChange={() => window.location.reload()} />
          <span className="header__sep">|</span>
          {firstName ? (
            <div className="header__user-wrapper">
              <span className="header__user" onClick={() => setShowDropdown(prev => !prev)}>👤 {firstName}</span>
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="header__dropdown-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="header__dropdown-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header__login">
              <span className="header__user-initial">👤</span> Login
            </Link>
          )}
        </div>
      </div>

      {/* Main nav bar */}
      <div className="header__main">
        <nav className="header__nav">
          <a href="#" className="header__nav-link">DEALS</a>
          <a href="#" className="header__nav-link">DESTINATIONS</a>
          <a href="#" className="header__nav-link">BUILD YOUR OWN TRIP</a>
          <a href="#" className="header__nav-link">CRUISES</a>
          <Link to="/rental-cars" className="header__nav-link">RENTAL CARS</Link>
          <a href="#" className="header__nav-link">THEME PARKS & SPECIALTY</a>
        </nav>
      </div>
      <HelpCenter open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>

  );
};


export default Header;