import React, { useState } from "react";
import "../assets/css/landing-page.css";
// Import your Login component (adjust the path if needed)
import Login from "./login-card"; 
// Import Signup if you have it, to handle the switch
import Register from "./register-card"; // Assuming you have this

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import animationGif from "../assets/img/animation-loop.gif";
import MissionSection from "./MissionSection";
import Carousel from "./Carousel";
import Footer from "../components/footer";
import Navigation from "../components/navigation";

function LandingPage() {
  // State for the popups
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Handlers
  const handleOpenLogin = (e) => {
    if(e) e.preventDefault();
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleCloseAll = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div className="root">
      <div className="landingpage-container">
        <Navigation />
        <div id="header-container">
          <div className="content-header">
            <h1 className="content-title">
              Master <span id="chemStruc">Chemical Structures</span> Through{" "}
              <span id="play">Play</span>
            </h1>
            <p className="content-desc">
              Build, explore, and learn molecular structures in our engaging 2D
              chemistry game. Perfect for students, educators, and chemistry
              enthusiasts.
            </p>
            <div className="content-buttons">
              <a href="#" onClick={handleOpenLogin} className="btn-get-started">
                Get Started
              </a>
              <a href="/about-us" className="btn-learn-more">
                Learn More
              </a>
            </div>
          </div>
          <div id="gif-container">
            <img src={animationGif} alt="Chemistry GIF" className="gif-image" />
          </div>
        </div>
        
        <div className="MissionSection">
          <MissionSection />
        </div>
        <div className="Carousel">
          <Carousel />
        </div>
        <footer>
          <Footer />
        </footer>
      </div>

      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={handleCloseAll}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {showLogin && (
              <Login 
                onLoginSuccess={handleCloseAll} 
                onSwitchToSignup={handleSwitchToSignup} 
              />
            )}

            {showRegister && (
               <Register 
                 onRegisterSuccess={handleSwitchToLogin}
                 onSwitchToLogin={handleSwitchToLogin}
               />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;