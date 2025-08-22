import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login"; // Import the Login component
import CreateAccount from "./components/CreateAccount";
import Home from "./components/home";
import Dashboard from './components/Dashboard';
import RentalCars from './components/rentalCars';
import Profile from "./components/profile";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rental-cars" element={<RentalCars />} /> {/* rental cars page */}
          <Route path="/profile" element={<Profile />} />
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