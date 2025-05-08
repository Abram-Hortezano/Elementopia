import { useEffect, useRef } from "react";
import "../assets/css/MissionSection.css"; 
import "../assets/css/MissionSection.css";

const MissionSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  return (
    <div className="content-introduction" ref={sectionRef}>
      <h2 className="content-intro-title">Our Mission</h2>
      <p className="content-intro-desc">
        Our mission is to make learning chemistry fun and engaging for students
        of all ages. We believe that by combining education with entertainment,
        we can create a unique learning experience that will help students
        master the fundamentals of chemistry.
      </p>
    </div>
  );
};

export default MissionSection;
