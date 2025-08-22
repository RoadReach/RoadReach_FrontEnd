import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login"; // Import the Login component
import CreateAccount from "./components/CreateAccount";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;