import React, { useState } from "react";
import { Menu } from "lucide-react";
import "../assets/css/navigation.css";
import LoginCard from "../STUDENT/login-card";
import SignupCard from "../STUDENT/register-card";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState(null); // "login" | "signup" | null

  const openPopup = (type) => {
    setPopupType(type); // Set either "login" or "signup"
  };

  const closePopup = () => {
    setPopupType(null); // Close the pop-up
  };

  return (
    <div className="landingpage-container">
      <nav className="nav-bar">
        {/* Burger Menu Button */}
        <button className="burger-menu" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Dropdown Menu (only appears when burger is clicked) */}
        <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
          <a href="/Dashboard">Dashboard</a>
          <a href="/Custom-Room">Custom Room</a>
          <a href="/Achievements">Achievements</a>
          <a href="/Periodic-Table">Periodic Table</a>
          <a href="/Daily-Challenge">Daily Challenge</a>
          <a href="/Sandbox">Sandbox</a>
        </div>

        {/* Left Side - Logo */}
        <a className="logo" href="/">
          ELEMENTOPIA
        </a>

        <div className="nav-links">
        </div>

        {/* Right Side - Login & Sign Up */}
        <div className="auth-links">
          <button className="login-btn" onClick={() => openPopup("login")}>
            Login
          </button>
          <button className="signup-btn" onClick={() => openPopup("signup")}>
            Sign Up
          </button>
        </div>
      </nav>

    {popupType && (
      <div className="popup-overlay" onClick={closePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          
          {popupType === "login" ? (
            <LoginCard 
              onSwitchToSignup={() => openPopup("signup")} 
            />
          ) : (
            <SignupCard 
              onRegisterSuccess={closePopup} 
              onSwitchToLogin={() => openPopup("login")} 
            />
          )}

        </div>
      </div>
    )}
    </div>
  );
}
