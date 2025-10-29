import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/ChallengeOne.css";

export default function IonicChallenge2() {
  const [challenge, setChallenge] = useState(1);
  const [items, setItems] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [bondFormed, setBondFormed] = useState(false);

  // 🧩 Challenge data
  const challenges = [
    {
      id: 1,
      title: "Sodium Chloride (NaCl)",
      atom1: "sodium",
      atom2: "chlorine",
      targetTransfer: 1,
      message: "✅ Excellent! Na⁺ and Cl⁻ form Sodium Chloride!",
    },
    {
      id: 2,
      title: "Magnesium Oxide (MgO)",
      atom1: "magnesium",
      atom2: "oxygen",
      targetTransfer: 2,
      message: "✅ Excellent! Mg²⁺ and O²⁻ form Magnesium Oxide!",
    },
    {
      id: 3,
      title: "Aluminum Nitride (AlN)",
      atom1: "aluminum",
      atom2: "nitrogen",
      targetTransfer: 3,
      message: "✅ Excellent! Al³⁺ and N³⁻ form Aluminum Nitride!",
    },
  ];

  const current = challenges[challenge - 1];

  // 🔁 Reset challenge when changing
  useEffect(() => {
    if (current) resetChallenge(current);
  }, [challenge]);

  const resetChallenge = (data) => {
    const { atom1, atom2, targetTransfer } = data;
    const totalElectrons = targetTransfer + Math.floor(Math.random() * 3);
    const newItems = {
      [atom1]: { type: atom1 },
      [atom2]: { type: atom2 },
    };
    for (let i = 1; i <= totalElectrons; i++) {
      newItems[`e${i}`] = { type: "electron", location: atom1 };
    }
    setItems(newItems);
    setStatus("pending");
    setBondFormed(false);
  };

  const handleDragStart = (event) => {
    if (items[event.active.id]?.type === "electron") {
      setActiveId(event.active.id);
    }
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
    const eOnAtom2 = Object.values(items).filter(
      (i) => i.type === "electron" && i.location === current.atom2
    ).length;
    const eOnAtom1 = Object.values(items).filter(
      (i) => i.type === "electron" && i.location === current.atom1
    ).length;

    if (eOnAtom2 === current.targetTransfer && eOnAtom1 < current.targetTransfer) {
      setStatus("correct");
      setBondFormed(true);
      setTimeout(() => {
        if (challenge < challenges.length) {
          setChallenge(challenge + 1);
        }
      }, 2500);
    } else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1000);
    }
  };

  if (challenge > challenges.length) {
    return (
      <div className="lesson-modal ionic-bonding completed">
        <h2>🎉 All Challenges Completed!</h2>
        <p>Excellent work forming all ionic bonds!</p>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-modal ionic-bonding">
        <div className={`challenge-box ${bondFormed ? "bonded" : ""}`}>
          <h3>
            Challenge {challenge}: {current.title}
          </h3>
          <p>
            Transfer {current.targetTransfer} electron
            {current.targetTransfer > 1 ? "s" : ""} from{" "}
            {capitalize(current.atom1)} to {capitalize(current.atom2)}.
          </p>

          <div className={`workspace ${bondFormed ? "bonded" : ""}`}>
            <DropZone
              id={current.atom1}
              className={`atom left-atom ${current.atom1} ${
                bondFormed ? "final-state" : ""
              }`}
            >
              <div className="atom-symbol">{getSymbol(current.atom1)}</div>
              {renderElectronsOn(current.atom1, items, activeId)}
            </DropZone>

            <DropZone
              id={current.atom2}
               className={`atom right-atom ${current.atom2} ${bondFormed ? "final-state opposite" : ""}`}
            >
              <div className="atom-symbol">{getSymbol(current.atom2)}</div>
              {renderElectronsOn(current.atom2, items, activeId)}
            </DropZone>
          </div>

          {status === "correct" ? (
            <div className="success-message">{current.message}</div>
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
    />
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

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// 🧪 Map atom names to their symbols
function getSymbol(atom) {
  const map = {
    sodium: "Na",
    chlorine: "Cl",
    magnesium: "Mg",
    oxygen: "O",
    aluminum: "Al",
    nitrogen: "N",
  };
  return map[atom] || atom.charAt(0).toUpperCase();
}
