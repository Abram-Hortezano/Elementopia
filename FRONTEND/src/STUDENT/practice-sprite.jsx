import React, { useEffect, useState, useRef } from "react";
import "../assets/css/practice-sprite.css";
import runSprite from "../assets/Sprite/run.png";
import idleSprite from "../assets/Sprite/idle.png";
import jumpSprite from "../assets/Sprite/Jump.png";
import attackSprite from "../assets/Sprite/Attack1.png";
import background from "../assets/background/game_background_3.1.png";

export default function PracticeSprite() {
  // --- Sprite frame data ---
  const runFrames = 8;
  const runFrameWidth = 231;
  const runFrameHeight = 190;

  const idleFrames = 6;
  const idleFrameWidth = 231;
  const idleFrameHeight = 190;

  const jumpFrames = 2;   // ✅ corrected
  const jumpFrameWidth = 231;
  const jumpFrameHeight = 190;

  const attackFrames = 8; // ✅ corrected
  const attackFrameWidth = 231;
  const attackFrameHeight = 190;

  // --- State ---
  const [frame, setFrame] = useState(0);
  const [spriteState, setSpriteState] = useState("idle");
  const [direction, setDirection] = useState("right");
  const [position, setPosition] = useState(300);
  const [y, setY] = useState(0); // vertical position (jump)
  const [velocityY, setVelocityY] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  // --- Refs ---
  const bgRef = useRef(null);
  const bgX = useRef(0);
  const requestRef = useRef();
  const keys = useRef({});

  const speed = 4;
  const gravity = 1;
  const jumpStrength = 15;
  const groundLevel = 0; // baseline Y

  const lessonStations = [
    {
      id: 1,
      x: 2000,
      title: "Lesson 1: Atoms & Molecules",
      text: "Atoms are the building blocks of matter. Molecules form when atoms bond together, like H₂O.",
    },
    {
      id: 2,
      x: 4000,
      title: "Lesson 2: Ionic vs Covalent",
      text: "Ionic bonds transfer electrons, while covalent bonds share them.",
    },
  ];

  // --- Sprite frame animation ---
  useEffect(() => {
    const interval = setInterval(() => {
      let totalFrames =
        spriteState === "run"
          ? runFrames
          : spriteState === "jump"
          ? jumpFrames
          : spriteState === "attack"
          ? attackFrames
          : idleFrames;

      setFrame((prev) => (prev + 1) % totalFrames);

      // Attack should auto-return to idle/run after one cycle
      if (spriteState === "attack" && frame === totalFrames - 1) {
        setSpriteState("idle");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [spriteState, frame]);

  // --- Movement + background scroll ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;

      if (e.key === "ArrowRight") {
        setDirection("right");
        if (spriteState !== "jump" && spriteState !== "attack") {
          setSpriteState("run");
        }
      }
      if (e.key === "ArrowLeft") {
        setDirection("left");
        if (spriteState !== "jump" && spriteState !== "attack") {
          setSpriteState("run");
        }
      }
      if (e.key === "ArrowUp") {
        if (y === groundLevel) {
          setVelocityY(jumpStrength);
          setSpriteState("jump");
        }
      }
      if (e.key === " ") {
        setSpriteState("attack");
        setFrame(0); // restart animation
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;

      if (!keys.current["ArrowLeft"] && !keys.current["ArrowRight"]) {
        if (spriteState !== "jump" && spriteState !== "attack") {
          setSpriteState("idle");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = () => {
      // Horizontal movement
      if (keys.current["ArrowRight"] && spriteState !== "attack") {
        setPosition((prev) => prev + speed);
        bgX.current -= speed;
      }
      if (keys.current["ArrowLeft"] && spriteState !== "attack") {
        setPosition((prev) => prev - speed);
        bgX.current += speed;
      }

// Gravity + jump physics
setY((prevY) => {
  let newY = prevY + velocityY;
  let newVel = velocityY - gravity; // ✅ subtract gravity so velocity decreases over time

  if (newY <= groundLevel) {
    newY = groundLevel;
    newVel = 0;
    if (spriteState === "jump") {
      // return to run/idle after landing
      if (keys.current["ArrowLeft"] || keys.current["ArrowRight"]) {
        setSpriteState("run");
      } else {
        setSpriteState("idle");
      }
    }
  }

  setVelocityY(newVel);
  return newY;
});


      if (bgRef.current) {
        bgRef.current.style.backgroundPosition = `${bgX.current}px bottom`;
      }

      // Lesson discovery
      const station = lessonStations.find(
        (ls) => Math.abs(position - ls.x) < 50
      );
      if (station) {
        setActiveLesson(station);
      } else {
        if (activeLesson) setActiveLesson(null);
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [spriteState, y, velocityY, activeLesson, lessonStations, position]);

  // --- Pick correct sprite sheet + frame size ---
  let spriteSheet, frameWidth, frameHeight, totalFrames;

  switch (spriteState) {
    case "run":
      spriteSheet = runSprite;
      frameWidth = runFrameWidth;
      frameHeight = runFrameHeight;
      totalFrames = runFrames;
      break;
    case "jump":
      spriteSheet = jumpSprite;
      frameWidth = jumpFrameWidth;
      frameHeight = jumpFrameHeight;
      totalFrames = jumpFrames;
      break;
    case "attack":
      spriteSheet = attackSprite;
      frameWidth = attackFrameWidth;
      frameHeight = attackFrameHeight;
      totalFrames = attackFrames;
      break;
    default:
      spriteSheet = idleSprite;
      frameWidth = idleFrameWidth;
      frameHeight = idleFrameHeight;
      totalFrames = idleFrames;
  }

  return (
    <div className="game" ref={bgRef}>
      {lessonStations.map((station) => (
        <div
          key={station.id}
          className="lesson-station"
          style={{
            left: `${station.x - position + 300}px`,
            bottom: "60px",
          }}
        />
      ))}

      <div
        className="sprite"
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${frame * frameWidth}px 0px`,
          transform: direction === "left" ? "scaleX(-1)" : "scaleX(1)",
          left: "300px",
          bottom: `${50 + y}px`,
        }}
      />

      {activeLesson && (
        <div className="lesson-popup">
          <h2>{activeLesson.title}</h2>
          <p>{activeLesson.text}</p>
        </div>
      )}
    </div>
  );
}
