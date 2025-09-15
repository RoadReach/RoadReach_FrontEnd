import React, { useState, useRef, useEffect } from "react";
<<<<<<<<< Temporary merge branch 1
import { Link, useNavigate } from "react-router-dom";
=========
import { Link, useNavigate, useLocation } from "react-router-dom";
>>>>>>>>> Temporary merge branch 2
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle, PhoneCall } from 'lucide-react';
import GeoDropdown from './GeoDropdown';
import HelpCenter from './HelpCenter';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = localStorage.getItem("firstname");
  const [showDropdown, setShowDropdown] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const userRef = useRef<HTMLSpanElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        userRef.current &&
        !userRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Add refs
  const userBtnRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("firstname");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Only show logo on login page
  if (location.pathname === '/login') {
    return (
      <header className="site-header login-header">
        <div className="header__top">
          <div className="header__left header__left--center">
            <img src={RoadReachLogo} width={150} height={75} alt="RoadReach Logo" />
          </div>
        </div>
      </header>
    );
  }

  // ...existing code for full header...
  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="header__top">
        <div className="header__left">
          <img src={RoadReachLogo} width={150} height={75} alt="RoadReach Logo" />
        </div>
        <div className="header__right">
          <Link to="/" className="header__link header__link--light">RoadReach.com</Link>
          <span className="header__sep header__sep--tall">|</span>
          <a href="#" className="header__link header__link--light">Membership</a>
          <span className="header__sep header__sep--tall">|</span>
          <a href="#" className="header__link header__help-link" onClick={() => setHelpOpen(true)}>
            <HelpCircle size={16} color="#D32F2F" style={{verticalAlign:'middle',marginRight:2}} />
            <span className="header__help-text">Help Center</span>
          </a>
          <span className="header__sep header__sep--tall">|</span>
          <a
            href="tel:+18669217925"
            className="header__phone header__phone--bold"
            aria-label="Call 1 866 921 7925"
          >
            <PhoneCall size={20} color="#D32F2F" fill="#D32F2F" style={{verticalAlign:'middle',marginRight:6}} />
            <span className="header__phone-number header__phone-number--solid">1-866-921-7925</span>
          </a>
          <span className="header__sep header__sep--tall">|</span>
          <GeoDropdown showOnlyCountry={true} onCountryChange={() => window.location.reload()} />
          <span className="header__sep header__sep--tall">|</span>
          {firstName ? (
            <div className="header__user-wrapper">
<<<<<<<<< Temporary merge branch 1
              <span
                className="header__user"
                onClick={() => setShowDropdown(prev => !prev)}
                ref={userBtnRef}
              >
                👤 {firstName}
              </span>
              {showDropdown && (
                <div className="profile-dropdown" ref={dropdownRef}>
=========
              <span className="header__user" ref={userRef} onClick={() => setShowDropdown(prev => !prev)}>👤 {firstName}</span>
              {showDropdown && (
                <div className="profile-dropdown profile-dropdown--full" ref={dropdownRef}>
                  <div className="profile-dropdown__user">
                    <div className="profile-dropdown__avatar">{firstName ? firstName[0].toUpperCase() : "U"}</div>
                    <div className="profile-dropdown__info">
                      <div className="profile-dropdown__name">{localStorage.getItem("firstname") && localStorage.getItem("lastname") ? `${localStorage.getItem("firstname").toUpperCase()} ${localStorage.getItem("lastname").toUpperCase()}` : firstName}</div>
                      <div className="profile-dropdown__email">{localStorage.getItem("email")}</div>
                    </div>
                  </div>
                    <Link
                      to="/profile"
                      className="profile-dropdown__item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account
                    </Link>
>>>>>>>>> Temporary merge branch 2
                  <Link
                    to="/bookings"
                    className="profile-dropdown__item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="profile-dropdown__item profile-dropdown__logout"
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