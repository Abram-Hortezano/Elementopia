import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Circle, Text, Group } from "react-konva";
import Konva from "konva";
import "./BondBuilderModule.css";

const storySteps = [
  "intro",
  "ionic",
  "covalent",
  "metallic",
  "finished",
];

const bondingInfo = {
  Ionic: {
    description: `
      Ionic bonding happens when a metal atom donates electron(s) to a non-metal atom,
      forming positively and negatively charged ions attracted to each other.
    `,
    example: `Na (1e⁻) → Na⁺ + e⁻, Cl (7e⁻) + e⁻ → Cl⁻ → NaCl`,
    animation: `🔴 → ⚫ → [Na⁺ ◀️ Cl⁻]`
  },
  Covalent: {
    description: `
      Covalent bonding occurs when two non-metal atoms share electron pairs to complete their outer shells.
      Examples include single, double, and triple bonds.
    `,
    example: `H + H → H₂ (2 shared e⁻), O + O → O₂ (4 shared e⁻)`,
    animation: `⚪–⚪`
  },
  Metallic: {
    description: `
      Metallic bonding is a lattice of metal atoms surrounded by a sea of delocalized electrons,
      allowing conductivity and malleability.
    `,
    example: `Fe atoms surrounded by free electrons in a lattice`,
    animation: `🔩~⚡~🔩~⚡~🔩`
  }
};

const Electron = ({ x, y, draggable, onDragMove, id }) => (
  <Circle
    id={id}
    x={x}
    y={y}
    radius={8}
    fill="#ff0"
    stroke="#aa0"
    strokeWidth={1}
    draggable={draggable}
    onDragMove={onDragMove}
  />
);

const Atom = ({ x, y, color, label }) => (
  <>
    <Circle radius={50} x={x} y={y} fill={color} stroke="#333" strokeWidth={2} />
    <Text x={x - 25} y={y - 10} text={label} fontSize={18} fill="#fff" />
  </>
);

