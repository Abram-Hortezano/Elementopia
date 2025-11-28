import React from "react";
import "../assets/css/landing-page.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import animationGif from "../assets/img/animation-loop.gif";
import MissionSection from "./MissionSection";
import Carousel from "./Carousel";
import Footer from "../components/footer";
import Navigation from "../components/navigation";

function LandingPage() {
  // console.log("LandingPage component rendered!");
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
            <a href="/login">Get Started</a>
            <a href="/about-us">Learn More</a>
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

  </div>
  
  );
}

export default LandingPage;
