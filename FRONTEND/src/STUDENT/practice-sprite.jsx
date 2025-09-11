import React, { useEffect, useState, useRef } from "react";
// Make sure this CSS path is correct for your project
import "../assets/css/practice-sprite.css";

// Make sure these asset paths are correct for your project
import runSprite from "../assets/Sprite/run.png";
import idleSprite from "../assets/Sprite/idle.png";
import jumpSprite from "../assets/Sprite/Jump.png";
import attackSprite from "../assets/Sprite/Attack1.png";

// --- Minigame Component ---
const ChemicalChallenge = ({ lesson, onComplete, onIncorrect }) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("Fix this reaction!");

  const checkAnswer = () => {
    if (!lesson) return;
    const correctAnswer = "2";

    if (answer === correctAnswer) {
      setFeedback("Correct! The equation is now balanced!");
      setTimeout(() => {
        onComplete(lesson.id);
      }, 1500);
    } else {
      onIncorrect();
      setFeedback(
        "That's not it. Let's look at the oxygen atoms. We have two oxygens on the left side (O₂). How many do we need on the right?"
      );
    }
  };

  return (
    <div className="challenge-popup">
      <h2>Challenge: Balance the Equation</h2>
      <p className="equation-text">
        2H₂ + O₂ →
        <span>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="answer-input"
            maxLength="1"
          />
        </span>
        H₂O
      </p>
      <button onClick={checkAnswer}>Check Answer</button>
      <p className="feedback-text">{feedback}</p>
    </div>
  );
};

