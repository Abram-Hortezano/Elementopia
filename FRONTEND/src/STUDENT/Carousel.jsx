import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MapTree from "../assets/carousel-assets/student-map-tree.png"
import chemSim from "../assets/carousel-assets/student-chem-simulation.png"
import achievement from "../assets/carousel-assets/student-achievement-page.png"
import studentHomepage from "../assets/carousel-assets/student-home-page.png"
import createSection from "../assets/carousel-assets/teacher-section-create.png"
import viewStudent from "../assets/carousel-assets/teacher-section-student-view.png"
import viewSection from "../assets/carousel-assets/teacher-section-view.png"
import "../assets/css/Carousel.css"; 
import "../assets/css/Carousel.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-label">Game Highlights</h2>
      <Slider {...settings}>
        <div className="carousel-slide">
          <img
            src={MapTree}
            alt="Slide 1"
          />
        </div>
        <div className="carousel-slide">
          <img
            src={chemSim}
            alt="Slide 2"
          />
        </div>
        <div className="carousel-slide">
          <img
            src={achievement}
            alt="Slide 3"
          />
        </div>
        <div className="carousel-slide">
          <img
            src={studentHomepage}
            alt="Slide 4"
          />
        </div>
        <div className="carousel-slide">
          <img
            src={createSection}
          />
        </div>
        <div className="carousel-slide">
          <img
            src={viewStudent}
          />
        </div>
        <div className="carousel-slide">
          <img
            src={viewSection}
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
