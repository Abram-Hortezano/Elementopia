// PercentCompositionChallenge1.jsx
import React, { useState } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const elementsList = [
  { symbol: "H", name: "Hydrogen" },
  { symbol: "O", name: "Oxygen" },
  { symbol: "C", name: "Carbon" },
  { symbol: "N", name: "Nitrogen" },
];

// target definition (counts)
const TARGETS = {
  "CO₂": { C: 1, O: 2 },
  "H₂O": { H: 2, O: 1 }
};

export default function PercentCompositionChallenge1({
  target = "CO₂",
  onComplete = () => {}
}) {
  const [placedCounts, setPlacedCounts] = useState({}); // { C:1, O:2 }
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const correctElements = TARGETS[target];

  // helper to get total number of atoms placed
  const totalPlaced = Object.values(placedCounts).reduce((s, v) => s + v, 0);

  function handleDropSymbol(symbol) {
    if (isCompleted) return;

    // optional: limit total atoms to avoid overflow (set to 6 to be safe)
    if (totalPlaced >= 8) return;

    setPlacedCounts(prev => {
      const next = { ...prev, [symbol]: (prev[symbol] || 0) + 1 };
      // after placing, auto-check
      checkIfComplete(next);
      return next;
    });
  }

  function checkIfComplete(counts) {
    // require exact key set and exact counts
    const keysCorrect = Object.keys(correctElements).every(k => counts[k] === correctElements[k]);
    // ensure there are no extra elements placed
    const noExtra = Object.keys(counts).every(k => (correctElements[k] || 0) === counts[k]);
    if (keysCorrect && noExtra) {
      setIsCompleted(true);
      setMessage(`🎉 Nicely done — ${target} built!`);
      setTimeout(() => onComplete(), 900);
    } else {
      setMessage("");
    }
  }

  function handleDragStart(e, symbol) {
    e.dataTransfer.setData("symbol", symbol);
    // allow custom drag image or visual if needed
  }

  function handleDropZoneOver(e) {
    e.preventDefault();
  }

  function handleDropZone(e) {
    e.preventDefault();
    const symbol = e.dataTransfer.getData("symbol");
    if (!symbol) return;
    handleDropSymbol(symbol);
  }

  function removeOne(symbol) {
    setPlacedCounts(prev => {
      if (!prev[symbol]) return prev;
      const next = { ...prev, [symbol]: prev[symbol] - 1 };
      if (next[symbol] <= 0) delete next[symbol];
      // clear completion if undone
      setIsCompleted(false);
      setMessage("");
      return next;
    });
  }

  // render each placed atom as individual tokens (based on counts)
  const placedTiles = [];
  Object.entries(placedCounts).forEach(([sym, count]) => {
    for (let i = 0; i < count; i++) placedTiles.push(sym);
  });

  return (
    <div className="pc-challenge-wrapper">
      <div className="pc-challenge-container">
        <h2>Build the Compound!</h2>
        <p className="pc-challenge-desc">
          Drag the correct elements to form <strong>{target}</strong>.
        </p>

        <div
          className="pc-drop-zone"
          onDragOver={handleDropZoneOver}
          onDrop={handleDropZone}
          aria-label="Molecule drop zone"
        >
          {placedTiles.length === 0 && !isCompleted && (
            <p className="pc-drop-hint">Drop elements here</p>
          )}

          {placedTiles.map((sym, idx) => (
            <div key={idx} className="pc-placed-tile" title="Click to remove" onClick={() => removeOne(sym)}>
              {sym}
            </div>
          ))}

          {isCompleted && (
            <div className="success-popup">🎉 Great job! You built {target} correctly!</div>
          )}
        </div>

        <div className="pc-elements-pool">
          {elementsList.map((el, i) => (
            <div
              key={i}
              className="pc-element-tile"
              draggable={!isCompleted}
              onDragStart={(e) => handleDragStart(e, el.symbol)}
              onDragEnd={(e) => e.preventDefault()}
            >
              {el.symbol}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            className="pc-submit-btn"
            onClick={() => {
              // manual check & feedback
              const keysCorrect = Object.keys(correctElements).every(k => placedCounts[k] === correctElements[k]);
              const noExtra = Object.keys(placedCounts).every(k => (correctElements[k] || 0) === placedCounts[k]);
              if (keysCorrect && noExtra) {
                setIsCompleted(true);
                setMessage(`🎉 Correct! ${target} built.`);
                setTimeout(() => onComplete(), 700);
              } else {
                setMessage("❌ Not correct yet. Adjust atoms or remove extras.");
              }
            }}
          >
            Check Build
          </button>
          <button
            className="pc-submit-btn"
            style={{ marginLeft: 8, background: "rgba(155,89,182,0.6)" }}
            onClick={() => {
              setPlacedCounts({});
              setIsCompleted(false);
              setMessage("");
            }}
          >
            Reset
          </button>
        </div>

        {message && <div style={{ marginTop: 12 }} className="pc-success-popup">{message}</div>}
      </div>
    </div>
  );
}
