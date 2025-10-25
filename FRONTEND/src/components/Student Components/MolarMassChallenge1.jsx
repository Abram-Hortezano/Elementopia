// MolarMassChallenge1.jsx
import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Drag element tiles into cauldron. Show running mass and target.
If within tolerance -> success.
*/

const ATOMIC = {
  H: 1.008,
  O: 15.999,
  C: 12.011,
  N: 14.007,
  Na: 22.99,
  Cl: 35.45,
};

const ELEMENTS = Object.keys(ATOMIC).map((k) => ({ symbol: k, mass: ATOMIC[k] }));

const TARGETS = [
  { name: "H₂O", target: 18.015 },
  { name: "CO₂", target: 44.01 },
  { name: "NaCl", target: 58.44 },
];

export default function MolarMassChallenge1({ onComplete }) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [cauldron, setCauldron] = useState([]);
  const [msg, setMsg] = useState("Drag elements into the cauldron to reach the target mass.");
  const [score, setScore] = useState(0);

  const onDragStart = (e, sym) => e.dataTransfer.setData("element", sym);
  const onDrop = (e) => {
    e.preventDefault();
    const sym = e.dataTransfer.getData("element");
    if (sym) setCauldron((prev) => [...prev, sym]);
  };

  // ✅ FIXED: unique variable names in reduce
  const mass = cauldron.reduce((total, symbol) => total + ATOMIC[symbol], 0);

  function mix() {
    const diff = Math.abs(mass - TARGETS[targetIdx].target);
    if (diff <= 0.5) {
      setMsg(`Perfect! You created ${TARGETS[targetIdx].name}`);
      setScore((s) => s + 100);
      const next = targetIdx + 1;
      setTimeout(() => {
        if (next < TARGETS.length) {
          setTargetIdx(next);
          setCauldron([]);
          setMsg("Next target!");
        } else {
          setMsg("All targets made! Great work!");
          if (onComplete) onComplete();
        }
      }, 800);
    } else {
      setMsg(`Not yet. Difference: ${diff.toFixed(2)} g/mol`);
      setScore((s) => Math.max(0, s - 10));
    }
  }

  return (
    <div className="game-container">
      <h2>⚗️ Mole Mixer</h2>
      <div className="mixer-top">
        {/* --- ELEMENT PANEL --- */}
        <div className="elements-panel">
          <h4>Elements</h4>
          <div className="element-grid">
            {ELEMENTS.map((el) => (
              <div
                key={el.symbol}
                className="element-card"
                draggable
                onDragStart={(e) => onDragStart(e, el.symbol)}
              >
                <div className="element-symbol">{el.symbol}</div>
                <div className="element-mass">{el.mass}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CAULDRON --- */}
        <div className="cauldron-area">
          <div className="target">
            <strong>Target:</strong> {TARGETS[targetIdx].name} — {TARGETS[targetIdx].target} g/mol
          </div>

          <div className="cauldron" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <div className="cauldron-inside">
              {cauldron.length === 0 ? (
                <div className="cauldron-empty">Drop elements here</div>
              ) : (
                <div className="cauldron-list">
                  {cauldron.map((s, i) => (
                    <div key={i} className="cauldron-item">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- CONTROLS --- */}
          <div className="mixer-controls">
            <div>Current mass: {mass.toFixed(2)} g/mol</div>
            <button className="game-btn" onClick={mix}>
              Mix
            </button>
            <button className="game-btn" onClick={() => setCauldron([])}>
              Empty
            </button>
            <div className="score">Score: {score}</div>
          </div>
          <p className="message">{msg}</p>
        </div>
      </div>
    </div>
  );
}
