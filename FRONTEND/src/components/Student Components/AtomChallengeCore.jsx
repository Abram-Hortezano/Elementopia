import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/AtomChallenge.css";

// --- Draggable Particle ---
function DraggableParticle({ id, type, isHidden, index, total, location }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const particleStyle = {
    visibility: isHidden ? "hidden" : "visible",
    position: "relative",
    transition: "all 0.25s ease",
  };

  // ✅ Position electrons in orbit only when inside the shell
  if (
    location === "shell" &&
    type === "electron" &&
    index !== undefined &&
    total !== undefined
  ) {
    const angle = (index / total) * 360;
    const radius = 140;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    Object.assign(particleStyle, {
      position: "absolute",
      top: `calc(50% + ${y}px - 12px)`,
      left: `calc(50% + ${x}px - 12px)`,
    });
  } else {
    Object.assign(particleStyle, {
      position: "relative",
      top: "auto",
      left: "auto",
      transform: "none",
      margin: "0",
    });
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`particle ${type}`}
      style={particleStyle}
    />
  );
}

// --- Drop Zone ---
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "hovering" : ""}`}
    >
      {children}
    </div>
  );
}

// --- Main Challenge Component ---
export default function AtomChallengeCore({ challenge, onChallengeComplete }) {
  const [particles, setParticles] = useState({});
  const [activeId, setActiveId] = useState(null);

  // ✅ Auto-generate particles based on challenge requirements + random extras
  useEffect(() => {
    const generatedParticles = {};
    let id = 1;

    // Core required particles
    for (let i = 0; i < challenge.protons; i++) {
      generatedParticles[`p${id}`] = { type: "proton", location: "bin" };
      id++;
    }

    for (let i = 0; i < challenge.neutrons; i++) {
      generatedParticles[`n${id}`] = { type: "neutron", location: "bin" };
      id++;
    }

    for (let i = 0; i < challenge.electrons; i++) {
      generatedParticles[`e${id}`] = { type: "electron", location: "bin" };
      id++;
    }

    // ✅ Add two random extra particles
    const particleTypes = ["proton", "neutron", "electron"];
    for (let i = 0; i < 2; i++) {
      const randomType =
        particleTypes[Math.floor(Math.random() * particleTypes.length)];
      generatedParticles[`extra${i + 1}`] = {
        type: randomType,
        location: "bin",
        isExtra: true,
      };
    }

    setParticles(generatedParticles);
  }, [challenge]);

  const activeParticleType = activeId ? particles[activeId]?.type : null;

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);
    if (!over) return;

    setParticles((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], location: over.id },
    }));
  };

  const handleCheck = () => {
    const nucleusProtons = Object.values(particles).filter(
      (p) => p.location === "nucleus" && p.type === "proton"
    ).length;
    const nucleusNeutrons = Object.values(particles).filter(
      (p) => p.location === "nucleus" && p.type === "neutron"
    ).length;
    const shellElectrons = Object.values(particles).filter(
      (p) => p.location === "shell" && p.type === "electron"
    ).length;

    if (
      nucleusProtons === challenge.protons &&
      nucleusNeutrons === challenge.neutrons &&
      shellElectrons === challenge.electrons
    ) {
      alert(`✅ Correct! You built ${challenge.name}!`);
      onChallengeComplete();
    } else {
      alert("❌ Not quite right! Try again.");
    }
  };

  const renderParticlesIn = (location) => {
    const particlesInLocation = Object.entries(particles).filter(
      ([, p]) => p.location === location
    );
    return particlesInLocation.map(([id, p], index) => (
      <DraggableParticle
        key={id}
        id={id}
        type={p.type}
        location={location}
        isHidden={id === activeId}
        index={location === "shell" ? index : undefined}
        total={location === "shell" ? particlesInLocation.length : undefined}
      />
    ));
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="atom-challenge-wrapper">
        <div className="lesson-modal atom-builder">
          <h2>Build {challenge.name}</h2>

          <div className="atom-diagram">
            <DropZone id="nucleus" className="nucleus">
              {renderParticlesIn("nucleus")}
            </DropZone>
            <DropZone id="shell" className="electron-shell">
              {renderParticlesIn("shell")}
            </DropZone>
          </div>

          <DropZone id="bin" className="parts-bin">
            <h4>Available Parts</h4>
            <div className="particles-container">
              {renderParticlesIn("bin")}
            </div>
          </DropZone>

          <div className="controls-area">
            <button onClick={handleCheck} className="complete-btn">
              Check Atom
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className={`particle ${activeParticleType} is-dragging`} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