// --- Main Sprite Component ---
export default function PracticeSprite() {
  // --- Sprite Frames ---
  const runFrames = 8, runFrameWidth = 231, runFrameHeight = 190;
  const idleFrames = 6, idleFrameWidth = 231, idleFrameHeight = 190;
  const jumpFrames = 2, jumpFrameWidth = 231, jumpFrameHeight = 190;
  const attackFrames = 8, attackFrameWidth = 231, attackFrameHeight = 190;

  // --- States ---
  const [frame, setFrame] = useState(0);
  const [spriteState, setSpriteState] = useState("idle");
  const [direction, setDirection] = useState("right");
  const [position, setPosition] = useState(300);
  const [y, setY] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState([]);
  const [gameState, setGameState] = useState("gameplay");
  const [canJump, setCanJump] = useState(true);

  // --- Refs ---
  const bgRef = useRef(null);
  const bgX = useRef(0);
  const requestRef = useRef();
  const keys = useRef({});

  // --- Constants ---
  const speed = 4;
  const gravity = 1;
  const jumpStrength = 15;
  const groundLevel = 0;

  // --- Lessons and minigame positions ---
  const lessonStations = [
    { id: 1, x: 2000, title: "Lesson 1: Atoms & Molecules", text: "...", minigameTriggerX: 2450, wallX: 2500 },
    { id: 2, x: 4000, title: "Lesson 2: Ionic vs Covalent", text: "...", minigameTriggerX: 4450, wallX: 4500 },
  ];

  // --- Sprite Animation Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      let totalFrames;
      if (spriteState === "run") totalFrames = runFrames;
      else if (spriteState === "jump") totalFrames = jumpFrames;
      else if (spriteState === "attack") totalFrames = attackFrames;
      else totalFrames = idleFrames;

      setFrame((prev) => (prev + 1) % totalFrames);
    }, 100);

    return () => clearInterval(interval);
  }, [spriteState]);

  // --- Main Game Loop and Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === " " && gameState === "gameplay") {
        setSpriteState("attack");
      }
    };
    const handleKeyUp = (e) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = () => {
      let currentY = 0;
      let currentSpriteState = "idle";
      setY(prevY => { currentY = prevY; return prevY; });
      setSpriteState(prevSpriteState => { currentSpriteState = prevSpriteState; return prevSpriteState; });

      setVelocityY((prevVelY) => {
        let newY = currentY + prevVelY;
        let newVel = prevVelY - gravity;
        if (newY <= groundLevel) {
          newY = groundLevel;
          newVel = 0;
          if (!canJump) setCanJump(true);
          if (currentSpriteState === "jump") {
            const isMoving = keys.current["ArrowLeft"] || keys.current["ArrowRight"];
            setSpriteState(isMoving ? "run" : "idle");
          }
        }
        setY(newY);
        return newVel;
      });
      
      if (gameState === "gameplay") {
        if (keys.current["ArrowUp"] && canJump) {
          setVelocityY(jumpStrength);
          setSpriteState("jump");
          setCanJump(false);
        }
        
        const currentWall = lessonStations.find((ls) => ls.wallX && !lessonCompleted.includes(ls.id));
        
        setPosition(prevPosition => {
          let newPosition = prevPosition;
          if (keys.current["ArrowRight"] && spriteState !== "attack") newPosition += speed;
          if (keys.current["ArrowLeft"] && spriteState !== "attack") newPosition -= speed;

          const isWallBlocked = currentWall && newPosition >= currentWall.wallX;
          if(isWallBlocked) newPosition = currentWall.wallX;

          const actualMovement = newPosition - prevPosition;
          bgX.current -= actualMovement * 0.5;

          if(actualMovement > 0) setDirection("right");
          if(actualMovement < 0) setDirection("left");

          if (spriteState !== "jump" && spriteState !== "attack") {
            setSpriteState(actualMovement !== 0 ? "run" : "idle");
          }
          
          const minigameTrigger = lessonStations.find((ls) => ls.minigameTriggerX && Math.abs(newPosition - ls.minigameTriggerX) < 50 && !lessonCompleted.includes(ls.id));
          const station = lessonStations.find((ls) => Math.abs(newPosition - ls.x) < 100 && !lessonCompleted.includes(ls.id));

          if (minigameTrigger) {
            setActiveLesson(minigameTrigger);
            setGameState("challenge");
          } else {
            setActiveLesson(station);
          }
          return newPosition;
        });
      }

      if (bgRef.current) {
        bgRef.current.style.backgroundPosition = `${bgX.current}px bottom`;
      }
      requestRef.current = requestAnimationFrame(update);
    };
    requestRef.current = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, lessonCompleted, canJump]);

  let spriteSheet, frameWidth, frameHeight;
  switch (spriteState) {
    case "run": spriteSheet = runSprite; frameWidth = runFrameWidth; frameHeight = runFrameHeight; break;
    case "jump": spriteSheet = jumpSprite; frameWidth = jumpFrameWidth; frameHeight = jumpFrameHeight; break;
    case "attack": spriteSheet = attackSprite; frameWidth = attackFrameWidth; frameHeight = attackFrameHeight; break;
    default: spriteSheet = idleSprite; frameWidth = idleFrameWidth; frameHeight = idleFrameHeight;
  }

  return (
    <div className="game" ref={bgRef}>
      {lessonStations.map((station) => (
        <div key={station.id} className="lesson-station" style={{ left: `${station.x - position + 300}px`, bottom: "60px" }}/>
      ))}

      <div className="sprite" style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${frame * frameWidth}px 0px`,
          transform: direction === "left" ? "scaleX(-1)" : "scaleX(1)",
          left: "300px",
          bottom: `${50 + y}px`,
          zIndex: 5, // <-- Z-INDEX FIX
        }}
      />

      {activeLesson && gameState !== "challenge" && (
        <div className="lesson-popup-container" style={{
          position: 'absolute',
          left: `${activeLesson.x - position + 320}px`,
          bottom: '80px',
          width: '300px',
          zIndex: 10, // <-- Z-INDEX FIX (higher than sprite)
        }}>
          <div className="lesson-popup">
            <h2>{activeLesson.title}</h2>
            <p>{activeLesson.text}</p>
          </div>
        </div>
      )}

      {gameState === "challenge" && activeLesson && (
        <div className="challenge-popup-overlay">
          <ChemicalChallenge
            lesson={activeLesson}
            onComplete={(id) => {
              setSpriteState("attack");
              setLessonCompleted((prev) => [...prev, id]);
              setActiveLesson(null);
              setTimeout(() => {
                setGameState("gameplay");
                setSpriteState("idle"); 
              }, 800); 
            }}
            onIncorrect={() => {}}
          />
        </div>
      )}
    </div>
  );
}