
import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login";
import CreateAccount from "./components/CreateAccount";
import Home from "./components/home";
import Dashboard from './components/Dashboard';
import RentalCars from './components/rentalCars';
import Profile from "./components/profile";
import SelectVehicle from './components/SelectVehicle';
import Footer from './components/Footer';


const AppContent: React.FC = () => {
  // Always show header (with logo) on all pages
  return (
    <div>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rental-cars" element={<RentalCars />} />
          <Route path="/select-vehicle" element={<SelectVehicle />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;