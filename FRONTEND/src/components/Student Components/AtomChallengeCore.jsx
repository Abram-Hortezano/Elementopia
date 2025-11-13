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
  if (location === "shell" && type === "electron" && index !== undefined && total !== undefined) {
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
    <div ref={setNodeRef} className={`${className} ${isOver ? "hovering" : ""}`}>
      {children}
    </div>
  );
}

// --- Particle Orb ---
function ParticleOrb({ type, count, size = "small" }) {
  const orbSize = {
    tiny: "35px",
    small: "45px",
    medium: "55px"
  }[size];

  const orbStyle = {
    width: orbSize,
    height: orbSize,
    background: type === "proton" 
      ? "radial-gradient(circle, #ff6b6b, #e74c3c)"
      : "radial-gradient(circle, #bdc3c7, #95a5a6)",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    boxShadow: type === "proton"
      ? "0 0 15px rgba(231, 76, 60, 0.6)"
      : "0 0 15px rgba(149, 165, 166, 0.6)",
    border: `2px solid ${type === "proton" ? "#ff7979" : "#ecf0f1"}`,
    margin: "3px",
    position: "relative"
  };

  return (
    <div className="particle-orb" style={orbStyle}>
      <div className="orb-count" style={{ 
        fontSize: size === "tiny" ? "1rem" : "1.2rem",
        lineHeight: "1.1"
      }}>
        {count}
      </div>
      <div className="orb-label" style={{ 
        fontSize: size === "tiny" ? "0.5rem" : "0.6rem",
        opacity: 0.9,
        marginTop: "1px"
      }}>
        {type === "proton" ? "p" : "n"}
      </div>
    </div>
  );
}

// --- Combined Nucleus Display ---
function CombinedNucleusDisplay({ protons, neutrons }) {
  // Create separate orbs for protons and neutrons
  const protonOrbs = [];
  const neutronOrbs = [];
  
  // Split protons into groups of max 10
  let remainingProtons = protons;
  while (remainingProtons > 0) {
    const groupCount = Math.min(remainingProtons, 10);
    protonOrbs.push(groupCount);
    remainingProtons -= groupCount;
  }
  
  // Split neutrons into groups of max 10
  let remainingNeutrons = neutrons;
  while (remainingNeutrons > 0) {
    const groupCount = Math.min(remainingNeutrons, 10);
    neutronOrbs.push(groupCount);
    remainingNeutrons -= groupCount;
  }

  const getOrbSize = (count, index, total) => {
    if (total === 1 && count <= 5) return "small";
    if (count >= 8) return "small";
    return "tiny";
  };

  return (
    <div className="combined-nucleus">
      <div className="nucleus-orbs-container">
        {/* Proton Orbs */}
        {protonOrbs.length > 0 && (
          <div className="proton-orbs-group">
            {protonOrbs.map((count, index) => (
              <ParticleOrb
                key={`proton-${index}`}
                type="proton"
                count={count}
                size={getOrbSize(count, index, protonOrbs.length)}
              />
            ))}
          </div>
        )}
        
        {/* Neutron Orbs */}
        {neutronOrbs.length > 0 && (
          <div className="neutron-orbs-group">
            {neutronOrbs.map((count, index) => (
              <ParticleOrb
                key={`neutron-${index}`}
                type="neutron"
                count={count}
                size={getOrbSize(count, index, neutronOrbs.length)}
              />
            ))}
          </div>
        )}
      </div>
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
      const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      generatedParticles[`extra${i + 1}`] = { type: randomType, location: "bin", isExtra: true };
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

  // ✅ Function to count particles in nucleus
  const getNucleusParticles = () => {
    const nucleusParticles = Object.values(particles).filter(p => p.location === "nucleus");
    const protons = nucleusParticles.filter(p => p.type === "proton").length;
    const neutrons = nucleusParticles.filter(p => p.type === "neutron").length;
    const electrons = nucleusParticles.filter(p => p.type === "electron").length;
    
    return { protons, neutrons, electrons, total: protons + neutrons + electrons };
  };

  const renderParticlesIn = (location) => {
    // ✅ For nucleus, check if we should show combined view
    if (location === "nucleus") {
      const nucleusStats = getNucleusParticles();
      
      // Show combined view when total particles exceed 3
      if (nucleusStats.total > 3) {
        return (
          <CombinedNucleusDisplay 
            protons={nucleusStats.protons} 
            neutrons={nucleusStats.neutrons} 
          />
        );
      }
    }

    // ✅ Regular rendering for other locations or when nucleus has 3 or fewer particles
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
            <div className="particles-container">{renderParticlesIn("bin")}</div>
          </DropZone>

          <div className="controls-area">
            <button onClick={handleCheck} className="complete-btn">
              Check Atom
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && <div className={`particle ${activeParticleType} is-dragging`} />}
      </DragOverlay>
    </DndContext>
  );
}