import React from "react";
//import roadReachLogo from "../assets/roadreach-logo.png";

const Header: React.FC = () => {
  return (
    <header style={{ fontFamily: "Arial, sans-serif", borderBottom: "1px solid #ccc" }}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}></div>
        <div style={styles.topRight}>
          <a href="#" style={styles.topLink}>RoadReach.com</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink}>Membership</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.topLink}>Help Center</a>
          <span style={styles.separator}>|</span>
          <span style={{ color: "#004B8D", fontWeight: 600 }}>
            📞 1-520-482-8859
          </span>
          <span style={styles.separator}>|</span>
          <span style={styles.flag}>🇺🇸</span>
          <span style={styles.separator}>|</span>
          <span style={styles.login}>
            <span style={{ fontSize: 18 }}>👤</span> Login
          </span>
        </div>
      </div>

      {/* Main nav bar */}
      <div style={styles.mainBar}>
        {/* Logo */}
        <div>
          {/* <img src={roadReachLogo} alt="RoadReach Logo" style={styles.logo} /> */}
        </div>

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

const styles: { [key: string]: React.CSSProperties } = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 20px",
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
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderTop: "1px solid #eee",
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