import React from "react";
import Header from "./Header";

const Dashboard: React.FC = () => {
  const firstName = localStorage.getItem("firstname") || "User";

  return (
    <div>
      <Header />
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h2>Welcome, {firstName}!</h2>
        <p>This is your dashboard.</p>
      </main>
    </div>
  );
};

export default Dashboard;