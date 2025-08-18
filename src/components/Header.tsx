import React, {useState} from "react";
import { Link } from "react-router-dom";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import { HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("us");
  return (
// ...existing code...
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
          <a href="#" style={styles.topLink}>RoadReach.com</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink}>Membership</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink}><HelpCircle style={{ color: "#ff0000ff" }} size={13} /> Help Center</a>
          <span style={styles.separator}>|</span>
          <span style={{ color: "#004B8D", fontWeight: 600 }}>
            📞 1-520-482-8859
          </span>
          <span style={styles.separator}>|</span>
          <span style={styles.flag}>{countryFlags[selectedCountry]}</span>
          <select
            style={styles.countrySelect}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="us">USA</option>
            <option value="ca">Canada</option>
            <option value="uk">UK</option>
            <option value="in">India</option>
            <option value="au">Australia</option>
          </select>
          <span style={styles.separator}>|</span>          <span style={styles.separator}>|</span>
          <Link to="/login" style={styles.login}>
            <span style={{ fontSize: 18 }}>👤</span> Login
          </Link>
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
          <a href="#" style={styles.navLink}>RENTAL CARS</a>
          <a href="#" style={styles.navLink}>THEME PARKS & SPECIALTY</a>
        </nav>
      </div>
    </header>
  );
};
const countryFlags: { [key: string]: string } = {
  us: "🇺🇸",
  ca: "🇨🇦",
  uk: "🇬🇧",
  in: "🇮🇳",
  au: "🇦🇺",
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
    paddingLeft: "520px",
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