import React, { useState } from "react";
import { DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import "../assets/css/PercentComposition.css";

export default function PercentComposition({ onComplete }) {
  const [step, setStep] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [atoms, setAtoms] = useState({
    h1: { type: "hydrogen", location: "bin" },
    h2: { type: "hydrogen", location: "bin" },
    o1: { type: "oxygen", location: "bin" },
    c1: { type: "carbon", location: "bin" },
    o2: { type: "oxygen", location: "bin" },
    o3: { type: "oxygen", location: "bin" },
  });

  const prompts = [
    {
      title: "Lesson 6: Percent Composition",
      description:
        "In this lesson, you'll calculate the percent composition of a compound by dragging atoms into the molecule. Start with H₂O!",
    },
    {
      title: "Example: Hydrogen in H₂O",
      description: "Drag the Hydrogen (H) atoms into the H₂O molecule. Hint: H₂O has 2 H and 1 O.",
      correct: { hydrogen: 2, oxygen: 1 },
    },
    {
      title: "Final Challenge: Carbon in CO₂",
      description: "Drag the atoms to build CO₂. Hint: CO₂ has 1 C and 2 O.",
      correct: { carbon: 1, oxygen: 2 },
    },
  ];

  // --- Drag events ---
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);
    if (!over) return;

    // Snap to the droppable zone
    setAtoms((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], location: over.id },
    }));
  };

  // --- Droppable zone ---
  function MoleculeZone() {
    const { isOver, setNodeRef } = useDroppable({ id: "molecule" });
    const zoneClass = isOver ? "molecule-zone hovering" : "molecule-zone";
    return (
      <div ref={setNodeRef} className={zoneClass} id="molecule">
        {Object.entries(atoms)
          .filter(([, atom]) => atom.location === "molecule")
          .map(([id, atom]) => (
            <DraggableAtom key={id} id={id} type={atom.type} isHidden={activeId === id} />
          ))}
      </div>
    );
  }

  const renderBinAtoms = () =>
    Object.entries(atoms)
      .filter(([, atom]) => atom.location === "bin")
      .map(([id, atom]) => <DraggableAtom key={id} id={id} type={atom.type} isHidden={activeId === id} />);

  // --- Check molecule correctness ---
  const checkMolecule = () => {
    const currentPrompt = prompts[step];
    const moleculeCounts = Object.values(atoms)
      .filter((a) => a.location === "molecule")
      .reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {});

    let allCorrect = true;
    for (const key in currentPrompt.correct) {
      if (moleculeCounts[key] !== currentPrompt.correct[key]) allCorrect = false;
    }

    if (allCorrect) {
      setFeedback(`✅ Correct! ${step === 1 ? "H₂O" : "CO₂"} is complete.`);
      setTimeout(() => {
        if (step === 2) onComplete();
        else {
          // Reset for next step
          setAtoms((prev) => ({
            ...prev,
            c1: { ...prev.c1, location: "bin" },
            o2: { ...prev.o2, location: "bin" },
            o3: { ...prev.o3, location: "bin" },
          }));
          setFeedback("");
          setStep((prev) => prev + 1);
        }
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  // --- Intro Screen ---
  if (step === 0) {
    return (
      <div className="lesson-modal percent-composition">
        <div className="intro-screen">
          <h1 className="intro-pc-title">{prompts[0].title}</h1>
          <p className="intro-text">{prompts[0].description}</p>
          <button onClick={() => setStep(1)} className="intro-start-btn">
            Start Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-modal percent-composition">
        <div className="info-pc-box">
          <h3>{prompts[step].title}</h3>
          <p>{prompts[step].description}</p>
        </div>

        <MoleculeZone />

        <div className="parts-bin" id="bin">
          <h3>Atom Bin</h3>
          <div className="particles-container">{renderBinAtoms()}</div>
        </div>

        <div className="controls-area">
          <button
            onClick={checkMolecule}
            className={`check-btn ${feedback.includes("❌") ? "incorrect" : ""}`}
          >
            Check Molecule
          </button>
        </div>

        {feedback && <p className="feedback">{feedback}</p>}

        <DragOverlay>
          {activeId && atoms[activeId] && (
            <div className={`particle ${atoms[activeId].type} is-dragging`}></div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

// --- Reusable Draggable Atom ---
function DraggableAtom({ id, type, isHidden }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    visibility: isHidden ? "hidden" : "visible",
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`particle ${type}`}
      style={style}
    ></div>
  );
}
