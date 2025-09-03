import React, { useEffect, useState, useRef } from "react";
import runSprite from "../assets/Sprite/Run.png";
import idleSprite from "../assets/Sprite/Idle.png"; 
import "../assets/css/practice-sprite.css";

export default function Player() {
  const [frame, setFrame] = useState(0);
  const [position, setPosition] = useState(100);
  const [direction, setDirection] = useState("right");
  const [isRunning, setIsRunning] = useState(false);

  const keysPressed = useRef({});
  
  // Frame sizes per sheet
  const runFrames = 8;
  const runFrameWidth = 231;
  const runFrameHeight = 190;

  const idleFrames = 6;
  const idleFrameWidth = 231;
  const idleFrameHeight = 190;

  // Game loop
  useEffect(() => {
    let lastFrameTime = 0;

    const loop = (time) => {
      const delta = time - lastFrameTime;

      const speed = 3; // Movement speed
      let moving = false;

      if (keysPressed.current["ArrowRight"]) {
        setPosition((prev) => prev + speed);
        setDirection("right");
        moving = true;
      }
      if (keysPressed.current["ArrowLeft"]) {
        setPosition((prev) => prev - speed);
        setDirection("left");
        moving = true;
      }

      if (delta > 120) {
        setFrame((prev) => {
          if (moving) {
            return (prev + 1) % runFrames; 
          } else {
            return (prev + 1) % idleFrames; // cycle 6 frames
          }
        });
        lastFrameTime = time;
      }

      setIsRunning(moving);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //  Pick the correct sprite sheet
  const spriteSheet = isRunning ? runSprite : idleSprite;
  const frameWidth = isRunning ? runFrameWidth : idleFrameWidth;
  const frameHeight = isRunning ? runFrameHeight : idleFrameHeight;

  return (
    <div className="game-container">
      <div
        className="sprite"
        style={{
          left: `${position}px`,
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `-${frame * frameWidth}px 0px`,
          transform: direction === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      />
    </div>
  );
}
