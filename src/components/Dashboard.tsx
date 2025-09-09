import React from "react";
import Header from "./Header";
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const firstName = localStorage.getItem("firstname") || "User";

  return (
    <div>
      <Header />
      <div className="dashboard-outer">
        <main className="dashboard-main">
          <h2>Welcome, {firstName}!</h2>
          <p>This is your dashboard.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;