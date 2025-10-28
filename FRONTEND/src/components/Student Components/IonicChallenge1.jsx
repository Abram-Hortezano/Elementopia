import React, { useState, useEffect } from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from "@dnd-kit/core";
import "../../assets/css/ChallengeOne.css";

export default function ChallengeOne({ onComplete }) {
  const [challenge, setChallenge] = useState(1);
  const [items, setItems] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [bondFormed, setBondFormed] = useState(false);

  useEffect(() => {
    resetChallenge(challenge);
  }, [challenge]);

  const handleDragStart = (event) => {
    if (items[event.active.id]?.type === "electron") setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !items[active.id]) return;
    setItems((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], location: over.id },
    }));
  };

  const checkBond = () => {
    let correct = false;
    if (challenge === 1) correct = checkNaCl();
    else if (challenge === 2) correct = checkMgCl2();
    else if (challenge === 3) correct = checkCaO();

    if (correct) {
      setStatus("correct");
      setBondFormed(true);
      setTimeout(() => {
        if (challenge < 3) {
          setChallenge(challenge + 1);
          setBondFormed(false);
          setStatus("pending");
        } else {
          onComplete?.();
        }
      }, 1500);
    } else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1000);
    }
  };

  // --- Bond correctness check ---
  const countElectronsOn = (atomId) =>
    Object.values(items).filter((item) => item.type === "electron" && item.location === atomId)
      .length;

  const checkNaCl = () => countElectronsOn("cl") === 1;
  const checkMgCl2 = () => countElectronsOn("cl") === 2;
  const checkCaO = () => countElectronsOn("o") === 2;

  // --- Randomize challenge setup ---
  const resetChallenge = (num) => {
    let atoms = {};
    let electrons = {};
    let leftId, rightId;

    if (num === 1) {
      leftId = "na";
      rightId = "cl";
      atoms = { [leftId]: { type: "sodium" }, [rightId]: { type: "chlorine" } };
    } else if (num === 2) {
      leftId = "mg";
      rightId = "cl";
      atoms = { [leftId]: { type: "magnesium" }, [rightId]: { type: "chlorine" } };
    } else {
      leftId = "ca";
      rightId = "o";
      atoms = { [leftId]: { type: "calcium" }, [rightId]: { type: "oxygen" } };
    }

    // 🎲 Random number of electrons on left atom (2–5)
    const numElectrons = Math.floor(Math.random() * 4) + 2;
    const newElectrons = {};
    for (let i = 1; i <= numElectrons; i++) {
      newElectrons[`e${i}`] = { type: "electron", location: leftId };
    }

    // 🎲 Possibly 0–2 electrons already on right atom
    const extraRight = Math.floor(Math.random() * 3);
    for (let i = numElectrons + 1; i <= numElectrons + extraRight; i++) {
      newElectrons[`e${i}`] = { type: "electron", location: rightId };
    }

    setItems({ ...atoms, ...newElectrons });
    setStatus("pending");
  };

  // --- Dynamic labels ---
  const atomLeft = challenge === 1 ? "na" : challenge === 2 ? "mg" : "ca";
  const atomRight = challenge === 1 ? "cl" : challenge === 2 ? "cl" : "o";
  const symbolLeft = challenge === 1 ? "Na" : challenge === 2 ? "Mg" : "Ca";
  const symbolRight = challenge === 1 ? "Cl" : challenge === 2 ? "Cl" : "O";

  const title =
    challenge === 1
      ? "Challenge 1: Form Sodium Chloride (NaCl)"
      : challenge === 2
      ? "Challenge 2: Form Magnesium Chloride (MgCl₂)"
      : "Challenge 3: Form Calcium Oxide (CaO)";

  const instruction =
    challenge === 1
      ? "Drag one electron from Sodium (Na) to Chlorine (Cl)."
      : challenge === 2
      ? "Drag two electrons from Magnesium (Mg) to Chlorine (Cl)."
      : "Drag two electrons from Calcium (Ca) to Oxygen (O).";

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-modal ionic-bonding">
        <div className="challenge-box">
          <h3>{title}</h3>
          <p>{instruction}</p>

          <div className={`workspace ${bondFormed ? "bonded" : ""}`}>
            <DropZone
              id={atomLeft}
              className={`atom left-atom ${items[atomLeft]?.type} ${
                bondFormed ? "final-state" : ""
              }`}
            >
              <span className="atom-symbol">{symbolLeft}</span>
              {renderElectronsOn(atomLeft, items, activeId)}
            </DropZone>

            <DropZone
              id={atomRight}
              className={`atom right-atom ${items[atomRight]?.type} ${
                bondFormed ? "final-state opposite" : ""
              }`}
            >
              <span className="atom-symbol">{symbolRight}</span>
              {renderElectronsOn(atomRight, items, activeId)}
            </DropZone>
          </div>

          {status === "correct" ? (
            <div className="success-message">
              <p>✅ Great! Bond formed correctly!</p>
            </div>
          ) : (
            <button onClick={checkBond} className={`check-btn ${status}`}>
              Check
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId ? <div className="electron is-dragging"></div> : null}
      </DragOverlay>
    </DndContext>
  );
}

/* --- Drop Zone --- */
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? "hovering" : ""}`}>
      {children}
    </div>
  );
}

/* --- Electron --- */
function Electron({ id, isHidden, angle }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `rotate(${angle}deg) translate(55px) rotate(-${angle}deg)`,
    visibility: isHidden ? "hidden" : "visible",
  };
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="electron"
      style={style}
    ></div>
  );
}

/* --- Helper --- */
function renderElectronsOn(atomId, items, activeId) {
  const electrons = Object.entries(items).filter(
    ([, item]) => item.type === "electron" && item.location === atomId
  );
  const total = electrons.length;

  return electrons.map(([id], i) => {
    const angle = total > 0 ? (i / total) * 360 : 0;
    return <Electron key={id} id={id} angle={angle} isHidden={id === activeId} />;
  });
}
