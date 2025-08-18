import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login"; // Import the Login component

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;