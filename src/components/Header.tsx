import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle, PhoneCall, Menu } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const userRef = useRef<HTMLSpanElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const headerLinks = [
    { type: "link", label: "RoadReach.com", to: "/", className: "header__link header__link--light" },
    { type: "sep" },
    { type: "link", label: "Membership", to: "#", className: "header__link header__link--light" },
    { type: "sep" },
    { type: "help" },
    { type: "sep" },
    { type: "phone" },
    { type: "sep" },
    { type: "geo" }
  ];

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
        {!isMobile && (
          <>
            {headerLinks.map((item, idx) => {
              if (item.type === "sep") {
                return <span key={idx} className="header__sep header__sep--tall">|</span>;
              }
              if (item.type === "link") {
                return (
                  <Link key={idx} to={item.to} className={item.className}>{item.label}</Link>
                );
              }
              if (item.type === "help") {
                return (
                  <a
                    key={idx}
                    href="#"
                    className="header__link header__help-link"
                    onClick={() => setHelpOpen(true)}
                  >
                    <HelpCircle size={16} color="#D32F2F" style={{verticalAlign:'middle',marginRight:2}} />
                    <span className="header__help-text">Help Center</span>
                  </a>
                );
              }
              if (item.type === "phone") {
                return (
                  <a
                    key={idx}
                    href="tel:+18669217925"
                    className="header__phone header__phone--bold"
                    aria-label="Call 1 866 921 7925"
                  >
                    <span className="header__phone-number header__phone-number--solid">📞 1-866-921-7925</span>
                  </a>
                );
              }
              if (item.type === "geo") {
                return (
                  <GeoDropdown
                    key={idx}
                    showOnlyCountry={true}
                    onCountryChange={() => window.location.reload()}
                  />
                );
              }
              return null;
            })}
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
              <Link to="/login" className="header__login">
                <span className="header__user-initial">👤</span> Login
              </Link>
            )}
          </>
        )}

        {isMobile && (
          <>
            <button
              className="header__hamburger"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={32} />
            </button>
          </>
        )}
      </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="header__mobile-menu">
          {/* User section */}
          {firstName && (
            <div className="header__mobile-user">{firstName}</div>
          )}

          {/* Main links */}
          {headerLinks.map((item, idx) => {
            if (item.type === "sep") return null;
            if (item.type === "link") {
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className={item.className}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }
            if (item.type === "help") {
              return (
                <a
                  key={idx}
                  href="#"
                  className="header__link header__help-link"
                  onClick={() => { setHelpOpen(true); setMobileMenuOpen(false); }}
                >
                  <HelpCircle size={16} color="#D32F2F" style={{ verticalAlign: 'middle', marginRight: 2 }} />
                  <span className="header__help-text">Help Center</span>
                </a>
              );
            }
            if (item.type === "phone") {
              return (
                <a
                  key={idx}
                  href="tel:+18669217925"
                  className="header__phone header__phone--bold"
                  aria-label="Call 1 866 921 7925"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="header__phone-number header__phone-number--solid">📞 1-866-921-7925</span>
                </a>
              );
            }
            if (item.type === "geo") {
              return (
                <GeoDropdown
                  key={idx}
                  showOnlyCountry={true}
                  onCountryChange={() => { window.location.reload(); setMobileMenuOpen(false); }}
                />
              );
            }
            return null;
          })}

          {/* Account links */}
          {firstName ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="header__link">Account</Link>
              <Link to="/bookings" onClick={() => setMobileMenuOpen(false)} className="header__link">Bookings</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="header__link">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="header__link">Login</Link>
          )}
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