export default function BondingStory() {
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState("Welcome! Let's explore atomic bonding.");
  const [electronPos, setElectronPos] = useState({ x: 180, y: 200 });
  const [electronSharedPos, setElectronSharedPos] = useState({ x: 300, y: 200 });
  const [practiceElectrons, setPracticeElectrons] = useState([
    { x: 150 + Math.cos(0) * 70, y: 200 + Math.sin(0) * 70 },
    { x: 450 + Math.cos(0) * 70, y: 200 + Math.sin(0) * 70 }
  ]);
  const [practiceMode, setPracticeMode] = useState(false);
  const electronRef = useRef(null);
  const stageRef = useRef(null);

  const currentStep = storySteps[stepIndex];

  // Ionic animation: electron moves from Na (A) to Cl (B)
  const runIonicAnimation = () => {
    setMessage("Atom A (Na) donates an electron to Atom B (Cl).");
    if (!electronRef.current) return;

    new Konva.Tween({
      node: electronRef.current,
      duration: 2,
      x: 420,
      y: 200,
      onFinish: () => {
        setMessage("Electron transferred! Na⁺ and Cl⁻ ions formed.");
      }
    }).play();
  };

  // Advance story step handler
  const nextStep = () => {
    if (stepIndex === storySteps.length - 1) {
      setMessage("You finished the bonding story! 🎉");
      return;
    }

    setMessage("");
    setPracticeMode(false);
    setStepIndex(stepIndex + 1);

    // Reset positions for animations or practice
    if (storySteps[stepIndex + 1] === "ionic") {
      setElectronPos({ x: 180, y: 200 });
    }
    if (storySteps[stepIndex + 1] === "covalent") {
      // Reset shared electrons to start positions
      setPracticeElectrons([
        { x: 150 + Math.cos(0) * 70, y: 200 + Math.sin(0) * 70 },
        { x: 450 + Math.cos(0) * 70, y: 200 + Math.sin(0) * 70 }
      ]);
    }
  };

  // Covalent electron drag handler
  const handlePracticeElectronDrag = (index, e) => {
    const pos = { x: e.target.x(), y: e.target.y() };
    setPracticeElectrons((prev) => {
      const copy = [...prev];
      copy[index] = pos;
      return copy;
    });
  };

  return (
    <div className="bonding-container" style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Atomic Bonding Story Mode 🔬</h1>

      <Stage width={600} height={400} ref={stageRef} style={{ border: "1px solid #ccc" }}>
        <Layer>
          {currentStep === "intro" && (
            <>
              <Atom x={300} y={200} color="#6ca0dc" label="Atom (You)" />
              <Text
                x={150}
                y={350}
                text="You are a lonely atom seeking stability."
                fontSize={18}
                fill="#333"
              />
            </>
          )}

          {currentStep === "ionic" && (
            <>
              <Atom x={150} y={200} color="#6ca0dc" label="Na (Metal)" />
              <Atom x={450} y={200} color="#dc6c6c" label="Cl (Non-metal)" />

              {/* Electron starting near Na */}
              <Electron
                x={electronPos.x}
                y={electronPos.y}
                id="ionicElectron"
                ref={electronRef}
                draggable={false}
              />
            </>
          )}

          {currentStep === "covalent" && (
            <>
              <Atom x={150} y={200} color="#6ca0dc" label="H Atom" />
              <Atom x={450} y={200} color="#6ca0dc" label="H Atom" />

              {/* Electrons orbiting each atom; user can drag */}
              <Electron
                x={practiceElectrons[0].x}
                y={practiceElectrons[0].y}
                draggable={practiceMode}
                onDragMove={(e) => handlePracticeElectronDrag(0, e)}
              />
              <Electron
                x={practiceElectrons[1].x}
                y={practiceElectrons[1].y}
                draggable={practiceMode}
                onDragMove={(e) => handlePracticeElectronDrag(1, e)}
              />

              {/* Shared electron pair in middle */}
              <Circle
                x={300}
                y={200}
                radius={12}
                fill="rgba(255,255,0,0.7)"
                stroke="#aa0"
                strokeWidth={2}
              />
              <Text
                x={200}
                y={350}
                text="Drag electrons to the middle to share and form a covalent bond!"
                fontSize={16}
                fill="#333"
              />
            </>
          )}

          {currentStep === "metallic" && (
            <>
              {/* Multiple metal atoms in lattice */}
              {[...Array(4)].map((_, i) => {
                const x = 200 + (i % 2) * 150;
                const y = 150 + Math.floor(i / 2) * 150;
                return <Atom key={i} x={x} y={y} color="#b5b500" label="Fe Atom" />;
              })}

              {/* Sea of electrons */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * 2 * Math.PI;
                const radius = 120;
                const x = 300 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                return (
                  <Circle
                    key={i}
                    x={x}
                    y={y}
                    radius={8}
                    fill="#ff0"
                    stroke="#aa0"
                    strokeWidth={1}
                    opacity={0.7}
                  />
                );
              })}
              <Text
                x={120}
                y={350}
                text="Metal atoms share a sea of delocalized electrons."
                fontSize={16}
                fill="#333"
              />
            </>
          )}

          {currentStep === "finished" && (
            <Text
              x={100}
              y={180}
              text="Congratulations! You completed the Atomic Bonding Story. 🎉"
              fontSize={22}
              fill="#3a3"
            />
          )}
        </Layer>
      </Stage>

      <div style={{ marginTop: 20 }}>
        <p><strong>🧪 Explanation:</strong> {message}</p>
      </div>

      <div style={{ marginTop: 10 }}>
        {/* Controls based on step */}
        {currentStep === "intro" && (
          <button onClick={nextStep}>Start Story</button>
        )}

        {currentStep === "ionic" && (
          <>
            <button onClick={runIonicAnimation}>Run Ionic Bond Animation</button>
            <button onClick={nextStep} style={{ marginLeft: 10 }}>
              Next: Covalent Bond
            </button>
          </>
        )}

        {currentStep === "covalent" && (
          <>
            <button onClick={() => setPracticeMode(!practiceMode)}>
              {practiceMode ? "Stop Practice" : "Try Covalent Practice"}
            </button>
            <button onClick={nextStep} style={{ marginLeft: 10 }}>
              Next: Metallic Bond
            </button>
          </>
        )}

        {currentStep === "metallic" && (
          <button onClick={nextStep}>Finish Story</button>
        )}

        {currentStep === "finished" && (
          <button onClick={() => {
            setStepIndex(0);
            setMessage("Welcome! Let's explore atomic bonding.");
          }}>Restart Story</button>
        )}
      </div>

      <hr style={{ marginTop: 30 }} />

      {/* Show bonding info for current step */}
      {(currentStep === "ionic" || currentStep === "covalent" || currentStep === "metallic") && (
        <div>
          <h2>{currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Bonding Details</h2>
          <p><strong>Description:</strong> {bondingInfo[currentStep.charAt(0).toUpperCase() + currentStep.slice(1)].description}</p>
          <p><strong>Example:</strong> {bondingInfo[currentStep.charAt(0).toUpperCase() + currentStep.slice(1)].example}</p>
          <p><strong>Animation:</strong> {bondingInfo[currentStep.charAt(0).toUpperCase() + currentStep.slice(1)].animation}</p>
        </div>
      )}
    </div>
  );
}
