import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle } from 'lucide-react';
import GeoDropdown from './GeoDropdown';
import HelpCenter from './HelpCenter';

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
    <header
      style={{
        fontFamily: "Arial, sans-serif",
        borderBottom: "1px solid #ccc",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "#fff",
        zIndex: 1000,
      }}
    >
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}> {/* Logo */}

            <img src={RoadReachLogo} width={100} height={50} alt="RoadReach Logo" />

        </div>
        <div style={styles.topRight}>
          <Link to="/" style={styles.topLink}>
            RoadReach.com
          </Link>

          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink}>Membership</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink} onClick={() => setHelpOpen(true)}><HelpCircle style={{ color: "#ff0000ff" }} size={13} /> Help Center</a>
          <span style={styles.separator}>|</span>
          <span style={{ color: "#004B8D", fontWeight: 600 }}>
            📞 1-520-483-8758
          </span>
          <span style={styles.separator}>|</span>
           <GeoDropdown showOnlyCountry={true} onCountryChange={() => window.location.reload()} />
          <span style={styles.separator}>|</span>
          {firstName ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <span
                style={{ color: "#004B8D", fontWeight: 500, cursor: "pointer" }}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                👤 {firstName}
              </span>
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    style={{
                      display: "block",
                      color: "#005DA6",
                      textDecoration: "none",
                      fontSize: "13px",
                      padding: "8px 12px",
                    }}
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      color: "#005DA6",
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: "8px 12px",
                      textAlign: "center",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={styles.login}>
              <span style={{ fontSize: 18 }}>👤</span> Login
            </Link>
          )}
        </div>
      </div>

      {/* Main nav bar */}
      <div style={styles.mainBar}>

        {/* Navigation menu */}
        <nav style={styles.nav}>
          <a href="#" style={styles.navLink}>DEALS</a>
          <a href="#" style={styles.navLink}>DESTINATIONS</a>
          <a href="#" style={styles.navLink}>BUILD YOUR OWN TRIP</a>
          <a href="#" style={styles.navLink}>CRUISES</a>
          <Link to="/rental-cars" style={styles.navLink}>RENTAL CARS</Link>
          <a href="#" style={styles.navLink}>THEME PARKS & SPECIALTY</a>
        </nav>
      </div>
      <HelpCenter open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>

  );
};


const styles: { [key: string]: React.CSSProperties } = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 220px",
    fontSize: "13px",
    backgroundColor: "#fff",
    color: "#333",
  },
  topLeft: {},
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  topLink: {
    color: "#004B8D",
    textDecoration: "none",
    fontWeight: 500,
  },
  separator: {
    margin: "0 4px",
    color: "#ccc",
  },
  flag: {
    fontSize: 16,
  },
  login: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#004B8D",
    fontWeight: 500,
  },
  mainBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "720px",
    //paddingRight: "220px",
    backgroundColor: "#fff",
  },
  logo: {
    height: 50,
  },
  nav: {
    display: "flex",
    gap: 25,
  },
  navLink: {
    color: "#004B8D",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: 14,
  },
};

export default Header;