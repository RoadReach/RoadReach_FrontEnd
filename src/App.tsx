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
import SelectVehicle from './components/SelectVehicle';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />   {/* homepage */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rental-cars" element={<RentalCars />} /> {/* rental cars page */}
          <Route path="/select-vehicle" element={<SelectVehicle />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '5px 0', backgroundColor: '#f5f5f5', marginTop: '40px' }}>
        <p>© 2025 RoadReach. All rights reserved.</p>
      </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;