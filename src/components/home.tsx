import React from "react";
import BackgroundImage from "../assets/backgroundImageHome.jpeg"; // place an image inside assets

const Home: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // fills the viewport
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center", paddingTop: "200px" }}>
        Welcome to RoadReach
      </h1>
    </div>
  );
};

export default Home;
