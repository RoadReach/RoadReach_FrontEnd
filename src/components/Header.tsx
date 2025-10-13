import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle, PhoneCall, Tag, Briefcase, Hammer, Hotel, Ship, Car, Truck, FlagTriangleRight, User, Mail, ExternalLink } from 'lucide-react';
import GeoDropdown from './GeoDropdown';
import HelpCenter from './HelpCenter';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = localStorage.getItem("firstname");
  const [showDropdown, setShowDropdown] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("firstname");
    localStorage.removeItem("token");
  window.location.href = "/";
  };

  // Only show logo on login and forgot-password page
  if (location.pathname === '/login' || location.pathname === '/forgot-password') {
    return (
      <header className="site-header login-header">
        <div className="header__top">
          <div className="header__left header__left--center">
            <Link to="/">
              <img src={RoadReachLogo} width={150} height={75} alt="RoadReach Logo" className="header__logo-link" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // ...existing code for full header...
  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="header__container">
        <div className="header__left">
          <Link to="/">
            <img src={RoadReachLogo} width={150} height={75} alt="RoadReach Logo" className="header__logo-link" />
          </Link>
        </div>
        <div className="header__right">
          <div className="header__right-content">
            <a
              href="/home_hero"
              className="header__right-domain-link"
            >
              RoadReach.com
            </a>
            <span className="header__sep header__sep--tall">|</span>
            <a href="#" className="header__right-link">Membership</a>
            <span className="header__sep header__sep--tall">|</span>
            <a href="#" className="header__right-link header__help-link" onClick={() => setHelpOpen(true)}>
              <HelpCircle size={20} color="#D32F2F" style={{verticalAlign:'middle',marginRight:2}} />
              <span className="header__help-text">Help Center</span>
            </a>
            <span className="header__sep header__sep--tall">|</span>
            <a href="tel:+18669217925" className="header__right-link header__phone">
               <span className="header__phone-icon"><PhoneCall size={20} /></span>
              <span className="header__phone-number header__phone-number--solid">1-866-921-7925</span>
            </a>
            <span className="header__sep header__sep--tall">|</span>
            <GeoDropdown showOnlyCountry={true} onCountryChange={() => window.location.reload()} />
          </div>
          {firstName ? (
            <div className="header__user-wrapper">
              <span className="header__user" ref={userRef} onClick={() => setShowDropdown(prev => !prev)}>👤 {firstName}</span>
              {showDropdown && (
                <div className="profile-dropdown profile-dropdown--full" ref={dropdownRef}>
                  <div className="profile-dropdown__user">
                    <div className="profile-dropdown__avatar">{firstName ? firstName[0].toUpperCase() : "U"}</div>
                    <div className="profile-dropdown__info">
                      <div className="profile-dropdown__name">
                        {localStorage.getItem("firstname") && localStorage.getItem("lastname")
                          ? `${(localStorage.getItem("firstname") || "").toUpperCase()} ${(localStorage.getItem("lastname") || "").toUpperCase()}`
                          : firstName}
                      </div>
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
            <Link to="/login" className="header__login header__login--mobile">
              <span className="header__user-initial">👤</span> Login
            </Link>
          )}
          <button
            className="nav-menu-toggle"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="main-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="main-menu" onClick={e => e.stopPropagation()}>
            <button className="main-menu__close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">&times;</button>
            <div className="main-menu__section main-menu__vertical">
               <a className="main-menu__item main-menu__item--pointer" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}><span className="header__right-domain">RoadReach.com</span></a>
              <a className="main-menu__item" href="#">Membership</a>
              <a className="main-menu__item" href="#" onClick={() => { setHelpOpen(true); setMobileMenuOpen(false); }}>
                <HelpCircle size={20} color="#D32F2F" style={{verticalAlign:'middle',marginRight:2}} />
                <span className="header__help-text">Help Center</span>
              </a>

               <div className="main-menu__item main-menu__item--nopadding">
                <GeoDropdown showOnlyCountry={true} onCountryChange={() => { window.location.reload(); setMobileMenuOpen(false); }} />
              </div>

              <a href="#" className="main-menu__item"><Tag size={24} /> Deals</a>
              <a href="#" className="main-menu__item"><Briefcase size={24} /> Vacation Packages</a>
              <a href="#" className="main-menu__item"><Hammer size={24} /> Build Your Own</a>
              <a href="#" className="main-menu__item"><Hotel size={24} /> Hotels</a>
              <a href="#" className="main-menu__item"><Ship size={24} /> Cruises</a>
              <a href="#" className="main-menu__item"><Ship size={24} /> Shore Excursions</a>
              <a className="main-menu__item" onClick={() => { navigate('/rental-cars'); setMobileMenuOpen(false); }}><Car size={24} /> Rental Cars</a>
              <a href="#" className="main-menu__item"><Truck size={24} /> Budget Truck Rental</a>
              <a href="#" className="main-menu__item"><FlagTriangleRight size={24} /> Theme Parks & Specialty</a>
              <a href="#" className="main-menu__item"><User size={24} /> Account</a>
            </div>
            <div className="main-menu__footer">
              <a href="#" className="main-menu__footer-link"><HelpCircle size={20} /> Help Center</a>
              <a href="#" className="main-menu__footer-link"><Mail size={20} /> Contact Us</a>
              <a href="https://www.costco.com" target="_blank" rel="noopener noreferrer" className="main-menu__footer-link"><ExternalLink size={20} /> Visit Costco.com</a>
            </div>
          </div>
        </div>
      )}


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