import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
            src="https://imgs.search.brave.com/Jx8eAt3b3FFc7T8qGmK4AjpohtGB8b4pA1TYkGAkfTQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzY1LzEzLzk0/LzM2MF9GXzk2NTEz/OTQwOV9JT21HVGVQ/Z2ZFVW44ek1YWnFw/YTlPRXRpRmJndkVC/TC5qcGc"
            alt="Slide 1"
          />
        </div>
        <div className="carousel-slide">
          <img
            src="https://imgs.search.brave.com/o8RJsyBu9AEl2ypNLchMlnv-6kg8ttNiHYsxevChiiQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzYxLzg3LzE3/LzM2MF9GXzk2MTg3/MTc4M19GcGNkd1Zu/bmlJY21tT3YwcjJu/bzJ0MVVxeU9HWEVF/eC5qcGc"
            alt="Slide 2"
          />
        </div>
        <div className="carousel-slide">
          <img
            src="https://cdn1.epicgames.com/spt-assets/419bd4760ed0465ba7f365f56f47d163/shrapnel-19nie.jpg?resize=1&w=480&h=270&quality=medium"
            alt="Slide 3"
          />
        </div>
        <div className="carousel-slide">
          <img
            src="https://cdn1.epicgames.com/spt-assets/419bd4760ed0465ba7f365f56f47d163/shrapnel-19nie.jpg?resize=1&w=480&h=270&quality=medium"
            alt="Slide 4"
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
