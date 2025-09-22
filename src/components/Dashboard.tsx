import React from "react";
import Header from "./Header";
import './Dashboard.css';
import { useSessionTimeout } from "../hooks/useSessionTimeout";

const Dashboard: React.FC = () => {
  useSessionTimeout({onLogout: () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  });

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