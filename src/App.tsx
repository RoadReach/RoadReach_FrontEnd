import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login"; // Import the Login component
import CreateAccount from "./components/CreateAccount";
import Home from "./components/home";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className='app-layout'>
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />   {/* homepage */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </main>

      <footer className='footer'>
        <p>© 2025 RoadReach. All rights reserved.</p>
      </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;